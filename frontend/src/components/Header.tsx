import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem, 
  TextField, 
  InputAdornment,
  Avatar,
  Badge,
  Box
} from '@mui/material';
import { 
  Search as SearchIcon, 
  AccountCircle, 
  Notifications as NotificationsIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState<null | HTMLElement>(null);

  // Dummy-Benachrichtigungen für die Demo
  const notifications = [
    { id: 1, message: 'Max hat dir eine neue Empfehlung geschickt', read: false },
    { id: 2, message: 'Neue Filme in deiner Watchlist verfügbar', read: false },
    { id: 3, message: 'Deine Bewertung wurde von 5 Personen als hilfreich markiert', read: true }
  ];

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setNotificationAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Fehler beim Abmelden:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2, display: { sm: 'none' } }}
          onClick={handleMobileMenuOpen}
        >
          <MenuIcon />
        </IconButton>
        
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          FilmFinder
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          <form onSubmit={handleSearch} style={{ width: '100%', maxWidth: '500px' }}>
            <TextField
              placeholder="Filme, Serien oder 'Worauf hättest du Lust?'"
              variant="outlined"
              size="small"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { 
                  bgcolor: 'background.paper',
                  borderRadius: 1
                }
              }}
            />
          </form>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button color="inherit" onClick={() => navigate('/movies')}>Filme</Button>
          <Button color="inherit" onClick={() => navigate('/tv')}>Serien</Button>
          <Button color="inherit" onClick={() => navigate('/documentaries')}>Dokus</Button>
          
          {currentUser ? (
            <>
              <Button color="inherit" onClick={() => navigate('/watchlist')}>Watchlist</Button>
              
              <IconButton color="inherit" onClick={handleNotificationMenuOpen}>
                <Badge badgeContent={unreadNotifications} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {currentUser.photoURL ? (
                  <Avatar src={currentUser.photoURL} alt={currentUser.displayName || ''} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>Anmelden</Button>
              <Button color="inherit" onClick={() => navigate('/register')}>Registrieren</Button>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Profil-Menü */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profil</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/settings'); }}>Einstellungen</MenuItem>
        <MenuItem onClick={handleSignOut}>Abmelden</MenuItem>
      </Menu>

      {/* Benachrichtigungsmenü */}
      <Menu
        anchorEl={notificationAnchorEl}
        open={Boolean(notificationAnchorEl)}
        onClose={handleMenuClose}
      >
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <MenuItem 
              key={notification.id} 
              onClick={handleMenuClose}
              sx={{ 
                fontWeight: notification.read ? 'normal' : 'bold',
                maxWidth: 300
              }}
            >
              {notification.message}
            </MenuItem>
          ))
        ) : (
          <MenuItem onClick={handleMenuClose}>Keine neuen Benachrichtigungen</MenuItem>
        )}
      </Menu>

      {/* Mobiles Menü */}
      <Menu
        anchorEl={mobileMenuAnchorEl}
        open={Boolean(mobileMenuAnchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate('/movies'); }}>Filme</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/tv'); }}>Serien</MenuItem>
        <MenuItem onClick={() => { handleMenuClose(); navigate('/documentaries'); }}>Dokus</MenuItem>
        
        {currentUser ? (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/watchlist'); }}>Watchlist</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>Profil</MenuItem>
            <MenuItem onClick={handleSignOut}>Abmelden</MenuItem>
          </>
        ) : (
          <>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/login'); }}>Anmelden</MenuItem>
            <MenuItem onClick={() => { handleMenuClose(); navigate('/register'); }}>Registrieren</MenuItem>
          </>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;
