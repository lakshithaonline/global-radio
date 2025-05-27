import { Box, Typography, Grid } from '@mui/material';
import useRadioStore from '../store/radioStore';
import StationCard from '../components/StationCard';

const Favorites = () => {
  const { favoriteStations } = useRadioStore();

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Your Favorites
      </Typography>

      {favoriteStations.length > 0 ? (
        <Grid container spacing={3} sx={{ width: '100%' }} justifyContent="flex-start" flexWrap="wrap">
          {favoriteStations.map((station) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={station.stationuuid} sx={{ flexGrow: 1 }}>
              <StationCard station={station} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary" align="center">
          You haven't added any stations to your favorites yet.
        </Typography>
      )}
    </Box>
  );
};

export default Favorites; 