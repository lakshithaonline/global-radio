import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import { PlayArrow, Pause, Favorite, FavoriteBorder } from '@mui/icons-material';
import type { RadioStation } from '../types/radio';
import useRadioStore from '../store/radioStore';
import { useState } from 'react';

interface StationCardProps {
  station: RadioStation;
}

const StationCard = ({ station }: StationCardProps) => {
  const {
    currentStation,
    isPlaying,
    favoriteStations,
    setCurrentStation,
    setIsPlaying,
    addToFavorites,
    removeFromFavorites,
  } = useRadioStore();

  const [faviconLoadError, setFaviconLoadError] = useState(false);

  const isCurrentStation = currentStation?.stationuuid === station.stationuuid;
  const isFavorite = favoriteStations.some((s) => s.stationuuid === station.stationuuid);

  // Helper function to generate initials
  const generateInitials = (name: string): string => {
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length === 0) return '';
    if (words.length === 1) return words[0].substring(0, 3).toUpperCase(); // Take first 3 letters if only one word
    // Take the first letter of the first two words
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const handlePlay = () => {
    if (isCurrentStation) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentStation(station);
      setIsPlaying(true);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeFromFavorites(station.stationuuid);
    } else {
      addToFavorites(station);
    }
  };

  const initials = generateInitials(station.name);

  return (
    <Card
      sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': {
          bgcolor: 'rgba(255, 255, 255, 0.08)',
        },
      }}
      onClick={handlePlay}
    >
      {station.favicon && !faviconLoadError ? (
        <CardMedia
          component="img"
          height="140"
          image={station.favicon}
          alt={station.name}
          onError={() => setFaviconLoadError(true)}
          sx={{
            objectFit: 'contain',
            bgcolor: 'background.paper',
            p: 2,
            aspectRatio: '1',
            width: '100%',
            height: 'auto',
            minHeight: '140px',
            maxHeight: '140px',
          }}
        />
      ) : (
        <Box
          sx={{
            height: '140px',
            width: '100%',
            minHeight: '140px',
            maxHeight: '140px',
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem', // Adjust font size as needed
            fontWeight: 'bold',
            color: 'background.paper',
            aspectRatio: '1',
            p: 2,
            boxSizing: 'border-box',
          }}
        >
          {initials}
        </Box>
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {station.name}
        </Typography>
        <Typography variant="body2" color="text.secondary" noWrap>
          {station.country}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <IconButton
            size="small"
            color={isCurrentStation ? "success" : "primary"}
            onClick={handlePlay}
            sx={{ mr: 1 }}
          >
            {isCurrentStation && isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            size="small"
            color="primary"
            onClick={handleFavorite}
          >
            {isFavorite ? <Favorite /> : <FavoriteBorder />}
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StationCard; 