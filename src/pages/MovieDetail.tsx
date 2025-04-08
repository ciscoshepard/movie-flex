import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Grid, Card, CardMedia, 
  CardContent, IconButton, List, ListItem, Avatar, ListItemAvatar,
  ListItemText, useMediaQuery, useTheme, CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import axios from 'axios';
import MediaCard from '../components/MediaCard';

const MovieDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [backdropLoaded, setBackdropLoaded] = useState(false);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        setMovie(movieResponse.data);
        setCast(creditsResponse.data.cast.slice(0, 10));
        
        const directors = creditsResponse.data.crew.filter((member: any) => member.job === "Director");
        const writers = creditsResponse.data.crew.filter((member: any) => 
          member.department === "Writing" || member.job === "Screenplay" || member.job === "Writer"
        );
        const producers = creditsResponse.data.crew.filter((member: any) => member.job === "Producer");
        
        setCrew([...directors, ...writers.slice(0, 3), ...producers.slice(0, 2)]);
        
        const trailers = videosResponse.data.results.filter((video: any) => 
          video.type === "Trailer" && (video.site === "YouTube" || video.site === "Vimeo")
        );
        
        if (trailers.length > 0) {
          setTrailer(trailers[0].key);
        }

        const recommendationsResponse = await axios.get(
          `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );

        setRecommendations(recommendationsResponse.data.results.slice(0, 20));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setLoading(false);
      }
    };
    
    fetchMovieDetails();
    window.scrollTo(0, 0);
    
  }, [id]);

  useEffect(() => {
    if (movie && movie.backdrop_path) {
      const img = new Image();
      img.onload = () => setBackdropLoaded(true);
      img.src = `https://image.tmdb.org/t/p/original${movie.backdrop_path}`;
    }
  }, [movie]);
  
  const handleTrailerClick = () => {
    setShowTrailer(true);
  };
  
  const handleRecommendationClick = (movieId: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    navigate(`/movie/${movieId}`);
  };
  
  const renderRecommendationCards = () => {
    return (
      <Grid container spacing={2}>
        {recommendations.map((movie) => (
           <Grid item key={movie.id} xs={6} sm={6} md={3} lg={2}>
            <MediaCard
              id={movie.id}
              title={movie.title}
              posterPath={movie.poster_path}
              releaseDate={movie.release_date}
              isMovie={true}
              onClick={handleRecommendationClick}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading || !movie) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '70vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: { xs: '30vh', sm: '40vh', md: '50vh' },
          backgroundImage: backdropLoaded 
            ? `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`
            : 'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8))',
          backgroundColor: 'rgb(20, 20, 20)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transition: 'background-image 0.3s ease-in',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4} sm={3} md={2}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                style={{ 
                  width: '100%',
                  borderRadius: '8px',
                  boxShadow: '0 8px 16px rgba(0,0,0,0.3)',
                }}
                loading="lazy"
              />
            </Grid>
            
            <Grid item xs={8} sm={9} md={10}>
              <Typography variant="h4" sx={{ 
                color: 'white',
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
              }}>
                {movie.title}
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: 'lightgray',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                mb: 1
              }}>
                {movie.release_date && new Date(movie.release_date).getFullYear()} • {movie.runtime} min
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {movie.genres.slice(0, isMobile ? 2 : movie.genres.length).map((genre: any) => (
                  <Chip 
                    key={genre.id} 
                    label={genre.name} 
                    size={isMobile ? "small" : "medium"}
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)', 
                      color: 'white',
                      fontSize: { xs: '0.7rem', sm: '0.8rem' }
                    }} 
                  />
                ))}
                
                {isMobile && movie.genres.length > 2 && (
                  <Chip 
                    label={`+${movie.genres.length - 2}`} 
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }} 
                  />
                )}
              </Box>
              
              <Button
                variant="contained"
                color="error"
                startIcon={<PlayArrowIcon />}
                size={isMobile ? "small" : "medium"}
                onClick={handleTrailerClick}
                disabled={!trailer}
                sx={{ 
                  mt: { xs: 0, sm: 1 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem' }
                }}
              >
                Bande annonce
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 5 } }}>
        <Typography variant="h5" sx={{ 
          mb: 1, 
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
        }}>
          Synopsis
        </Typography>
        
        <Box>
          <Typography 
            variant="body1" 
            sx={{ 
              mb: synopsisExpanded ? 1 : { xs: 2, sm: 4 },
              fontSize: { xs: '0.9rem', sm: '1rem' },
              display: isMobile && !synopsisExpanded ? '-webkit-box' : 'block',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: isMobile && !synopsisExpanded ? 'hidden' : 'visible',
              position: 'relative',
            }}
          >
            {movie.overview || "Aucune description disponible."}
          </Typography>
          
          {isMobile && movie.overview && movie.overview.length > 200 && (
            <Button 
              variant="text" 
              size="small"
              onClick={() => setSynopsisExpanded(!synopsisExpanded)}
              sx={{ 
                fontSize: '0.8rem',
                p: 0,
                mb: 2,
                textTransform: 'none',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'transparent' }
              }}
            >
              {synopsisExpanded ? 'Voir moins' : 'Voir plus'}
            </Button>
          )}
        </Box>
        
        <Typography variant="h5" sx={{ 
          mb: 1, 
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
        }}>
          Casting
        </Typography>
        
        <Grid container spacing={{ xs: 1, sm: 2 }}>
          {cast.slice(0, isMobile ? 6 : 12).map((actor: any) => (
            <Grid item key={actor.id} xs={4} sm={4} md={2}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  loading="lazy"
                  height={isMobile ? 160 : 180}
                  image={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : 'https://via.placeholder.com/185x278?text=No+Image'
                  }
                  alt={actor.name}
                />
                <CardContent sx={{ p: isMobile ? 1 : 2 }}>
                  <Typography variant="subtitle2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }} noWrap>
                    {actor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }} noWrap>
                    {actor.character}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
          
          {isMobile && cast.length > 6 && (
            <Grid item xs={12}>
              <Button 
                fullWidth 
                variant="outlined" 
                size="small"
                sx={{ mt: 1 }}
              >
                Voir plus d'acteurs
              </Button>
            </Grid>
          )}
        </Grid>
        
        <Typography variant="h5" sx={{ 
          my: { xs: 2, sm: 3 }, 
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
        }}>
          Réalisation
        </Typography>
        
        {isMobile ? (
          <List dense>
            {crew.map((member: any) => (
              <ListItem key={`${member.id}-${member.job}`}>
                <ListItemAvatar>
                  <Avatar>
                    {member.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={member.name} 
                  secondary={member.job}
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.8rem' }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
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
        )}
        
        {recommendations.length > 0 && (
          <>
            <Typography variant="h4" sx={{ 
              my: { xs: 2, sm: 3 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
            }}>
              Films similaires
            </Typography>
            {renderRecommendationCards()}
          </>
        )}
      </Container>
      
      {showTrailer && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 1, sm: 3 }
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
            <IconButton
              onClick={() => setShowTrailer(false)}
              sx={{ color: 'white' }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center'
          }}>
            <Box sx={{ 
              width: '100%', 
              maxWidth: 900,
              position: 'relative',
              paddingBottom: '56.25%', 
              height: 0,
              overflow: 'hidden'
            }}>
              <iframe
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                src={`https://www.youtube.com/embed/${trailer}?autoplay=1`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MovieDetail;