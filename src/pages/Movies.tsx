import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';

const Movies: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [actionMovies, setActionMovies] = useState<any[]>([]);
  const [comedyMovies, setComedyMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiscoverMovies = async () => {
      try {
        // Films populaires pour le hero
        const discoverResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc`
        );
        
        // Films d'action (genre_id=28)
        const actionResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&with_genres=28`
        );
        
        // Films de comédie (genre_id=35)
        const comedyResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&with_genres=35`
        );
        
        const movies = discoverResponse.data.results;
        const randomIndex = Math.floor(Math.random() * movies.length);
        
        setFeaturedMovie(movies[randomIndex]);
        setActionMovies(actionResponse.data.results.slice(0, 8));
        setComedyMovies(comedyResponse.data.results.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching discover movies:', error);
        setLoading(false);
      }
    };

    fetchDiscoverMovies();
  }, []);

  // Fonction pour gérer le clic sur une carte
  const navigate = useNavigate();

  const handleCardClick = (id: number, isMovie: boolean) => {
    if (isMovie) {
      navigate(`/movie/${id}`);
    } else {
      navigate(`/tv/${id}`);
    }
  };

  const renderMediaCards = (mediaList: any[], isMovie: boolean) => {
    return (
      <Grid container spacing={2}>
        {mediaList.map((media) => (
          <Grid item key={media.id} xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
                  cursor: 'pointer'
                }
              }}
              onClick={() => handleCardClick(media.id, isMovie)}
            >
              <CardMedia
                component="img"
                height="260"
                sx={{ objectFit: 'cover' }}
                image={
                  media.poster_path
                    ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                    : 'https://via.placeholder.com/500x750?text=No+Image'
                }
                alt={media.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {media.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {media.release_date && new Date(media.release_date).getFullYear()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading || !featuredMovie) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>Chargement...</Box>;
  }

  return (
    <Box>
      <Hero
        title={featuredMovie.title}
        backdrop_path={featuredMovie.backdrop_path}
        overview={featuredMovie.overview}
        release_date={featuredMovie.release_date}
        origin_country={['FR']}
        popularity={featuredMovie.popularity}
        adult={featuredMovie.adult}
        isMovie={true}
      />
      
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Films d'action</Typography>
        {renderMediaCards(actionMovies, true)}
        
        <Typography variant="h4" sx={{ my: 3 }}>Films de comédie</Typography>
        {renderMediaCards(comedyMovies, true)}
      </Container>
    </Box>
  );
};

export default Movies;