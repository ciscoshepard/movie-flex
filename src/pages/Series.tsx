import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Grid, Card, CardMedia, CardContent } from '@mui/material';
import axios from 'axios';
import Hero from '../components/Hero';
import { useNavigate } from 'react-router-dom';

const Series: React.FC = () => {
  const [featuredShow, setFeaturedShow] = useState<any>(null);
  const [dramaShows, setDramaShows] = useState<any[]>([]);
  const [sciFiShows, setSciFiShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les séries découverte pour le Hero
        const discoverResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&sort_by=popularity.desc`
        );
        
        // Récupérer les séries dramatiques
        const dramaResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&with_genres=18`
        );
        
        // Récupérer les séries de science-fiction
        const sciFiResponse = await axios.get(
          `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&with_genres=10765`
        );
        
        const shows = discoverResponse.data.results;
        // Sélectionner une série aléatoire pour le Hero
        const randomIndex = Math.floor(Math.random() * shows.length);
        
        setFeaturedShow(shows[randomIndex]);
        setDramaShows(dramaResponse.data.results.slice(0, 8));
        setSciFiShows(sciFiResponse.data.results.slice(0, 8));
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

  if (loading || !featuredShow) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>Chargement...</Box>;
  }

  return (
    <Box>
      <Hero
        title={featuredShow.name}
        backdrop_path={featuredShow.backdrop_path}
        overview={featuredShow.overview}
        release_date={featuredShow.first_air_date}
        origin_country={featuredShow.origin_country}
        popularity={featuredShow.popularity}
        adult={false}
        seasons={featuredShow.number_of_seasons || 1}
        isMovie={false}
      />
      
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" sx={{ mb: 3 }}>Séries dramatiques</Typography>
        {renderMediaCards(dramaShows, false)}
        
        <Typography variant="h4" sx={{ my: 3 }}>Séries de science-fiction</Typography>
        {renderMediaCards(sciFiShows, false)}
      </Container>
    </Box>
  );
};

export default Series;