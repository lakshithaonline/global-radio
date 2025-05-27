import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Home, Search, Favorite, Language, Tag, Radio } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { radioService } from '../services/radioService';
import useRadioStore from '../store/radioStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const { recentCountries, addRecentCountry } = useRadioStore();

  useEffect(() => {
    const fetchData = async () => {
      const [fetchedCountries, fetchedTags] = await Promise.all([
        radioService.getCountries(),
        radioService.getTags(),
      ]);
      setCountries(fetchedCountries);
      setTags(fetchedTags);
    };
    fetchData();
  }, []);

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Search', icon: <Search />, path: '/search' },
    { text: 'Favorites', icon: <Favorite />, path: '/favorites' },
  ];

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: 'background.paper',
        borderRight: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        msOverflowStyle: 'none',  /* IE and Edge */
        scrollbarWidth: 'none',  /* Firefox */
      }}
    >
      <Box 
        sx={{ 
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2,
          background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.05) 0%, rgba(76, 175, 80, 0.1) 100%)',
          '&:hover': {
            background: 'linear-gradient(45deg, rgba(76, 175, 80, 0.1) 0%, rgba(76, 175, 80, 0.15) 100%)',
          }
        }}
      >
        <Radio 
          sx={{ 
            color: '#4CAF50', 
            fontSize: 32,
            filter: 'drop-shadow(0px 2px 4px rgba(76, 175, 80, 0.2))',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
            }
          }} 
        />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: '#4CAF50',
              fontWeight: 800,
              letterSpacing: '0.5px',
              fontSize: '1.4rem',
              textTransform: 'uppercase',
              lineHeight: 1.2,
              textShadow: '0px 2px 4px rgba(76, 175, 80, 0.2)',
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'scale(1.02)',
                textShadow: '0px 4px 8px rgba(76, 175, 80, 0.3)',
              }
            }}
          >
            Global
          </Typography>
          <Typography 
            variant="subtitle1" 
            component="div" 
            sx={{ 
              color: '#4CAF50',
              fontWeight: 500,
              letterSpacing: '1px',
              fontSize: '0.9rem',
              opacity: 0.9,
              textTransform: 'uppercase',
              lineHeight: 1.2,
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
            }}
          >
            Radio
          </Typography>
        </Box>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => navigate(item.path)}
            sx={{
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.08)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      {/* Recent Countries Section */}
      {recentCountries.length > 0 && (
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Recent Countries
          </Typography>
          <List dense>
            {recentCountries.map((country) => (
              <ListItem
                button
                key={country}
                onClick={() => {
                  addRecentCountry(country);
                  navigate(`/country/${country}`);
                }}
                sx={{
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.08)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Language fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={country} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Countries
        </Typography>
        <List dense>
          {countries.slice(0, 10).map((country) => (
            <ListItem
              button
              key={country}
              onClick={() => {
                addRecentCountry(country);
                navigate(`/country/${country}`);
              }}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Language fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={country} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ px: 2, py: 1 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Popular Tags
        </Typography>
        <List dense>
          {tags.slice(0, 10).map((tag) => (
            <ListItem
              button
              key={tag}
              onClick={() => navigate(`/tag/${tag}`)}
              sx={{
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Tag fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={tag} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;