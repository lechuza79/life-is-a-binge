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
  Avatar,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  PersonAdd as PersonAddIcon,
  Check as CheckIcon,
  Share as ShareIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

// In einer vollständigen Implementierung würden diese Daten aus einer Datenbank kommen
const MOCK_USERS = [
  {
    id: '1',
    displayName: 'Anna Schmidt',
    photoURL: 'https://randomuser.me/api/portraits/women/12.jpg',
    isFollowing: true
  },
  {
    id: '2',
    displayName: 'Max Mustermann',
    photoURL: 'https://randomuser.me/api/portraits/men/32.jpg',
    isFollowing: true
  },
  {
    id: '3',
    displayName: 'Laura Meyer',
    photoURL: 'https://randomuser.me/api/portraits/women/44.jpg',
    isFollowing: false
  },
  {
    id: '4',
    displayName: 'Thomas Wagner',
    photoURL: 'https://randomuser.me/api/portraits/men/67.jpg',
    isFollowing: false
  }
];

const MOCK_SHARED_RECOMMENDATIONS = [
  {
    id: 1,
    userId: '1',
    userName: 'Anna Schmidt',
    userPhoto: 'https://randomuser.me/api/portraits/women/12.jpg',
    mediaId: 550,
    mediaTitle: 'Fight Club',
    mediaType: 'movie',
    mediaPoster: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    comment: 'Einer meiner absoluten Lieblingsfilme! Unbedingt ansehen!',
    timestamp: new Date(Date.now() - 86400000).toISOString() // Gestern
  },
  {
    id: 2,
    userId: '2',
    userName: 'Max Mustermann',
    userPhoto: 'https://randomuser.me/api/portraits/men/32.jpg',
    mediaId: 1396,
    mediaTitle: 'Breaking Bad',
    mediaType: 'tv',
    mediaPoster: 'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    comment: 'Die beste Serie aller Zeiten. Wer sie noch nicht gesehen hat, verpasst was!',
    timestamp: new Date(Date.now() - 172800000).toISOString() // Vorgestern
  }
];

interface User {
  id: string;
  displayName: string;
  photoURL: string;
  isFollowing: boolean;
}

interface SharedRecommendation {
  id: number;
  userId: string;
  userName: string;
  userPhoto: string;
  mediaId: number;
  mediaTitle: string;
  mediaType: 'movie' | 'tv';
  mediaPoster: string;
  comment: string;
  timestamp: string;
}

const SocialPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [sharedRecommendations, setSharedRecommendations] = useState<SharedRecommendation[]>(MOCK_SHARED_RECOMMENDATIONS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });
  
  const { currentUser } = useAuth();

  // In einer vollständigen Implementierung würden hier die Daten aus der Datenbank geladen werden
  useEffect(() => {
    if (currentUser) {
      setLoading(true);
      // Simuliere API-Aufruf
      setTimeout(() => {
        setUsers(MOCK_USERS);
        setSharedRecommendations(MOCK_SHARED_RECOMMENDATIONS);
        setLoading(false);
      }, 1000);
    }
  }, [currentUser]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleFollowUser = (userId: string) => {
    // In einer vollständigen Implementierung würde hier ein API-Aufruf erfolgen
    
    // Lokales Update der Benutzerliste
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: !user.isFollowing } 
        : user
    ));
    
    const user = users.find(u => u.id === userId);
    if (user) {
      setSnackbar({
        open: true,
        message: user.isFollowing 
          ? `Du folgst ${user.displayName} nicht mehr` 
          : `Du folgst jetzt ${user.displayName}`,
        severity: 'success'
      });
    }
  };

  const handleLikeRecommendation = (recommendationId: number) => {
    // In einer vollständigen Implementierung würde hier ein API-Aufruf erfolgen
    setSnackbar({
      open: true,
      message: 'Empfehlung gefällt dir',
      severity: 'success'
    });
  };

  const handleShareRecommendation = (recommendation: SharedRecommendation) => {
    // In einer vollständigen Implementierung würde hier die Teilen-Funktionalität implementiert werden
    setSnackbar({
      open: true,
      message: `Du hast die Empfehlung für "${recommendation.mediaTitle}" geteilt`,
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

  if (!currentUser) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">
          Du musst angemeldet sein, um soziale Funktionen zu nutzen.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Community
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="Empfehlungen" />
        <Tab label="Benutzer" />
      </Tabs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {tabValue === 0 && (
            <>
              <Typography variant="h5" gutterBottom>
                Geteilte Empfehlungen
              </Typography>
              
              {sharedRecommendations.length === 0 ? (
                <Alert severity="info">
                  Noch keine geteilten Empfehlungen vorhanden.
                </Alert>
              ) : (
                <Grid container spacing={3}>
                  {sharedRecommendations.map((recommendation) => (
                    <Grid item xs={12} md={6} key={recommendation.id}>
                      <Card>
                        <Box sx={{ display: 'flex', p: 2 }}>
                          <Avatar 
                            src={recommendation.userPhoto} 
                            alt={recommendation.userName}
                            sx={{ mr: 2 }}
                          />
                          <Box>
                            <Typography variant="subtitle1">
                              {recommendation.userName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(recommendation.timestamp)}
                            </Typography>
                          </Box>
                        </Box>
                        
                        <CardMedia
                          component="img"
                          height="200"
                          image={recommendation.mediaPoster}
                          alt={recommendation.mediaTitle}
                          sx={{ objectFit: 'contain', bgcolor: 'black' }}
                        />
                        
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {recommendation.mediaTitle}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {recommendation.comment}
                          </Typography>
                        </CardContent>
                        
                        <CardActions>
                          <IconButton 
                            aria-label="Gefällt mir"
                            onClick={() => handleLikeRecommendation(recommendation.id)}
                          >
                            <FavoriteIcon />
                          </IconButton>
                          
                          <IconButton 
                            aria-label="Teilen"
                            onClick={() => handleShareRecommendation(recommendation)}
                          >
                            <ShareIcon />
                          </IconButton>
                        </CardActions>
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
                Benutzer
              </Typography>
              
              <List>
                {users.map((user) => (
                  <React.Fragment key={user.id}>
                    <ListItem
                      secondaryAction={
                        <Button
                          variant={user.isFollowing ? "outlined" : "contained"}
                          color={user.isFollowing ? "secondary" : "primary"}
                          startIcon={user.isFollowing ? <CheckIcon /> : <PersonAddIcon />}
                          onClick={() => handleFollowUser(user.id)}
                        >
                          {user.isFollowing ? 'Folgst du' : 'Folgen'}
                        </Button>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar src={user.photoURL} alt={user.displayName} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.displayName}
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
              </List>
            </>
          )}
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

export default SocialPage;
