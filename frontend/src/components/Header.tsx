import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Menu, MenuItem } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleClose();
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#111' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 0, display: { xs: 'none', sm: 'block' }, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Life is a Binge
        </Typography>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={() => navigate('/')}>Empfehlungen</Button>
            <Button color="inherit" onClick={() => navigate('/watchlist')}>Watchlist</Button>
            <Button color="inherit" onClick={() => navigate('/social')}>Social</Button>
            
            <IconButton
              size="large"
              color="inherit"
              onClick={handleNotificationMenu}
            >
              <NotificationsIcon />
            </IconButton>
            <Menu
              id="notification-menu"
              anchorEl={notificationAnchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(notificationAnchorEl)}
              onClose={handleNotificationClose}
            >
              <MenuItem onClick={handleNotificationClose}>Neue Empfehlung: "The Matrix"</MenuItem>
              <MenuItem onClick={handleNotificationClose}>Max hat "Inception" geteilt</MenuItem>
              <MenuItem onClick={handleNotificationClose}>Lisa folgt dir jetzt</MenuItem>
            </Menu>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem disabled>{currentUser?.name}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/')}>Empfehlungen</Button>
            <Button color="inherit" onClick={() => navigate('/login')}>Login</Button>
            <Button color="inherit" onClick={() => navigate('/register')}>Registrieren</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
