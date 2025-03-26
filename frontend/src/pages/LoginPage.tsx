import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Bitte fülle alle Felder aus.');
      return;
    }
    
    try {
      setError(null);
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Fehler beim Anmelden. Bitte überprüfe deine Eingaben.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Anmelden
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" paragraph>
          Melde dich an, um personalisierte Empfehlungen zu erhalten und deine Watchlist zu verwalten.
        </Typography>
        
        <Paper elevation={3} sx={{ p: 4, mt: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            {error && (
              <Typography color="error" align="center" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}
            
            <TextField
              label="E-Mail"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <TextField
              label="Passwort"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? 'Wird angemeldet...' : 'Anmelden'}
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Noch kein Konto? <Link onClick={() => navigate('/register')} sx={{ cursor: 'pointer' }}>Registrieren</Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
