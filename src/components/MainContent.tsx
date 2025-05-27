import { Box } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Favorites from '../pages/Favorites';
import Search from '../pages/Search';
import CountryView from '../pages/CountryView';
import TagView from '../pages/TagView';

const MainContent = () => {
  return (
    <Box
      sx={{
        flex: 1,
        overflow: 'auto',
        bgcolor: 'background.default',
        p: 3,
      }}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/country/:country" element={<CountryView />} />
        <Route path="/tag/:tag" element={<TagView />} />
      </Routes>
    </Box>
  );
};

export default MainContent; 