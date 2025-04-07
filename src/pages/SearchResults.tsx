import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Grid, Card, CardMedia, CardContent, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface SearchResultsProps {
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ query }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        // Recherche de films
        const moviesResponse = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&query=${query}&page=1`
        );
        
        // Recherche de séries
        const tvResponse = await axios.get(
          `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&query=${query}&page=1`
        );
        
        setMovies(moviesResponse.data.results);
        setTvShows(tvResponse.data.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [query]);

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
                  {isMovie && media.release_date 
                    ? new Date(media.release_date).getFullYear() 
                    : media.first_air_date && new Date(media.first_air_date).getFullYear()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>Recherche en cours...</Box>;
  }

  if (!query) {
    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        <Typography variant="h4" gutterBottom>Veuillez saisir un terme de recherche</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Résultats pour "{query}"
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      {movies.length > 0 ? (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>Films trouvés ({movies.length})</Typography>
          {renderMediaCards(movies, true)}
        </>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>Aucun film trouvé</Typography>
      )}
      
      <Divider sx={{ my: 4 }} />
      
      {tvShows.length > 0 ? (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>Séries trouvées ({tvShows.length})</Typography>
          {renderMediaCards(tvShows, false)}
        </>
      ) : (
        <Typography variant="body1" sx={{ mt: 2 }}>Aucune série trouvée</Typography>
      )}
    </Container>
  );
};

export default SearchResults;