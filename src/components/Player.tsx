import { 
  Box, 
  IconButton, 
  Slider, 
  Typography, 
  Snackbar, 
  Alert, 
  Menu, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  VolumeUp, 
  Favorite, 
  FavoriteBorder,
  Settings as SettingsIcon,
  MoreVert
} from '@mui/icons-material';
import { useRef, useEffect, useState } from 'react';
import useRadioStore from '../store/radioStore';
import { useAuth } from '../contexts/AuthContext';
import { preferencesService } from '../services/preferencesService';

const Player = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [faviconLoadError, setFaviconLoadError] = useState(false);
  const [quality, setQuality] = useState('high');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUserInteracted, setIsUserInteracted] = useState(false);
  const { user } = useAuth();
  const {
    currentStation,
    isPlaying,
    volume,
    favoriteStations,
    setCurrentStation,
    setIsPlaying,
    setVolume,
    addToFavorites,
    removeFromFavorites,
    recentStations,
  } = useRadioStore();

  // Load user preferences and handle autoplay
  useEffect(() => {
    const loadPreferences = async () => {
      if (user) {
        try {
          const preferences = await preferencesService.getUserPreferences(user.id);
          setVolume(preferences.volume);
          
          // Handle autoplay
          if (preferences.autoplay && preferences.last_station_id) {
            const lastStation = recentStations.find(
              station => station.stationuuid === preferences.last_station_id
            );
            if (lastStation) {
              setCurrentStation(lastStation);
              setIsPlaying(true);
            }
          }
        } catch (error) {
          console.error('Error loading preferences:', error);
        }
      }
    };

    loadPreferences();
  }, [user, recentStations]);

  // Save current station and volume to preferences
  useEffect(() => {
    const savePreferences = async () => {
      if (user && currentStation) {
        try {
          await preferencesService.updateUserPreferences(user.id, {
            last_station_id: currentStation.stationuuid,
            volume
          });
        } catch (error) {
          console.error('Error saving preferences:', error);
        }
      }
    };

    savePreferences();
  }, [user, currentStation, volume]);

  // Helper function to generate initials
  const generateInitials = (name: string): string => {
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].substring(0, 3).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  // Handle audio playback
  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;

    // Only attempt playback if user has interacted
    if (isPlaying && currentStation && isUserInteracted) {
      // Set the new source
      audio.src = currentStation.url;
      
      // Start playback
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.error('Playback error:', err);
          setIsPlaying(false);
          if (err.name === 'NotAllowedError') {
            setError('Please interact with the page first to play audio');
          } else {
            setError('Failed to play station. Please try another one.');
          }
        });
      }
    } else if (!isPlaying) {
      audio.pause();
    }

    // Cleanup function
    return () => {
      if (audio) {
        audio.pause();
        audio.src = '';
      }
    };
  }, [isPlaying, currentStation, isUserInteracted]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  if (!currentStation) return null;

  const isFavorite = favoriteStations.some(
    (station) => station.stationuuid === currentStation.stationuuid
  );

  const handleFavoriteClick = async () => {
    if (!user) {
      setError('Please sign in to add favorites');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites(currentStation.stationuuid);
      } else {
        await addToFavorites(currentStation);
      }
    } catch (err) {
      setError('Failed to update favorites. Please try again.');
      console.error('Favorite error:', err);
    }
  };

  const handlePlayPause = () => {
    // Mark that user has interacted
    setIsUserInteracted(true);
    
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      const playPromise = audioRef.current?.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
          })
          .catch((err) => {
            console.error('Playback error:', err);
            setIsPlaying(false);
            if (err.name === 'NotAllowedError') {
              setError('Please interact with the page first to play audio');
            } else {
              setError('Failed to play station. Please try another one.');
            }
          });
      }
    }
  };

  // Add click handler to mark user interaction
  const handlePlayerClick = () => {
    setIsUserInteracted(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleQualityChange = (event: any) => {
    setQuality(event.target.value);
    handleMenuClose();
  };

  const initials = generateInitials(currentStation.name);

  return (
    <>
      <Box
        sx={{
          height: 90,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          px: 2,
        }}
        onClick={handlePlayerClick}
      >
        <audio
          ref={audioRef}
          onError={() => {
            setIsPlaying(false);
            setCurrentStation(null);
            setError('Failed to load station. Please try another one.');
          }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {currentStation.favicon && !faviconLoadError ? (
            <img
              src={currentStation.favicon}
              alt={currentStation.name}
              style={{ width: 56, height: 56, marginRight: 16, borderRadius: 4 }}
              onError={() => setFaviconLoadError(true)}
            />
          ) : (
            <Box
              sx={{
                width: 56,
                height: 56,
                marginRight: 16,
                borderRadius: 4,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: 'background.paper',
              }}
            >
              {initials}
            </Box>
          )}
          <Box>
            <Typography variant="subtitle1">{currentStation.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {currentStation.country}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handlePlayPause} color="primary">
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton onClick={handleFavoriteClick} color="primary">
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
            <VolumeUp sx={{ mr: 1 }} />
            <Slider
              value={volume}
              onChange={(_, value) => setVolume(value as number)}
              min={0}
              max={1}
              step={0.01}
              sx={{ width: 200 }}
            />
          </Box>
          <IconButton onClick={handleMenuOpen} color="primary">
            <MoreVert />
          </IconButton>
        </Box>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 180,
          }
        }}
      >
        <MenuItem>
          <FormControl fullWidth size="small">
            <InputLabel>Quality</InputLabel>
            <Select
              value={quality}
              label="Quality"
              onChange={handleQualityChange}
              size="small"
            >
              <MenuItem value="low">Low (32kbps)</MenuItem>
              <MenuItem value="medium">Medium (64kbps)</MenuItem>
              <MenuItem value="high">High (128kbps)</MenuItem>
            </Select>
          </FormControl>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <SettingsIcon sx={{ mr: 1 }} /> Settings
        </MenuItem>
      </Menu>

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

export default Player; 