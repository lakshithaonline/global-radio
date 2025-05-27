import { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { radioService } from '../services/radioService';
import type { RadioStation } from '../types/radio';
import useRadioStore from '../store/radioStore';
import StationCard from '../components/StationCard';

const Home = () => {
  const [featuredStations, setFeaturedStations] = useState<RadioStation[]>([]);
  const { recentStations } = useRadioStore();

  useEffect(() => {
    const fetchFeaturedStations = async () => {
      const stations = await radioService.searchStations({
        limit: 12,
        order: 'votes',
        reverse: true,
      });
      // Filter out stations that are in recentStations
      const recentStationIds = new Set(recentStations.map(station => station.stationuuid));
      const filteredStations = stations.filter(station => !recentStationIds.has(station.stationuuid));
      setFeaturedStations(filteredStations);
    };

    fetchFeaturedStations();
  }, [recentStations]); // Add recentStations as a dependency

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Welcome to Radio App
      </Typography>

      {/* Recently Played section */}
      {recentStations.length > 0 && (
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Recently Played
          </Typography>
          <Grid container spacing={3}>
            {recentStations.map((station) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={station.stationuuid}>
                <StationCard station={station} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Featured Stations section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Featured Stations
        </Typography>
        <Grid container spacing={3}>
          {featuredStations.map((station) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={station.stationuuid}>
              <StationCard station={station} />
            </Grid>
          ))}
        </Grid>
      </Box>

    </Box>
  );
};

export default Home; 