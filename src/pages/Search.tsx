import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  InputAdornment,
  IconButton,
  Chip,
  Fade,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search as SearchIcon, Clear, Language, Public } from '@mui/icons-material';
import { radioService } from '../services/radioService';
import type { RadioStation } from '../types/radio';
import StationCard from '../components/StationCard';

const Search = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [countries, setCountries] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [stations, setStations] = useState<RadioStation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFilters = async () => {
      const [fetchedCountries, fetchedLanguages] = await Promise.all([
        radioService.getCountries(),
        radioService.getLanguages(),
      ]);
      setCountries(fetchedCountries);
      setLanguages(fetchedLanguages);
    };
    fetchFilters();
  }, []);

  useEffect(() => {
    const searchStations = async () => {
      if (!searchQuery && !selectedCountry && !selectedLanguage) {
        setStations([]);
        return;
      }

      setLoading(true);
      try {
        const results = await radioService.searchStations({
          name: searchQuery,
          country: selectedCountry,
          language: selectedLanguage,
          limit: 20,
        });
        setStations(results);
      } catch (error) {
        console.error('Error searching stations:', error);
        setStations([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchStations, 500);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, selectedCountry, selectedLanguage]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedLanguage('');
  };

  const hasActiveFilters = searchQuery || selectedCountry || selectedLanguage;

  return (
    <Box sx={{ width: '100%', px: isMobile ? 2 : 3 }}>
      <Typography 
        variant="h4" 
        sx={{ 
          mb: 4,
          fontWeight: 'bold',
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
          backgroundClip: 'text',
          textFillColor: 'transparent',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        Search Stations
      </Typography>

      <Paper 
        elevation={3}
        sx={{ 
          p: 3, 
          mb: 4,
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? 'rgba(255, 255, 255, 0.05)' 
            : 'rgba(0, 0, 0, 0.02)',
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              label="Search stations"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      onClick={() => setSearchQuery('')}
                      edge="end"
                    >
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select
                value={selectedCountry}
                label="Country"
                onChange={(e) => setSelectedCountry(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Public fontSize="small" color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Countries</MenuItem>
                {countries.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={4}>
            <FormControl fullWidth>
              <InputLabel>Language</InputLabel>
              <Select
                value={selectedLanguage}
                label="Language"
                onChange={(e) => setSelectedLanguage(e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    <Language fontSize="small" color="primary" />
                  </InputAdornment>
                }
              >
                <MenuItem value="">All Languages</MenuItem>
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {hasActiveFilters && (
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            <Typography variant="body2" color="text.secondary">
              Active filters:
            </Typography>
            {searchQuery && (
              <Chip
                label={`Search: ${searchQuery}`}
                onDelete={() => setSearchQuery('')}
                size="small"
              />
            )}
            {selectedCountry && (
              <Chip
                label={`Country: ${selectedCountry}`}
                onDelete={() => setSelectedCountry('')}
                size="small"
              />
            )}
            {selectedLanguage && (
              <Chip
                label={`Language: ${selectedLanguage}`}
                onDelete={() => setSelectedLanguage('')}
                size="small"
              />
            )}
            <Chip
              label="Clear all"
              onClick={clearFilters}
              size="small"
              color="primary"
              variant="outlined"
            />
          </Box>
        )}
      </Paper>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Fade in={!loading}>
          <Grid container spacing={2}>
            {stations.map((station) => (
              <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={station.stationuuid} sx={{ height: '280px' }}>
                <StationCard station={station} />
              </Grid>
            ))}
            {stations.length === 0 && !loading && (
              <Grid item xs={12}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 4, 
                    textAlign: 'center',
                    background: theme.palette.mode === 'dark' 
                      ? 'rgba(255, 255, 255, 0.05)' 
                      : 'rgba(0, 0, 0, 0.02)',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    {hasActiveFilters ? 'No stations found' : 'Start your search'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {hasActiveFilters 
                      ? 'Try adjusting your search criteria or clear the filters'
                      : 'Use the search bar above to find radio stations by name, country, or language'}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Fade>
      )}
    </Box>
  );
};

export default Search; 