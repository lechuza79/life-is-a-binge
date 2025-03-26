import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  IconButton,
  Box,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  Tabs,
  Tab
} from '@mui/material';
import { 
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// In einer vollständigen Implementierung würden diese Daten aus einer Datenbank kommen
const MOCK_WATCHLIST = {
  movies: [
    {
      id: 550,
      title: 'Fight Club',
      type: 'movie',
      releaseDate: '1999-10-15',
      posterPath: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
      voteAverage: 8.4,
      addedAt: new Date().toISOString()
    },
    {
      id: 278,
      title: 'Die Verurteilten',
      type: 'movie',
      releaseDate: '1994-09-23',
      posterPath: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      voteAverage: 8.7,
      addedAt: new Date(Date.now() - 86400000).toISOString() // Gestern
    }
  ],
  tvShows: [
    {
      id: 1396,
      title: 'Breaking Bad',
      type: 'tv',
      releaseDate: '2008-01-20',
      posterPath: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      voteAverage: 8.8,
      addedAt: new Date(Date.now() - 172800000).toISOString() // Vorgestern
    },
    {
      id: 66732,
      title: 'Stranger Things',
      type: 'tv',
      releaseDate: '2016-07-15',
      posterPath: 'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      voteAverage: 8.6,
      addedAt: new Date(Date.now() - 259200000).toISOString() // Vor 3 Tagen
    }
  ],
  documentaries: [
    {
      id: 87739,
      title: 'Planet Erde II',
      type: 'tv',
      category: 'documentary',
      releaseDate: '2016-11-06',
      posterPath: 'https://image.tmdb.org/t/p/w500/dNsGXQrQeRJLdWxLdQCXpBQhcuQ.jpg',
      voteAverage: 8.8,
      addedAt: new Date(Date.now() - 345600000).toISOString() // Vor 4 Tagen
    }
  ]
};

interface WatchlistItem {
  id: number;
  title: string;
  type: 'movie' | 'tv';
  category?: string;
  releaseDate?: string;
  posterPath?: string | null;
  voteAverage?: number;
  addedAt: string;
}

const WatchlistPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [watchlist, setWatchlist] = useState<{
    movies: WatchlistItem[];
    tvShows: WatchlistItem[];
    documentaries: WatchlistItem[];
  }>(MOCK_WATCHLIST);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  
  const { currentUser } = useAuth();

  // In einer vollständigen Implementierung würde hier die Watchlist aus der Datenbank geladen werden
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      // Simuliere API-Aufruf
      setTimeout(() => {
        setWatchlist(MOCK_WATCHLIST);
        setLoading(false);
      }, 1000);
    }
  }, [currentUser]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRemoveFromWatchlist = (item: WatchlistItem) => {
    // In einer vollständigen Implementierung würde hier ein API-Aufruf erfolgen
    
    // Lokales Update der Watchlist
    if (item.category === 'documentary') {
      setWatchlist({
        ...watchlist,
        documentaries: watchlist.documentaries.filter(doc => doc.id !== item.id)
      });
    } else if (item.type === 'movie') {
      setWatchlist({
        ...watchlist,
        movies: watchlist.movies.filter(movie => movie.id !== item.id)
      });
    } else {
      setWatchlist({
        ...watchlist,
        tvShows: watchlist.tvShows.filter(show => show.id !== item.id)
      });
    }
    
    setSnackbar({
      open: true,
      message: `"${item.title}" von der Watchlist entfernt`,
      severity: 'success'
    });
  };

  const handleViewDetails = (item: WatchlistItem) => {
    // In einer vollständigen Implementierung würde hier zur Detailseite navigiert werden
    setSnackbar({
      open: true,
      message: `Details für "${item.title}" anzeigen`,
      severity: 'info'
    });
  };

  const handleShare = (item: WatchlistItem) => {
    // In einer vollständigen Implementierung würde hier die Teilen-Funktionalität implementiert werden
    setSnackbar({
      open: true,
      message: `"${item.title}" mit Freunden geteilt`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Formatiere das Datum
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  // Rendere die Watchlist-Items basierend auf dem ausgewählten Tab
  const renderWatchlistItems = () => {
    let items: WatchlistItem[] = [];
    
    switch (tabValue) {
      case 0: // Alle
        items = [
          ...watchlist.movies,
          ...watchlist.tvShows,
          ...watchlist.documentaries
        ].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime());
        break;
      case 1: // Filme
        items = watchlist.movies;
        break;
      case 2: // Serien
        items = watchlist.tvShows;
        break;
      case 3: // Dokumentationen
        items = watchlist.documentaries;
        break;
    }
    
    if (items.length === 0) {
      return (
        <Alert severity="info" sx={{ mt: 2 }}>
          Keine Einträge in dieser Kategorie
        </Alert>
      );
    }
    
    return (
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={`${item.type}-${item.id}`}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={item.posterPath || 'https://via.placeholder.com/300x450?text=Kein+Bild'}
                alt={item.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" component="div" gutterBottom>
                  {item.title}
                </Typography>
                
                {item.voteAverage && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating 
                      value={item.voteAverage / 2} 
                      precision={0.5} 
                      readOnly 
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {item.voteAverage}/10
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mb: 1 }}>
                  {item.category === 'documentary' ? (
                    <Chip 
                      label="Dokumentation" 
                      size="small" 
                      color="info" 
                    />
                  ) : item.type === 'movie' ? (
                    <Chip 
                      label="Film" 
                      size="small" 
                      color="primary" 
                    />
                  ) : (
                    <Chip 
                      label="Serie" 
                      size="small" 
                      color="secondary" 
                    />
                  )}
                </Box>
                
                {item.releaseDate && (
                  <Typography variant="body2" color="text.secondary">
                    Erschienen: {item.releaseDate.substring(0, 4)}
                  </Typography>
                )}
                
                <Typography variant="body2" color="text.secondary">
                  Hinzugefügt am: {formatDate(item.addedAt)}
                </Typography>
              </CardContent>
              
              <CardActions>
                <IconButton 
                  aria-label="Details anzeigen"
                  onClick={() => handleViewDetails(item)}
                >
                  <VisibilityIcon />
                </IconButton>
                
                <IconButton 
                  aria-label="Teilen"
                  onClick={() => handleShare(item)}
                >
                  <ShareIcon />
                </IconButton>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <IconButton 
                  aria-label="Von der Watchlist entfernen"
                  onClick={() => handleRemoveFromWatchlist(item)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Du musst angemeldet sein, um deine Watchlist zu sehen.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meine Watchlist
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Alle" />
        <Tab label={`Filme (${watchlist.movies.length})`} />
        <Tab label={`Serien (${watchlist.tvShows.length})`} />
        <Tab label={`Dokumentationen (${watchlist.documentaries.length})`} />
      </Tabs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        renderWatchlistItems()
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

export default WatchlistPage;
