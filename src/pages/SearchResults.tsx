import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Divider, TextField} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import MediaCard from '../components/MediaCard';
import { CircularProgress, Box } from '@mui/material';
import SearchField from '../components/SearchField';

const SearchResults: React.FC = () => {
  const { query: urlQuery = '' } = useParams<{ query?: string }>();
  const [query, setQuery] = useState<string>(urlQuery);
  const [searchInput, setSearchInput] = useState<string>(urlQuery); // Nouvel état pour le champ de recherche
  const [movies, setMovies] = useState<any[]>([]);
  const [tvShows, setTvShows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Effet pour charger les résultats quand query change
  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const moviesResponse = await axios.get(
          `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&query=${query}&page=1`
        );
        
        const tvResponse = await axios.get(
          `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&query=${query}&page=1`
        );
        
        setMovies(moviesResponse.data.results);
        setTvShows(tvResponse.data.results);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
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

  // Nouveau gestionnaire pour la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(searchInput);
      // Mise à jour de l'URL pour refléter la nouvelle recherche
      navigate(`/search/${encodeURIComponent(searchInput)}`);
    }
  };

  const renderMediaCards = (mediaList: any[], isMovie: boolean) => {
    return (
      <Grid container spacing={2}>
        {mediaList.map((media) => (
           <Grid item key={media.id} xs={6} sm={6} md={3} lg={2}>
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
  
  if (!query) {
    return (
      <Container maxWidth="lg" sx={{ 
        py: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh'
      }}>
        <Box sx={{
          width: '100%',
          maxWidth: 600,
          mb: 4,
          textAlign: 'center'
        }}>
          <Typography variant="h4" sx={{ mb: 3 }}>
            Rechercher des films et séries
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.8 }}>
            Explorez notre catalogue complet de films et séries
          </Typography>
        </Box>
        
        <Box sx={{
          width: '100%',
          maxWidth: 600,
          p: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)'
        }}>
          <form onSubmit={handleSubmit}>
          <SearchField
            placeholder="Que souhaitez-vous regarder aujourd'hui ?"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            autoFocus
          />
          </form>
        </Box>
      </Container>
    );
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>
        Résultats pour "{query}"
      </Typography>
      
      {/* Encapsulation du TextField dans un formulaire */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Affiner la recherche"
          value={searchInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchInput(e.target.value)}
          margin="normal"
        />
      </form>
      
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