import { Box, List, ListItem, ListItemIcon, ListItemText, Typography, Divider } from '@mui/material';
import { Home, Search, Favorite, Language, Tag } from '@mui/icons-material';
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
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          Radio App
        </Typography>
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