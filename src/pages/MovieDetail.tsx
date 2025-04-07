import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Grid, Card, CardMedia, 
  CardContent, IconButton, Paper, List, ListItem, Avatar, ListItemAvatar,
  ListItemText
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        // Récupérer les détails du film
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        // Récupérer le casting et l'équipe
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        // Récupérer les vidéos (bande-annonce)
        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        setMovie(movieResponse.data);
        setCast(creditsResponse.data.cast.slice(0, 10)); // Limiter à 10 acteurs
        
        // Filtrer pour obtenir le réalisateur, producteurs, scénaristes
        const directors = creditsResponse.data.crew.filter((member: any) => member.job === "Director");
        const writers = creditsResponse.data.crew.filter((member: any) => 
          member.department === "Writing" || member.job === "Screenplay" || member.job === "Writer"
        );
        const producers = creditsResponse.data.crew.filter((member: any) => member.job === "Producer");
        
        setCrew([...directors, ...writers.slice(0, 3), ...producers.slice(0, 2)]);
        
        // Récupérer la bande-annonce
        const trailers = videosResponse.data.results.filter((video: any) => 
          video.type === "Trailer" && (video.site === "YouTube" || video.site === "Vimeo")
        );
        
        if (trailers.length > 0) {
          setTrailer(trailers[0].key);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
  }, [id]);
  
  const handleClose = () => {
    navigate(-1);
  };
  
  const handleTrailerClick = () => {
    setShowTrailer(true);
  };
  
  if (loading || !movie) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>Chargement...</Box>;
  }
  
  return (
    <Box>
      {/* En-tête avec image de fond */}
      <Box
        sx={{
          position: 'relative',
          height: '50vh',
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <IconButton 
            onClick={handleClose}
            sx={{ 
              position: 'absolute', 
              top: 16, 
              right: 16, 
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' }
            }}
          >
            <CloseIcon />
          </IconButton>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ 
                  width: '100%', 
                  maxWidth: '300px',
                  borderRadius: '8px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Typography variant="h3" sx={{ color: 'white', mb: 2 }}>
                {movie.title}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {movie.genres.map((genre: any) => (
                  <Chip key={genre.id} label={genre.name} size="small" />
                ))}
                <Chip label={`${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min`} size="small" />
                <Chip label={new Date(movie.release_date).getFullYear()} size="small" />
                <Chip label={`${Math.round(movie.vote_average * 10) / 10}/10`} color="primary" size="small" />
              </Box>
              
              <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                {movie.overview}
              </Typography>
              
              {trailer && (
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleTrailerClick}
                  size="large"
                  sx={{ mb: 2 }}
                >
                  BANDE ANNONCE
                </Button>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Affichage du trailer */}
        {showTrailer && trailer && (
          <Box sx={{ mb: 5, position: 'relative', paddingTop: '56.25%', width: '100%' }}>
            <Paper 
              elevation={3} 
              sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%',
                overflow: 'hidden',
                borderRadius: 2
              }}
            >
              <IconButton 
                onClick={() => setShowTrailer(false)}
                sx={{ 
                  position: 'absolute', 
                  top: 8, 
                  right: 8, 
                  zIndex: 2,
                  color: 'white',
                  bgcolor: 'rgba(0,0,0,0.6)',
                  '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' }
                }}
              >
                <CloseIcon />
              </IconButton>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{ position: 'absolute', top: 0, left: 0 }}
              />
            </Paper>
          </Box>
        )}
        
        {/* Casting */}
        <Typography variant="h4" sx={{ mb: 3 }}>Casting</Typography>
        <Grid container spacing={2} sx={{ mb: 5 }}>
          {cast.map((actor) => (
            <Grid item key={actor.id} xs={6} sm={4} md={3} lg={2}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://via.placeholder.com/185x278?text=No+Image'
                  }
                  alt={actor.name}
                />
                <CardContent>
                  <Typography variant="subtitle2" component="div">
                    {actor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {actor.character}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Équipe de réalisation */}
        <Typography variant="h4" sx={{ mb: 3 }}>Réalisation</Typography>
        <List>
          {crew.map((member) => (
            <ListItem key={`${member.id}-${member.job}`}>
              <ListItemAvatar>
                <Avatar 
                  src={
                    member.profile_path
                      ? `https://image.tmdb.org/t/p/w45${member.profile_path}`
                      : undefined
                  }
                />
              </ListItemAvatar>
              <ListItemText 
                primary={member.name}
                secondary={member.job}
              />
            </ListItem>
          ))}
        </List>
      </Container>
    </Box>
  );
};

export default MovieDetail;