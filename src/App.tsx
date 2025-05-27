import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Player from './components/Player';
import Login from './components/Login';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import useRadioStore from './store/radioStore';
import AppHeader from './components/AppHeader';

function AppContent() {
  const { user, loading } = useAuth();
  const { loadFavorites, loadRecent } = useRadioStore();

  useEffect(() => {
    if (user) {
      loadFavorites();
      loadRecent();
    }
  }, [user, loadFavorites, loadRecent]);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        bgcolor: 'background.default',
        position: 'relative',
      }}
    >
      <AppHeader />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <MainContent />
      </Box>
      <Player />
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
