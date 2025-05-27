import { Box, Typography, Avatar, IconButton, Menu, MenuItem, useTheme, useMediaQuery } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import Settings from './Settings';

const AppHeader = () => {
  const { user, signOut } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSettingsOpen = () => {
    setSettingsOpen(true);
    handleMenuClose();
  };

  const handleSettingsClose = () => {
    setSettingsOpen(false);
  };

  if (!user) {
    return null;
  }

  // Get initials from email for avatar
  const getInitials = (email: string | undefined) => {
    return email ? email.charAt(0).toUpperCase() : '?';
  };

  return (
    <>
      <Box 
        sx={{
          position: 'fixed',
          top: 0,
          right: 0,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          p: isMobile ? 0.5 : 1,
          m: isMobile ? 1 : 2,
        }}
      >
        <IconButton
          onClick={handleMenuOpen}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          }}
        >
          <Avatar
            sx={{
              bgcolor: 'primary.main',
              width: isMobile ? 28 : 32,
              height: isMobile ? 28 : 32,
            }}
          >
            {getInitials(user.email)}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              bgcolor: 'background.paper',
              mt: 1,
              minWidth: isMobile ? '200px' : '220px',
            },
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem disabled>
            <Typography variant="body2" color="text.secondary" noWrap>
              {user.email}
            </Typography>
          </MenuItem>
          <MenuItem onClick={handleSettingsOpen}>
            <Typography variant="body2">Settings</Typography>
          </MenuItem>
          <MenuItem onClick={() => {
            handleMenuClose();
            handleLogout();
          }}>
            <Typography variant="body2">Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>

      <Settings 
        open={settingsOpen} 
        onClose={handleSettingsClose} 
      />
    </>
  );
};

export default AppHeader; 