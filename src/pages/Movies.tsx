import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Hero from '../components/Hero';
import MediaCard from '../components/MediaCard';

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
           <Grid item key={media.id} xs={6} sm={6} md={3} lg={2}> {/* 2 cartes par ligne sur mobile */}
            <MediaCard
              id={media.id}
              title={isMovie ? media.title : media.name}
              posterPath={media.poster_path}
              releaseDate={isMovie ? media.release_date : media.first_air_date}
              isMovie={isMovie}
              onClick={handleCardClick}
            />
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