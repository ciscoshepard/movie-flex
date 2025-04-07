import React, { useState, useEffect } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';

const CenterScreen: React.FC = () => {
  const [discoverMovies, setDiscoverMovies] = useState<any[]>([]);
  const [currentMovieIndex, setCurrentMovieIndex] = useState(0);

  useEffect(() => {
    const fetchDiscoverMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        setDiscoverMovies(response.data.results);
      } catch (error) {
        console.error('Error fetching discover movies:', error);
      }
    };

    fetchDiscoverMovies();
  }, []);

  const currentMovie = discoverMovies[currentMovieIndex];

  const handlePrevious = () => {
    setCurrentMovieIndex((prev) => (prev > 0 ? prev - 1 : discoverMovies.length - 1));
  };

  const handleNext = () => {
    setCurrentMovieIndex((prev) => (prev < discoverMovies.length - 1 ? prev + 1 : 0));
  };

  if (!currentMovie) return null;

  return (
    <Box sx={{ flex: 1, overflow: 'auto', position: 'relative' }}>
      <Box
        sx={{
          position: 'relative',
          height: '80vh', // Augmenter de 60vh à 80vh
          backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 50px',
          }}
        >
          <Typography variant="h2" sx={{ 
            color: 'white', 
            mb: 2,
            fontSize: { xs: '2rem', md: '3.5rem' } // Responsive
          }}>
            {currentMovie.title}
          </Typography>
          <Typography variant="subtitle1" sx={{ color: 'white', mb: 2 }}>
            {currentMovie.original_language.toUpperCase()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography variant="body1" sx={{ color: 'white', mr: 1 }}>
              {currentMovie.vote_average}
            </Typography>
            <Typography variant="body1" sx={{ color: 'yellow' }}>
              ★
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ color: 'white', mb: 4, maxWidth: '50%' }}>
            {currentMovie.overview}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<PlayArrowIcon />}
              sx={{ color: 'white' }}
            >
              Lecture
            </Button>
            <Button variant="outlined" color="inherit" sx={{ color: 'white' }}>
              Plus d'infos
            </Button>
          </Box>
        </Box>
      </Box>

      <Box sx={{ 
        position: 'absolute', 
        top: '50%',  // Reste centré verticalement
        left: 0, 
        right: 0, 
        display: 'flex', 
        justifyContent: 'space-between', 
        px: 2,
        transform: 'translateY(-50%)' // Centrage parfait
      }}>
        <IconButton onClick={handlePrevious} sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}>
          <ArrowBackIcon />
        </IconButton>
        <IconButton onClick={handleNext} sx={{ color: 'white', bgcolor: 'rgba(0,0,0,0.5)' }}>
          <ArrowForwardIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CenterScreen;