const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');
const { OpenAI } = require('openai');

// Lade Umgebungsvariablen
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// OpenAI Konfiguration
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} catch (error) {
  console.warn('OpenAI konnte nicht initialisiert werden:', error.message);
  console.warn('KI-Empfehlungen werden nicht verfügbar sein.');
}

// Middleware
app.use(cors());
app.use(express.json());

// Hilfsfunktion für TMDB API-Anfragen
async function fetchFromTMDB(endpoint, params = {}) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'de-DE',
        ...params
      }
    });
    return response.data;
  } catch (error) {
    console.error('TMDB API Fehler:', error.message);
    throw new Error(`TMDB API Fehler: ${error.message}`);
  }
}

// Routen

// Startseite
app.get('/', (req, res) => {
  res.json({ message: 'Willkommen bei der Film- und Serienempfehlungs-API' });
});

// KI-Empfehlungen basierend auf Benutzeranfrage
app.post('/api/recommendations', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query) {
      return res.status(400).json({ error: 'Eine Anfrage ist erforderlich' });
    }
    
    if (!openai) {
      return res.status(503).json({ 
        error: 'KI-Empfehlungen sind derzeit nicht verfügbar',
        message: 'Bitte konfigurieren Sie den OpenAI API-Schlüssel in der .env-Datei'
      });
    }
    
    // Hole aktuelle beliebte Filme und Serien als Kontext
    const popularMovies = await fetchFromTMDB('/movie/popular', { page: 1 });
    const popularTvShows = await fetchFromTMDB('/tv/popular', { page: 1 });
    
    // Erstelle einen Kontext mit aktuellen Filmen und Serien
    const movieContext = popularMovies.results.slice(0, 10).map(m => 
      `${m.title} (${m.release_date?.substring(0, 4) || 'N/A'}) - ${m.overview?.substring(0, 100)}...`
    ).join('\n');
    
    const tvContext = popularTvShows.results.slice(0, 10).map(t => 
      `${t.name} (${t.first_air_date?.substring(0, 4) || 'N/A'}) - ${t.overview?.substring(0, 100)}...`
    ).join('\n');
    
    // Anfrage an das Sprachmodell
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `Du bist ein Filmexperte, der personalisierte Film- und Serienempfehlungen gibt.
          Basierend auf der Anfrage des Benutzers, empfehle 5 Filme und 5 Serien, die zu den Vorlieben passen könnten.
          Berücksichtige dabei aktuelle und beliebte Titel. Formatiere deine Antwort als JSON mit den Feldern 'movies' und 'tvShows',
          wobei jeder Eintrag 'title', 'year', 'reason' (warum du es empfiehlst) und 'type' (movie/tv) enthält.
          Hier sind einige aktuelle beliebte Filme und Serien als Referenz:
          
          AKTUELLE FILME:
          ${movieContext}
          
          AKTUELLE SERIEN:
          ${tvContext}`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.7,
      response_format: { type: "json_object" }
    });
    
    // Parsen der JSON-Antwort
    const recommendationsText = completion.choices[0].message.content;
    let recommendations;
    
    try {
      recommendations = JSON.parse(recommendationsText);
    } catch (error) {
      console.error('Fehler beim Parsen der KI-Antwort:', error);
      return res.status(500).json({ 
        error: 'Fehler beim Verarbeiten der KI-Empfehlungen',
        rawResponse: recommendationsText
      });
    }
    
    // Suche nach den empfohlenen Titeln in der TMDB-Datenbank, um Bilder und IDs zu erhalten
    const enhancedMovies = await Promise.all(recommendations.movies.map(async (movie) => {
      try {
        const searchQuery = `${movie.title} ${movie.year || ''}`;
        const searchResults = await fetchFromTMDB('/search/movie', { query: searchQuery });
        
        if (searchResults.results && searchResults.results.length > 0) {
          const bestMatch = searchResults.results[0];
          return {
            ...movie,
            id: bestMatch.id,
            posterPath: bestMatch.poster_path ? `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}` : null,
            voteAverage: bestMatch.vote_average
          };
        }
        return movie;
      } catch (error) {
        console.error(`Fehler bei der Suche nach ${movie.title}:`, error.message);
        return movie;
      }
    }));
    
    const enhancedTvShows = await Promise.all(recommendations.tvShows.map(async (show) => {
      try {
        const searchQuery = `${show.title} ${show.year || ''}`;
        const searchResults = await fetchFromTMDB('/search/tv', { query: searchQuery });
        
        if (searchResults.results && searchResults.results.length > 0) {
          const bestMatch = searchResults.results[0];
          return {
            ...show,
            id: bestMatch.id,
            posterPath: bestMatch.poster_path ? `https://image.tmdb.org/t/p/w500${bestMatch.poster_path}` : null,
            voteAverage: bestMatch.vote_average
          };
        }
        return show;
      } catch (error) {
        console.error(`Fehler bei der Suche nach ${show.title}:`, error.message);
        return show;
      }
    }));
    
    res.json({
      query,
      movies: enhancedMovies,
      tvShows: enhancedTvShows
    });
    
  } catch (error) {
    console.error('Fehler bei KI-Empfehlungen:', error.message);
    res.status(500).json({ error: 'Fehler bei der Verarbeitung der Empfehlungsanfrage' });
  }
});

// Suche nach Filmen und Serien
app.get('/api/search', async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Suchbegriff ist erforderlich' });
    }

    const movieResults = await fetchFromTMDB('/search/movie', { query, page });
    const tvResults = await fetchFromTMDB('/search/tv', { query, page });

    // Kombiniere und formatiere die Ergebnisse
    const formattedResults = {
      movies: movieResults.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        type: 'movie',
        releaseDate: movie.release_date,
        posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        overview: movie.overview,
        voteAverage: movie.vote_average
      })),
      tvShows: tvResults.results.map(show => ({
        id: show.id,
        title: show.name,
        type: 'tv',
        releaseDate: show.first_air_date,
        posterPath: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
        overview: show.overview,
        voteAverage: show.vote_average
      }))
    };

    res.json(formattedResults);
  } catch (error) {
    console.error('Suchfehler:', error.message);
    res.status(500).json({ error: 'Fehler bei der Suche' });
  }
});

// Details zu einem Film abrufen
app.get('/api/movie/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movieDetails = await fetchFromTMDB(`/movie/${id}`, { append_to_response: 'credits,recommendations,videos' });
    
    const formattedMovie = {
      id: movieDetails.id,
      title: movieDetails.title,
      type: 'movie',
      releaseDate: movieDetails.release_date,
      posterPath: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : null,
      backdropPath: movieDetails.backdrop_path ? `https://image.tmdb.org/t/p/original${movieDetails.backdrop_path}` : null,
      overview: movieDetails.overview,
      voteAverage: movieDetails.vote_average,
      runtime: movieDetails.runtime,
      genres: movieDetails.genres,
      cast: movieDetails.credits.cast.slice(0, 10),
      crew: movieDetails.credits.crew.filter(person => person.job === 'Director'),
      recommendations: movieDetails.recommendations.results.map(movie => ({
        id: movie.id,
        title: movie.title,
        type: 'movie',
        posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null
      })),
      videos: movieDetails.videos.results
        .filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
        .slice(0, 3)
    };
    
    res.json(formattedMovie);
  } catch (error) {
    console.error('Fehler beim Abrufen der Filmdetails:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen der Filmdetails' });
  }
});

// Details zu einer Serie abrufen
app.get('/api/tv/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const tvDetails = await fetchFromTMDB(`/tv/${id}`, { append_to_response: 'credits,recommendations,videos' });
    
    const formattedTvShow = {
      id: tvDetails.id,
      title: tvDetails.name,
      type: 'tv',
      releaseDate: tvDetails.first_air_date,
      posterPath: tvDetails.poster_path ? `https://image.tmdb.org/t/p/w500${tvDetails.poster_path}` : null,
      backdropPath: tvDetails.backdrop_path ? `https://image.tmdb.org/t/p/original${tvDetails.backdrop_path}` : null,
      overview: tvDetails.overview,
      voteAverage: tvDetails.vote_average,
      seasons: tvDetails.seasons,
      episodes: tvDetails.number_of_episodes,
      genres: tvDetails.genres,
      cast: tvDetails.credits.cast.slice(0, 10),
      crew: tvDetails.credits.crew.filter(person => person.job === 'Creator' || person.job === 'Executive Producer'),
      recommendations: tvDetails.recommendations.results.map(show => ({
        id: show.id,
        title: show.name,
        type: 'tv',
        posterPath: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null
      })),
      videos: tvDetails.videos.results
        .filter(video => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser'))
        .slice(0, 3)
    };
    
    res.json(formattedTvShow);
  } catch (error) {
    console.error('Fehler beim Abrufen der Seriendetails:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen der Seriendetails' });
  }
});

// Beliebte Filme abrufen
app.get('/api/movies/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const popularMovies = await fetchFromTMDB('/movie/popular', { page });
    
    const formattedMovies = popularMovies.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      type: 'movie',
      releaseDate: movie.release_date,
      posterPath: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
      overview: movie.overview,
      voteAverage: movie.vote_average
    }));
    
    res.json({
      results: formattedMovies,
      page: popularMovies.page,
      totalPages: popularMovies.total_pages,
      totalResults: popularMovies.total_results
    });
  } catch (error) {
    console.error('Fehler beim Abrufen beliebter Filme:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen beliebter Filme' });
  }
});

// Beliebte Serien abrufen
app.get('/api/tv/popular', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const popularTvShows = await fetchFromTMDB('/tv/popular', { page });
    
    const formattedTvShows = popularTvShows.results.map(show => ({
      id: show.id,
      title: show.name,
      type: 'tv',
      releaseDate: show.first_air_date,
      posterPath: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : null,
      overview: show.overview,
      voteAverage: show.vote_average
    }));
    
    res.json({
      results: formattedTvShows,
      page: popularTvShows.page,
      totalPages: popularTvShows.total_pages,
      totalResults: popularTvShows.total_results
    });
  } catch (error) {
    console.error('Fehler beim Abrufen beliebter Serien:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen beliebter Serien' });
  }
});

// Dokumentarfilme abrufen
app.get('/api/documentaries', async (req, res) => {
  try {
    const { page = 1 } = req.query;
    const documentaries = await fetchFromTMDB('/discover/movie', { 
      page,
      with_genres: '99' // Genre-ID für Dokumentarfilme
    });
    
    const formattedDocumentaries = documentaries.results.map(doc => ({
      id: doc.id,
      title: doc.title,
      type: 'movie',
      category: 'documentary',
      releaseDate: doc.release_date,
      posterPath: doc.poster_path ? `https://image.tmdb.org/t/p/w500${doc.poster_path}` : null,
      overview: doc.overview,
      voteAverage: doc.vote_average
    }));
    
    res.json({
      results: formattedDocumentaries,
      page: documentaries.page,
      totalPages: documentaries.total_pages,
      totalResults: documentaries.total_results
    });
  } catch (error) {
    console.error('Fehler beim Abrufen von Dokumentarfilmen:', error.message);
    res.status(500).json({ error: 'Fehler beim Abrufen von Dokumentarfilmen' });
  }
});

// Server starten
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server läuft auf Port ${PORT}`);
});

module.exports = app;
