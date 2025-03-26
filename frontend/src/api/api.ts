import axios from 'axios';

// Dynamische API-URL basierend auf der Umgebung
const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3002' 
  : `https://${window.location.hostname.replace('3000', '3002')}`;

// API-Client für Backend-Anfragen
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Typdefinitionen
export interface Movie {
  id: number;
  title: string;
  type: 'movie';
  releaseDate?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string;
  voteAverage?: number;
  runtime?: number;
  genres?: { id: number; name: string }[];
  cast?: { id: number; name: string; character: string; profile_path?: string | null }[];
  crew?: { id: number; name: string; job: string; profile_path?: string | null }[];
  recommendations?: { id: number; title: string; type: string; posterPath?: string | null }[];
  videos?: { id: string; key: string; name: string; site: string; type: string }[];
}

export interface TvShow {
  id: number;
  title: string;
  type: 'tv';
  releaseDate?: string;
  posterPath?: string | null;
  backdropPath?: string | null;
  overview?: string;
  voteAverage?: number;
  seasons?: { id: number; name: string; episode_count: number; poster_path?: string | null }[];
  episodes?: number;
  genres?: { id: number; name: string }[];
  cast?: { id: number; name: string; character: string; profile_path?: string | null }[];
  crew?: { id: number; name: string; job: string; profile_path?: string | null }[];
  recommendations?: { id: number; title: string; type: string; posterPath?: string | null }[];
  videos?: { id: string; key: string; name: string; site: string; type: string }[];
}

export interface SearchResults {
  movies: Movie[];
  tvShows: TvShow[];
}

export interface AIRecommendation {
  id?: number;
  title: string;
  year?: string;
  reason: string;
  type: 'movie' | 'tv';
  posterPath?: string | null;
  voteAverage?: number;
}

export interface AIRecommendationResponse {
  query: string;
  movies: AIRecommendation[];
  tvShows: AIRecommendation[];
}

// API-Funktionen
export const searchMedia = async (query: string, page = 1): Promise<SearchResults> => {
  const response = await apiClient.get(`/api/search?query=${encodeURIComponent(query)}&page=${page}`);
  return response.data;
};

export const getMovieDetails = async (id: number): Promise<Movie> => {
  const response = await apiClient.get(`/api/movie/${id}`);
  return response.data;
};

export const getTvShowDetails = async (id: number): Promise<TvShow> => {
  const response = await apiClient.get(`/api/tv/${id}`);
  return response.data;
};

export const getPopularMovies = async (page = 1) => {
  const response = await apiClient.get(`/api/movies/popular?page=${page}`);
  return response.data;
};

export const getPopularTvShows = async (page = 1) => {
  const response = await apiClient.get(`/api/tv/popular?page=${page}`);
  return response.data;
};

export const getDocumentaries = async (page = 1) => {
  const response = await apiClient.get(`/api/documentaries?page=${page}`);
  return response.data;
};

export const getAIRecommendations = async (query: string): Promise<AIRecommendationResponse> => {
  const response = await apiClient.post('/api/recommendations', { query });
  return response.data;
};

export default apiClient;
