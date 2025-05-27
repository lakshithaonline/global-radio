import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, CircularProgress } from '@mui/material';
import { radioService } from '../services/radioService';
import type { RadioStation } from '../types/radio';
import StationCard from '../components/StationCard';

const TagView = () => {
  const { tag } = useParams<{ tag: string }>();
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      if (!tag) return;

      setLoading(true);
      try {
        const results = await radioService.searchStations({
          tag,
          limit: 20,
        });
        setStations(results);
      } catch (error) {
        console.error('Error fetching stations:', error);
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [tag]);

  if (!tag) {
    return (
      <Typography variant="body1" color="error">
        Invalid tag parameter
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {tag} Stations
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {stations.map((station) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={station.stationuuid}>
              <StationCard station={station} />
            </Grid>
          ))}
          {stations.length === 0 && !loading && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" align="center">
                No stations found for this tag.
              </Typography>
            </Grid>
          )}
        </Grid>
      )}
    </Box>
  );
};

export default TagView; 