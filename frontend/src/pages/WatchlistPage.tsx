import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Tabs, Tab, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface WatchlistItem {
  id: number;
  title: string;
  type: 'movie' | 'tv' | 'documentary';
  posterPath: string | null;
  addedAt: string;
}

const WatchlistPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = useState<number>(0);
  
  // Simulierte Watchlist-Daten
  const mockWatchlist: WatchlistItem[] = [
    {
      id: 1,
      title: 'Inception',
      type: 'movie',
      posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      addedAt: '2025-03-20'
    },
    {
      id: 2,
      title: 'Breaking Bad',
      type: 'tv',
      posterPath: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      addedAt: '2025-03-18'
    },
    {
      id: 3,
      title: 'The Social Dilemma',
      type: 'documentary',
      posterPath: '/7Wi7rpl9Qo2kDCaIjJvF4Azr1Gk.jpg',
      addedAt: '2025-03-15'
    },
    {
      id: 4,
      title: 'Stranger Things',
      type: 'tv',
      posterPath: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
      addedAt: '2025-03-10'
    }
  ];

  useEffect(() => {
    // Simuliere API-Anfrage
    const fetchWatchlist = async () => {
      setLoading(true);
      try {
        // In einer echten App würde hier eine API-Anfrage gesendet werden
        setTimeout(() => {
          setWatchlist(mockWatchlist);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchWatchlist();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleRemoveFromWatchlist = (id: number) => {
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    setWatchlist(watchlist.filter(item => item.id !== id));
    console.log(`Removed item ${id} from watchlist`);
  };

  const filteredWatchlist = watchlist.filter(item => {
    if (tabValue === 0) return true; // Alle
    if (tabValue === 1) return item.type === 'movie'; // Filme
    if (tabValue === 2) return item.type === 'tv'; // Serien
    if (tabValue === 3) return item.type === 'documentary'; // Dokumentationen
    return true;
  });

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Bitte melde dich an, um deine Watchlist zu sehen.
        </Typography>
        <Button variant="contained" color="primary" href="/login" sx={{ mt: 2 }}>
          Zur Anmeldung
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Meine Watchlist
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="watchlist tabs">
          <Tab label="Alle" />
          <Tab label="Filme" />
          <Tab label="Serien" />
          <Tab label="Dokumentationen" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredWatchlist.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
          Keine Einträge in dieser Kategorie gefunden.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredWatchlist.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={item.posterPath ? `https://image.tmdb.org/t/p/w500${item.posterPath}` : 'https://via.placeholder.com/500x750?text=No+Image'}
                  alt={item.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="div">
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.type === 'movie' ? 'Film' : item.type === 'tv' ? 'Serie' : 'Dokumentation'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Hinzugefügt am: {new Date(item.addedAt).toLocaleDateString('de-DE')}
                  </Typography>
                  <Button 
                    size="small" 
                    color="error" 
                    sx={{ mt: 2 }}
                    onClick={() => handleRemoveFromWatchlist(item.id)}
                  >
                    Entfernen
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default WatchlistPage;
