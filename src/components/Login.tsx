import { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  Fade,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { Visibility, VisibilityOff, Login as LoginIcon, PersonAdd } from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isSignUp) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#000000',
        background: 'none',
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                color: 'primary.main',
                mb: 1
              }}
            >
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {isSignUp ? 'Join us today!' : 'Sign in to continue'}
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 1,
                '& .MuiAlert-icon': {
                  alignItems: 'center'
                }
              }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 2 }}
              InputProps={{
                sx: { borderRadius: 1 }
              }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: 1 },
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              color="success"
              size="large"
              startIcon={isSignUp ? <PersonAdd /> : <LoginIcon />}
              sx={{
                py: 1.5,
                mb: 2,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1.1rem',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(46, 125, 50, 0.4)',
                }
              }}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
            <Button
              fullWidth
              onClick={() => setIsSignUp(!isSignUp)}
              variant="text"
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': {
                  bgcolor: 'transparent',
                  color: 'success.main',
                }
              }}
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Sign Up"}
            </Button>
          </form>
        </Paper>
      </Fade>
    </Box>
  );
} 