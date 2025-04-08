import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Container, Typography, Button, Chip, Grid, Card, CardMedia, 
  CardContent, IconButton, Paper, List, ListItem, Avatar, 
  ListItemAvatar, ListItemText, Accordion, AccordionSummary, AccordionDetails
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
  const [recommendations, setRecommendations] = useState<any[]>([]); // Ajoutez cette ligne

  useEffect(() => {
    const fetchTvDetails = async () => {
      try {
        // Récupérer les détails de la série
        const showResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        // Récupérer le casting et l'équipe
        const creditsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        // Récupérer les vidéos (bande-annonce)
        const videosResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        
        // Récupérer les recommandations
        const recommendationsResponse = await axios.get(
          `https://api.themoviedb.org/3/tv/${id}/recommendations?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&page=1`
        );

        setShow(showResponse.data);
        setSeasons(showResponse.data.seasons.filter((s: any) => s.season_number > 0));
        setCast(creditsResponse.data.cast.slice(0, 10)); // Limiter à 10 
        setRecommendations(recommendationsResponse.data.results.slice(0, 20)); // Limiter à 20 recommandations
        
        // Filtrer pour obtenir les créateurs, producteurs, scénaristes
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
        
        // Combine and deduplicate crew members
        const uniqueCrewIds = new Set();
        const uniqueCrew = [...creators, ...directors.slice(0, 2), ...writers.slice(0, 2), ...producers.slice(0, 2)]
          .filter(member => {
            if (uniqueCrewIds.has(member.id)) return false;
            uniqueCrewIds.add(member.id);
            return true;
          });
        
        setCrew(uniqueCrew);
        
        // Récupérer la bande-annonce
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
      return; // Déjà chargé
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
  
  const handleSeasonClick = (seasonNumber: number) => {
    if (expandedSeason === seasonNumber) {
      setExpandedSeason(null); // Ferme l'accordéon si déjà ouvert
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
    // Remonter en haut de la page d'abord
    window.scrollTo(0, 0);
    
    // Puis naviguer vers la nouvelle série avec un court délai pour assurer le défilement
    setTimeout(() => {
      navigate(`/tv/${tvId}`);
    }, 100);
  };
  
  // Remplacez renderRecommendationCards par :
  const renderRecommendationCards = () => {
    return (
      <Grid container spacing={2}>
        {recommendations.map((tv) => (
          <Grid item key={tv.id} xs={6} sm={4} md={3} lg={2}>
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
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>Chargement...</Box>;
  }
  
  return (
    <Box>
      {/* En-tête avec image de fond */}
      <Box
        sx={{
          position: 'relative',
          height: '50vh',
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
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <img 
                src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                alt={show.name}
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
                {show.name}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {show.genres.map((genre: any) => (
                  <Chip key={genre.id} label={genre.name} size="small" />
                ))}
                <Chip label={`${show.number_of_seasons} saison${show.number_of_seasons > 1 ? 's' : ''}`} size="small" color="success" />
                <Chip label={new Date(show.first_air_date).getFullYear()} size="small" />
                <Chip label={`${Math.round(show.vote_average * 10) / 10}/10`} color="primary" size="small" />
              </Box>
              
              <Typography variant="body1" sx={{ color: 'white', mb: 3 }}>
                {show.overview}
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
        
        {/* Saisons */}
        <Typography variant="h4" sx={{ mb: 3 }}>Saisons</Typography>
        <Box sx={{ mb: 5 }}>
          {seasons.map((season) => (
            <Accordion 
              key={season.id}
              expanded={expandedSeason === season.season_number}
              onChange={() => handleSeasonClick(season.season_number)}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`season${season.season_number}-content`}
                id={`season${season.season_number}-header`}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <img 
                    src={
                      season.poster_path
                        ? `https://image.tmdb.org/t/p/w92${season.poster_path}`
                        : 'https://via.placeholder.com/92x138?text=No+Image'
                    }
                    alt={season.name}
                    style={{ width: '46px', borderRadius: '4px' }}
                  />
                  <Box>
                    <Typography variant="subtitle1">{season.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {season.episode_count} épisode{season.episode_count > 1 ? 's' : ''} • {season.air_date && new Date(season.air_date).getFullYear()}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {episodes[season.season_number] ? (
                    episodes[season.season_number].map((episode) => (
                      <ListItem key={episode.id} alignItems="flex-start" sx={{ mb: 2, borderBottom: '1px solid rgba(0,0,0,0.1)', pb: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={3} md={2}>
                            <img 
                              src={
                                episode.still_path
                                  ? `https://image.tmdb.org/t/p/w300${episode.still_path}`
                                  : 'https://via.placeholder.com/300x170?text=No+Image'
                              }
                              alt={episode.name}
                              style={{ width: '100%', borderRadius: '4px' }}
                            />
                          </Grid>
                          <Grid item xs={12} sm={9} md={10}>
                            <Typography variant="subtitle1">
                              {episode.episode_number}. {episode.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              {episode.runtime ? `${episode.runtime} min • ` : ''}{new Date(episode.air_date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2">
                              {episode.overview || "Aucun synopsis disponible."}
                            </Typography>
                          </Grid>
                        </Grid>
                      </ListItem>
                    ))
                  ) : (
                    <ListItem>
                      <Typography>Chargement des épisodes...</Typography>
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
        
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
        <Typography variant="h4" sx={{ mb: 3 }}>Créateurs et Réalisation</Typography>
        <List>
          {crew.map((member) => (
            <ListItem key={`${member.id}-${member.job || 'Creator'}`}>
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
                secondary={member.job || 'Créateur'}
              />
            </ListItem>
          ))}
        </List>
          
        {/* Recommandations */}
        {recommendations.length > 0 && (
          <>
            <Typography variant="h4" sx={{ my: 3 }}>Vous pourriez aussi aimer</Typography>
            {renderRecommendationCards()}
          </>
        )}
      </Container>
    </Box>
  );
};

export default TvDetail;