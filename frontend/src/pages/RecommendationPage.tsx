import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  CircularProgress,
  Box,
  Rating,
  Chip,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { 
  Favorite as FavoriteIcon, 
  Share as ShareIcon,
  BookmarkAdd as BookmarkAddIcon,
  ThumbUp as ThumbUpIcon,
  ThumbDown as ThumbDownIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { getAIRecommendations, AIRecommendation } from '../api/api';
import { useAuth } from '../contexts/AuthContext';

const RecommendationPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<{
    movies: AIRecommendation[];
    tvShows: AIRecommendation[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Bitte gib eine Anfrage ein');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAIRecommendations(query);
      setRecommendations({
        movies: response.movies,
        tvShows: response.tvShows
      });
    } catch (err) {
      console.error('Fehler beim Abrufen von Empfehlungen:', err);
      setError('Fehler beim Abrufen von Empfehlungen. Bitte versuche es später erneut.');
    } finally {
      setLoading(false);
    }
  };

  const handleRating = (type: 'good' | 'ok' | 'bad' | 'irrelevant', item: AIRecommendation) => {
    // Hier würde die Logik für die Bewertung implementiert werden
    // In einer vollständigen Implementierung würde dies an das Backend gesendet
    
    let message = '';
    let severity: 'success' | 'info' | 'warning' | 'error' = 'success';
    
    switch (type) {
      case 'good':
        message = `"${item.title}" als Super markiert!`;
        severity = 'success';
        break;
      case 'ok':
        message = `"${item.title}" als OK markiert.`;
        severity = 'info';
        break;
      case 'bad':
        message = `"${item.title}" als Schlecht markiert.`;
        severity = 'warning';
        break;
      case 'irrelevant':
        message = `"${item.title}" als Irrelevant markiert.`;
        severity = 'error';
        break;
    }
    
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleAddToWatchlist = (item: AIRecommendation) => {
    // Hier würde die Logik für das Hinzufügen zur Watchlist implementiert werden
    setSnackbar({
      open: true,
      message: `"${item.title}" zur Watchlist hinzugefügt!`,
      severity: 'success'
    });
  };

  const handleShare = (item: AIRecommendation) => {
    // Hier würde die Logik für das Teilen implementiert werden
    setSnackbar({
      open: true,
      message: `Empfehlung für "${item.title}" geteilt!`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Film- und Serienempfehlungen
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          Beschreibe, worauf du Lust hast, und erhalte personalisierte Empfehlungen!
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <TextField
            label="Worauf hättest du Lust?"
            placeholder="z.B. 'Etwas Spannendes mit überraschendem Ende' oder 'Eine leichte Komödie für einen regnerischen Tag'"
            variant="outlined"
            fullWidth
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2 }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              size="large"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Empfehlungen erhalten'}
            </Button>
          </Box>
        </form>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>
      
      {recommendations && (
        <>
          {/* Filmempfehlungen */}
          <Typography variant="h5" component="h2" gutterBottom>
            Filmempfehlungen
          </Typography>
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {recommendations.movies.map((movie, index) => (
              <Grid item xs={12} sm={6} md={4} key={`movie-${index}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={movie.posterPath || 'https://via.placeholder.com/300x450?text=Kein+Bild'}
                    alt={movie.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {movie.title} {movie.year && `(${movie.year})`}
                    </Typography>
                    
                    {movie.voteAverage && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating 
                          value={movie.voteAverage / 2} 
                          precision={0.5} 
                          readOnly 
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {movie.voteAverage}/10
                        </Typography>
                      </Box>
                    )}
                    
                    <Chip 
                      label="Film" 
                      size="small" 
                      color="primary" 
                      sx={{ mb: 1 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary">
                      {movie.reason}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <IconButton 
                      aria-label="Super"
                      onClick={() => handleRating('good', movie)}
                      color="success"
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="OK"
                      onClick={() => handleRating('ok', movie)}
                      color="primary"
                    >
                      <FavoriteIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="Schlecht"
                      onClick={() => handleRating('bad', movie)}
                      color="warning"
                    >
                      <ThumbDownIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="Irrelevant"
                      onClick={() => handleRating('irrelevant', movie)}
                      color="error"
                    >
                      <CancelIcon />
                    </IconButton>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    <IconButton 
                      aria-label="Zur Watchlist hinzufügen"
                      onClick={() => handleAddToWatchlist(movie)}
                      disabled={!currentUser}
                    >
                      <BookmarkAddIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="Teilen"
                      onClick={() => handleShare(movie)}
                      disabled={!currentUser}
                    >
                      <ShareIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
          
          {/* Serienempfehlungen */}
          <Typography variant="h5" component="h2" gutterBottom>
            Serienempfehlungen
          </Typography>
          
          <Grid container spacing={3}>
            {recommendations.tvShows.map((show, index) => (
              <Grid item xs={12} sm={6} md={4} key={`tv-${index}`}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={show.posterPath || 'https://via.placeholder.com/300x450?text=Kein+Bild'}
                    alt={show.title}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" component="div" gutterBottom>
                      {show.title} {show.year && `(${show.year})`}
                    </Typography>
                    
                    {show.voteAverage && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating 
                          value={show.voteAverage / 2} 
                          precision={0.5} 
                          readOnly 
                        />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          {show.voteAverage}/10
                        </Typography>
                      </Box>
                    )}
                    
                    <Chip 
                      label="Serie" 
                      size="small" 
                      color="secondary" 
                      sx={{ mb: 1 }} 
                    />
                    
                    <Typography variant="body2" color="text.secondary">
                      {show.reason}
                    </Typography>
                  </CardContent>
                  
                  <CardActions>
                    <IconButton 
                      aria-label="Super"
                      onClick={() => handleRating('good', show)}
                      color="success"
                    >
                      <ThumbUpIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="OK"
                      onClick={() => handleRating('ok', show)}
                      color="primary"
                    >
                      <FavoriteIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="Schlecht"
                      onClick={() => handleRating('bad', show)}
                      color="warning"
                    >
                      <ThumbDownIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="Irrelevant"
                      onClick={() => handleRating('irrelevant', show)}
                      color="error"
                    >
                      <CancelIcon />
                    </IconButton>
                    
                    <Box sx={{ flexGrow: 1 }} />
                    
                    <IconButton 
                      aria-label="Zur Watchlist hinzufügen"
                      onClick={() => handleAddToWatchlist(show)}
                      disabled={!currentUser}
                    >
                      <BookmarkAddIcon />
                    </IconButton>
                    
                    <IconButton 
                      aria-label="Teilen"
                      onClick={() => handleShare(show)}
                      disabled={!currentUser}
                    >
                      <ShareIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecommendationPage;
