import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Card, CardContent, CardMedia, Grid, Rating, Chip, CircularProgress } from '@mui/material';
import { getAIRecommendations, AIRecommendation } from '../api/api';

const RecommendationPage: React.FC = () => {
  const [query, setQuery] = useState<string>('');
  const [recommendations, setRecommendations] = useState<{movies: AIRecommendation[], tvShows: AIRecommendation[]}>({movies: [], tvShows: []});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await getAIRecommendations(query);
      setRecommendations(response);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Fehler beim Abrufen von Empfehlungen. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (id: number | undefined, type: 'movie' | 'tv', rating: number) => {
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    console.log(`Rated ${type} ${id} with ${rating} stars`);
    alert(`Danke für deine Bewertung!`);
  };

  const handleAddToWatchlist = (item: AIRecommendation) => {
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    console.log(`Added to watchlist:`, item);
    alert(`"${item.title}" wurde zu deiner Watchlist hinzugefügt!`);
  };

  const handleShare = (item: AIRecommendation) => {
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    console.log(`Shared:`, item);
    alert(`"${item.title}" wurde geteilt!`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Worauf hättest du Lust?
      </Typography>
      
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3, mb: 5, maxWidth: 600, mx: 'auto' }}>
        <TextField
          fullWidth
          label="Beschreibe, was du sehen möchtest..."
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="z.B. 'Etwas Spannendes mit überraschendem Ende' oder 'Eine leichte Komödie für einen regnerischen Tag'"
          multiline
          rows={2}
        />
        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          fullWidth 
          sx={{ mt: 2 }}
          disabled={loading || !query.trim()}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Empfehlungen erhalten'}
        </Button>
      </Box>

      {error && (
        <Typography color="error" align="center" sx={{ mb: 3 }}>
          {error}
        </Typography>
      )}

      {recommendations.movies.length > 0 && (
        <>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Filmempfehlungen
          </Typography>
          <Grid container spacing={3}>
            {recommendations.movies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} key={movie.id || `movie-${index}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={movie.posterPath ? `https://image.tmdb.org/t/p/w500${movie.posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={movie.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {movie.title} {movie.year && `(${movie.year})`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating 
                        name={`rating-${movie.id || index}`} 
                        defaultValue={0} 
                        precision={1} 
                        onChange={(_, value) => handleRating(movie.id, 'movie', value || 0)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {movie.reason}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                      <Button size="small" onClick={() => handleAddToWatchlist(movie)}>
                        Watchlist
                      </Button>
                      <Button size="small" onClick={() => handleShare(movie)}>
                        Teilen
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {recommendations.tvShows.length > 0 && (
        <>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
            Serienempfehlungen
          </Typography>
          <Grid container spacing={3}>
            {recommendations.tvShows.map((show, index) => (
              <Grid item xs={12} sm={6} md={4} key={show.id || `tv-${index}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={show.posterPath ? `https://image.tmdb.org/t/p/w500${show.posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                    alt={show.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div">
                      {show.title} {show.year && `(${show.year})`}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating 
                        name={`rating-${show.id || index}`} 
                        defaultValue={0} 
                        precision={1} 
                        onChange={(_, value) => handleRating(show.id, 'tv', value || 0)}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {show.reason}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 'auto' }}>
                      <Button size="small" onClick={() => handleAddToWatchlist(show)}>
                        Watchlist
                      </Button>
                      <Button size="small" onClick={() => handleShare(show)}>
                        Teilen
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {!loading && recommendations.movies.length === 0 && recommendations.tvShows.length === 0 && query && !error && (
        <Typography variant="body1" align="center" sx={{ mt: 4 }}>
          Keine Empfehlungen gefunden. Versuche es mit einer anderen Anfrage.
        </Typography>
      )}
    </Container>
  );
};

export default RecommendationPage;
