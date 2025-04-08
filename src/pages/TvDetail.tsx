import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Grid, Card, CardMedia, 
  CardContent, IconButton, Paper, List, ListItem, Avatar, ListItemAvatar,
  ListItemText, Accordion, AccordionSummary, AccordionDetails, useMediaQuery, useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import MediaCard from '../components/MediaCard';

const TvDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [show, setShow] = useState<any>(null);
  const [cast, setCast] = useState<any[]>([]);
  const [crew, setCrew] = useState<any[]>([]);
  const [trailer, setTrailer] = useState<string | null>(null);
  const [seasons, setSeasons] = useState<any[]>([]);
  const [expandedSeason, setExpandedSeason] = useState<number | null>(null);
  const [episodes, setEpisodes] = useState<{ [key: number]: any[] }>({});
  const [showTrailer, setShowTrailer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [synopsisExpanded, setSynopsisExpanded] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchTvDetails = async () => {
      try {
        const showResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        const recommendationsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&page=1`
        );

        setShow(showResponse.data);
        setSeasons(showResponse.data.seasons.filter((s: any) => s.season_number > 0));
        setCast(creditsResponse.data.cast.slice(0, 10));
        setRecommendations(recommendationsResponse.data.results.slice(0, 20));
        
        const creators = showResponse.data.created_by || [];
        const writers = creditsResponse.data.crew.filter((member: any) => 
          member.department === "Writing" || member.job === "Writer"
        );
        const directors = creditsResponse.data.crew.filter((member: any) => 
          member.job === "Director" || member.department === "Directing"
        );
        const producers = creditsResponse.data.crew.filter((member: any) => 
          member.job === "Producer" || member.job === "Executive Producer"
        );
        
        const uniqueCrewIds = new Set();
        const uniqueCrew = [...creators, ...directors.slice(0, 2), ...writers.slice(0, 2), ...producers.slice(0, 2)]
          .filter(member => {
            if (uniqueCrewIds.has(member.id)) return false;
            uniqueCrewIds.add(member.id);
            return true;
          });
        
        setCrew(uniqueCrew);
        
        const trailers = videosResponse.data.results.filter((video: any) => 
          video.type === "Trailer" && (video.site === "YouTube" || video.site === "Vimeo")
        );
        
        if (trailers.length > 0) {
          setTrailer(trailers[0].key);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching TV show details:', error);
        setLoading(false);
      }
    };
    
    fetchTvDetails();
  }, [id]);
  

  const fetchSeasonEpisodes = async (seasonNumber: number) => {
    if (episodes[seasonNumber]) {
      return;
    }
    
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
      );
      
      setEpisodes(prev => ({
        ...prev,
        [seasonNumber]: response.data.episodes
      }));
    } catch (error) {
      console.error(`Error fetching season ${seasonNumber} episodes:`, error);
    }
  };
  
  const handleSeasonToggle = (seasonNumber: number) => () => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null);
    } else {
      setExpandedSeason(seasonNumber);
      fetchSeasonEpisodes(seasonNumber);
    }
  };
  
  const handleClose = () => {
    navigate(-1);
  };
  
  const handleTrailerClick = () => {
    setShowTrailer(true);
  };
  
  const handleRecommendationClick = (tvId: number) => {
    // Réinitialiser les états avant de naviguer
    setShow(null);
    setSeasons([]);
    setCast([]);
    setCrew([]);
    setEpisodes({});
    setExpandedSeason(null);
    setLoading(true);
    setTrailer(null);
    setRecommendations([]);
    
    // Scroll vers le haut
    window.scrollTo(0, 0);
    
    // Navigation vers la nouvelle série
    navigate(`/tv/${tvId}`);
  };
  
  const renderRecommendationCards = () => {
    return (
      <Grid container spacing={2}>
        {recommendations.map((tv) => (
           <Grid item key={tv.id} xs={6} sm={6} md={3} lg={2}>
            <MediaCard
              id={tv.id}
              title={tv.name}
              posterPath={tv.poster_path}
              releaseDate={tv.first_air_date}
              isMovie={false}
              onClick={handleRecommendationClick}
            />
          </Grid>
        ))}
      </Grid>
    );
  };

  if (loading || !show) {
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
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${show.backdrop_path})`,
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
          
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={4} sm={3} md={2}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
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
                {show.name}
              </Typography>
              
              <Typography variant="body2" sx={{ 
                color: 'lightgray',
                fontSize: { xs: '0.8rem', sm: '0.9rem' },
                mb: 1
              }}>
                {show.first_air_date && new Date(show.first_air_date).getFullYear()} • {show.number_of_seasons} saison{show.number_of_seasons > 1 ? 's' : ''}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                {show.genres.slice(0, isMobile ? 2 : show.genres.length).map((genre: any) => (
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
                
                {isMobile && show.genres.length > 2 && (
                  <Chip 
                    label={`+${show.genres.length - 2}`} 
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
            {show.overview || "Aucune description disponible."}
          </Typography>
          
          {isMobile && show.overview && show.overview.length > 200 && (
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
          Saisons
        </Typography>
        
        {seasons.map((season: any) => (
          <Accordion 
            key={season.id}
            expanded={expandedSeason === season.season_number}
            onChange={handleSeasonToggle(season.season_number)}
            sx={{ mb: { xs: 1, sm: 2 } }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ 
                px: { xs: 1.5, sm: 2 },
                py: { xs: 0.5, sm: 1 } 
              }}
            >
              <Typography sx={{ fontSize: { xs: '0.9rem', sm: '1rem' }, fontWeight: 'medium' }}>
                Saison {season.season_number} {season.air_date && `(${new Date(season.air_date).getFullYear()})`}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 }, py: { xs: 1, sm: 2 } }}>
              <Box sx={{ display: 'flex', mb: 2 }}>
                <Box sx={{ width: isMobile ? 80 : 120, flexShrink: 0, mr: 2 }}>
                  <img 
                    src={
                      season.poster_path
                        ? `https://image.tmdb.org/t/p/w185${season.poster_path}`
                        : 'https://via.placeholder.com/185x278?text=No+Image'
                    }
                    alt={`Saison ${season.season_number}`}
                    style={{ width: '100%', borderRadius: '4px' }}
                    loading="lazy"
                  />
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' } }}>
                    {season.episode_count} épisode{season.episode_count > 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    mt: 1,
                    fontSize: { xs: '0.8rem', sm: '0.9rem' },
                    display: '-webkit-box',
                    overflow: 'hidden',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: { xs: 3, sm: 5 }
                  }}>
                    {season.overview || "Aucune description disponible pour cette saison."}
                  </Typography>
                </Box>
              </Box>
              
              {/* Liste des épisodes */}
              {episodes[season.season_number] ? (
                <Grid container spacing={1} sx={{ mt: 2 }}>
                  {episodes[season.season_number].map((episode: any) => (
                    <Grid item key={episode.id} xs={6} sm={4} md={3} lg={2}>
                      <Card 
                        sx={{ 
                          height: '100%',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                            '& .episode-overlay': {
                              opacity: 1
                            },
                            '& .episode-details': {
                              transform: 'translateY(0)'
                            }
                          }
                        }}
                      >
                        <Box sx={{ position: 'relative' }}>
                          <CardMedia
                            component="img"
                            loading="lazy"
                            height={isMobile ? 100 : 120}
                            image={
                              episode.still_path
                                ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                                : 'https://via.placeholder.com/500x281?text=Épisode+' + episode.episode_number
                            }
                            alt={episode.name}
                            sx={{
                              objectFit: 'cover',
                              bgcolor: 'rgba(0,0,0,0.1)'
                            }}
                          />
                          
                          {/* Overlay de l'épisode (visible au survol) */}
                          <Box 
                            className="episode-overlay" 
                            sx={{ 
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: 'rgba(0,0,0,0.7)',
                              opacity: 0,
                              transition: 'opacity 0.3s',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <IconButton 
                              size="small" 
                              sx={{ 
                                color: 'white',
                                backgroundColor: 'rgba(255,0,0,0.7)',
                                '&:hover': { backgroundColor: 'rgba(255,0,0,0.9)' }
                              }}
                            >
                              <PlayArrowIcon />
                            </IconButton>
                          </Box>
                          
                          {/* Badge du numéro d'épisode */}
                          <Box sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: 'white',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            padding: '2px 6px',
                            fontWeight: 'bold'
                          }}>
                            {episode.episode_number}
                          </Box>
                        </Box>
                        
                        <CardContent sx={{ p: isMobile ? 1 : 1.5 }}>
                          <Typography 
                            variant="subtitle2" 
                            sx={{ 
                              fontSize: { xs: '0.75rem', sm: '0.85rem' },
                              fontWeight: 'bold',
                              mb: 0.5,
                              lineHeight: 1.2,
                              // Limiter à 2 lignes
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {episode.name}
                          </Typography>
                          
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: 'text.secondary',
                              fontSize: { xs: '0.7rem', sm: '0.75rem' }
                            }}
                          >
                            {episode.air_date ? 
                              new Date(episode.air_date).toLocaleDateString('fr-FR') : 
                              "Date inconnue"}
                          </Typography>
                          
                          {/* Détails supplémentaires (visibles au survol sur desktop) */}
                          {!isMobile && (
                            <Box 
                              className="episode-details" 
                              sx={{ 
                                mt: 1,
                                transform: 'translateY(100%)',
                                transition: 'transform 0.3s',
                                height: { sm: '3.6em' }, // Environ 3 lignes
                                overflow: 'hidden'
                              }}
                            >
                              <Typography 
                                variant="caption" 
                                sx={{ 
                                  display: '-webkit-box',
                                  WebkitLineClamp: 3,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  fontSize: '0.7rem',
                                  opacity: 0.9,
                                  lineHeight: 1.2
                                }}
                              >
                                {episode.overview ? episode.overview.substring(0, 100) + (episode.overview.length > 100 ? '...' : '') : "Pas de description disponible"}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Box sx={{ mt: 2, textAlign: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Chargement des épisodes...
                  </Typography>
                </Box>
              )}
            </AccordionDetails>
          </Accordion>
        ))}
        
        <Typography variant="h5" sx={{ 
          mt: 3,
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

        {/* Section Équipe technique */}
        <Typography variant="h5" sx={{ 
          mt: 3,
          mb: 1, 
          fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' }
        }}>
          Équipe technique
        </Typography>

        {isMobile ? (
          <List dense>
            {crew.map((member: any) => (
              <ListItem key={`${member.id}-${member.job || 'Creator'}`}>
                <ListItemAvatar>
                  <Avatar>
                    {member.name.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText 
                  primary={member.name} 
                  secondary={member.job || (member.department === 'Created By' ? 'Créateur' : member.department)}
                  primaryTypographyProps={{ fontSize: '0.9rem' }}
                  secondaryTypographyProps={{ fontSize: '0.8rem' }}
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
            <Grid container spacing={3}>
              {crew.map((member: any) => (
                <Grid item key={`${member.id}-${member.job || 'Creator'}`} xs={12} sm={6} md={4}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ mr: 2 }}>
                      {member.profile_path ? (
                        <img 
                          src={`https://image.tmdb.org/t/p/w45${member.profile_path}`} 
                          alt={member.name}
                          style={{ width: '100%', height: '100%' }}
                        />
                      ) : (
                        member.name.charAt(0)
                      )}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1">{member.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {member.job || (member.department === 'Created By' ? 'Créateur' : member.department)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}

        {recommendations.length > 0 && (
          <>
            <Typography variant="h4" sx={{ 
              my: { xs: 2, sm: 3 },
              fontSize: { xs: '1.5rem', sm: '2rem', md: '2.25rem' }
            }}>
              Vous pourriez aussi aimer
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

export default TvDetail;