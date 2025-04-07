import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';

const Home: React.FC = () => {
  const [featuredMovie, setFeaturedMovie] = useState<any>(null);
  const [trendingMovies, setTrendingMovies] = useState<any[]>([]);
  const [trendingShows, setTrendingShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les films découverte pour le Hero
        const discoverResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        // Récupérer les films tendances
        const trendingMoviesResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/movie/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        // Récupérer les séries tendances
        const trendingShowsResponse = await axios.get(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        const movies = discoverResponse.data.results;
        // Sélectionner un film aléatoire pour le Hero
        const randomIndex = Math.floor(Math.random() * movies.length);
        
        setFeaturedMovie(movies[randomIndex]);
        setTrendingMovies(trendingMoviesResponse.data.results.slice(0, 8));
        setTrendingShows(trendingShowsResponse.data.results.slice(0, 8));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
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
          // Modification commune pour toutes les cartes media (dans Home, Movies, Series, SearchResults)
          // Remplacer les CardActions existantes et ajouter des effets hover

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
                alt={isMovie ? media.title : media.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {isMovie ? media.title : media.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {isMovie 
                    ? media.release_date && new Date(media.release_date).getFullYear() 
                    : media.first_air_date && new Date(media.first_air_date).getFullYear()}
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
        origin_country={['FR']} // Par défaut
        popularity={featuredMovie.popularity}
        adult={featuredMovie.adult}
        isMovie={true}
      />
      
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Films populaires</Typography>
        {renderMediaCards(trendingMovies, true)}
        
        <Typography variant="h4" sx={{ my: 3 }}>Séries tendances</Typography>
        {renderMediaCards(trendingShows, false)}
      </Container>
    </Box>
  );
};

export default Home;