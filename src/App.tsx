import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Composants chargés normalement (pages principales)
import Layout from './components/Layout';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Series from './pages/Series';

// Composants chargés paresseusement (pages secondaires)
const MovieDetail = lazy(() => import('./pages/MovieDetail'));
const TvDetail = lazy(() => import('./pages/TvDetail'));
const SearchResults = lazy(() => import('./pages/SearchResults'));
const About = lazy(() => import('./pages/About'));

// Élément de chargement
const LoadingFallback = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '70vh' 
  }}>
    <CircularProgress />
  </Box>
);

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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Routes chargées immédiatement */}
            <Route index element={<Home />} />
            <Route path="movies" element={<Movies />} />
            <Route path="series" element={<Series />} />
            
            {/* Routes chargées paresseusement */}
            <Route path="movie/:id" element={
              <Suspense fallback={<LoadingFallback />}>
                <MovieDetail />
              </Suspense>
            } />
            <Route path="tv/:id" element={
              <Suspense fallback={<LoadingFallback />}>
                <TvDetail />
              </Suspense>
            } />
            <Route path="search/:query?" element={
              <Suspense fallback={<LoadingFallback />}>
                <SearchResults />
              </Suspense>
            } />
            <Route path="about" element={
              <Suspense fallback={<LoadingFallback />}>
                <About />
              </Suspense>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;