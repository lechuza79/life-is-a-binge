import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardMedia, Button, Tabs, Tab, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  avatar?: string;
}

interface SharedRecommendation {
  id: number;
  title: string;
  type: 'movie' | 'tv' | 'documentary';
  posterPath: string | null;
  sharedBy: User;
  sharedAt: string;
  comment?: string;
}

const SocialPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [following, setFollowing] = useState<User[]>([]);
  const [followers, setFollowers] = useState<User[]>([]);
  const [sharedRecommendations, setSharedRecommendations] = useState<SharedRecommendation[]>([]);
  
  // Simulierte Daten
  const mockFollowing: User[] = [
    { id: '1', name: 'Max Mustermann', avatar: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', name: 'Lisa Schmidt', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', name: 'Tom Fischer', avatar: 'https://i.pravatar.cc/150?img=3' }
  ];
  
  const mockFollowers: User[] = [
    { id: '2', name: 'Lisa Schmidt', avatar: 'https://i.pravatar.cc/150?img=5' },
    { id: '4', name: 'Anna Müller', avatar: 'https://i.pravatar.cc/150?img=9' },
    { id: '5', name: 'Jan Weber', avatar: 'https://i.pravatar.cc/150?img=12' }
  ];
  
  const mockSharedRecommendations: SharedRecommendation[] = [
    {
      id: 1,
      title: 'Inception',
      type: 'movie',
      posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      sharedBy: mockFollowing[0],
      sharedAt: '2025-03-25',
      comment: 'Einer meiner Lieblingsfilme! Unbedingt anschauen!'
    },
    {
      id: 2,
      title: 'Breaking Bad',
      type: 'tv',
      posterPath: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
      sharedBy: mockFollowing[1],
      sharedAt: '2025-03-24'
    },
    {
      id: 3,
      title: 'The Social Dilemma',
      type: 'documentary',
      posterPath: '/7Wi7rpl9Qo2kDCaIjJvF4Azr1Gk.jpg',
      sharedBy: mockFollowing[2],
      sharedAt: '2025-03-23',
      comment: 'Sehr aufschlussreich über soziale Medien!'
    }
  ];

  useEffect(() => {
    // Simuliere API-Anfrage
    const fetchSocialData = async () => {
      setLoading(true);
      try {
        // In einer echten App würde hier eine API-Anfrage gesendet werden
        setTimeout(() => {
          setFollowing(mockFollowing);
          setFollowers(mockFollowers);
          setSharedRecommendations(mockSharedRecommendations);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching social data:', error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchSocialData();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFollow = (userId: string) => {
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    console.log(`Following user ${userId}`);
    alert(`Du folgst jetzt diesem Benutzer!`);
  };

  const handleUnfollow = (userId: string) => {
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    setFollowing(following.filter(user => user.id !== userId));
    console.log(`Unfollowed user ${userId}`);
  };

  const handleAddToWatchlist = (item: SharedRecommendation) => {
    // In einer echten App würde hier eine API-Anfrage gesendet werden
    console.log(`Added to watchlist:`, item);
    alert(`"${item.title}" wurde zu deiner Watchlist hinzugefügt!`);
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ mt: 8, mb: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Bitte melde dich an, um soziale Funktionen zu nutzen.
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
        Social
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="social tabs">
          <Tab label="Feed" />
          <Tab label="Ich folge" />
          <Tab label="Follower" />
        </Tabs>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <>
              <Typography variant="h5" gutterBottom>
                Empfehlungen von Freunden
              </Typography>
              {sharedRecommendations.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
                  Keine Empfehlungen gefunden.
                </Typography>
              ) : (
                <Grid container spacing={3}>
                  {sharedRecommendations.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
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
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Avatar 
                              src={item.sharedBy.avatar} 
                              alt={item.sharedBy.name}
                              sx={{ width: 24, height: 24, mr: 1 }}
                            />
                            <Typography variant="body2" color="text.secondary">
                              Geteilt von {item.sharedBy.name}
                            </Typography>
                          </Box>
                          {item.comment && (
                            <Typography variant="body2" sx={{ mt: 1, mb: 2, fontStyle: 'italic' }}>
                              "{item.comment}"
                            </Typography>
                          )}
                          <Button 
                            size="small" 
                            color="primary" 
                            sx={{ mt: 2 }}
                            onClick={() => handleAddToWatchlist(item)}
                          >
                            Zur Watchlist
                          </Button>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </>
          )}

          {tabValue === 1 && (
            <>
              <Typography variant="h5" gutterBottom>
                Ich folge
              </Typography>
              {following.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
                  Du folgst noch niemandem.
                </Typography>
              ) : (
                <List>
                  {following.map((user) => (
                    <React.Fragment key={user.id}>
                      <ListItem
                        secondaryAction={
                          <Button 
                            variant="outlined" 
                            size="small"
                            onClick={() => handleUnfollow(user.id)}
                          >
                            Entfolgen
                          </Button>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} alt={user.name} />
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </>
          )}

          {tabValue === 2 && (
            <>
              <Typography variant="h5" gutterBottom>
                Follower
              </Typography>
              {followers.length === 0 ? (
                <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
                  Dir folgt noch niemand.
                </Typography>
              ) : (
                <List>
                  {followers.map((user) => (
                    <React.Fragment key={user.id}>
                      <ListItem
                        secondaryAction={
                          !following.some(f => f.id === user.id) && (
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleFollow(user.id)}
                            >
                              Zurück folgen
                            </Button>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar src={user.avatar} alt={user.name} />
                        </ListItemAvatar>
                        <ListItemText primary={user.name} />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                </List>
              )}
            </>
          )}
        </>
      )}
    </Container>
  );
};

export default SocialPage;
