import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton, 
  Typography, 
  Box,
  List,
  ListItem,
  ListItemText,
  Switch,
  Divider,
  useTheme as useMuiTheme,
  useMediaQuery,
  Snackbar,
  Alert
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { preferencesService } from '../services/preferencesService';

interface SettingsProps {
  open: boolean;
  onClose: () => void;
}

const Settings = ({ open, onClose }: SettingsProps) => {
  const muiTheme = useMuiTheme();
  const { isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('sm'));
  const [notifications, setNotifications] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        setLoading(true);
        try {
          const preferences = await preferencesService.getUserPreferences(user.id);
          setAutoPlay(preferences.autoplay);
          setNotifications(preferences.notifications ?? true);
        } catch (error) {
          console.error('Error loading preferences:', error);
          setError('Failed to load preferences');
        } finally {
          setLoading(false);
        }
      }
    };

    if (open) {
      loadPreferences();
    }
  }, [user, open]);

  const handleAutoPlayChange = async (checked: boolean) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await preferencesService.updateUserPreferences(user.id, { autoplay: checked });
      setAutoPlay(checked);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
      setAutoPlay(!checked); // Revert the change
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationsChange = async (checked: boolean) => {
    if (!user) return;
    
    setLoading(true);
    try {
      await preferencesService.updateUserPreferences(user.id, { notifications: checked });
      setNotifications(checked);
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
      setNotifications(!checked); // Revert the change
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await preferencesService.updateUserPreferences(user.id, { theme: isDarkMode ? 'light' : 'dark' });
      toggleTheme();
    } catch (error) {
      console.error('Error updating preferences:', error);
      setError('Failed to update preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
          },
        }}
        sx={{
          '& .MuiDialog-container': {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          <Typography variant="h6">Settings</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: isMobile ? 2 : 3 }}>
          <List>
            <ListItem>
              <ListItemText 
                primary="Notifications" 
                secondary="Receive notifications for new features and updates"
              />
              <Switch
                edge="end"
                checked={notifications}
                onChange={(e) => handleNotificationsChange(e.target.checked)}
                disabled={loading}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Dark Mode" 
                secondary="Toggle between light and dark theme"
              />
              <Switch
                edge="end"
                checked={isDarkMode}
                onChange={handleThemeChange}
                disabled={loading}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemText 
                primary="Auto-play" 
                secondary="Automatically play the last station on startup"
              />
              <Switch
                edge="end"
                checked={autoPlay}
                onChange={(e) => handleAutoPlayChange(e.target.checked)}
                disabled={loading}
              />
            </ListItem>
          </List>
        </DialogContent>
      </Dialog>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError(null)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Settings; 