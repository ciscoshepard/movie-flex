import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';

import AppBar from './components/AppBar';
import Sidebar from './components/SideBar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';
import About from './pages/About';
import SearchResults from './pages/SearchResults';
import TvDetail from './pages/TvDetail';
import MovieDetail from './pages/MovieDetail';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <AppBar onMenuClick={handleDrawerToggle} onSearch={handleSearch} />
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={handleDrawerToggle}
          >
            <Sidebar open={drawerOpen} onClose={handleDrawerToggle} />
          </Drawer>
          
          <Box component="main" sx={{ flexGrow: 1 }}>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/series" element={<Series />} />
            <Route path="/about" element={<About />} />
            <Route path="/search" element={<SearchResults query={searchQuery} />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TvDetail />} />
          </Routes>
          
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;