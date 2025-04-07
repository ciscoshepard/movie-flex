import React from 'react';
import { Box, Typography, Button, Chip, Container } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';

interface HeroProps {
  title: string;
  backdrop_path: string;
  overview: string;
  release_date?: string;
  origin_country?: string[];
  popularity?: number;
  adult?: boolean;
  seasons?: number;
  isMovie: boolean;
}

const Hero: React.FC<HeroProps> = ({
  title,
  backdrop_path,
  overview,
  release_date,
  origin_country,
  popularity,
  adult,
  seasons,
  isMovie
}) => {
  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const country = origin_country && origin_country.length > 0 ? origin_country[0] : 'FR';
  const popularityRounded = popularity ? Math.round(popularity) : 'N/A';
  const rating = adult ? 'R' : 'PG';

  return (
    <Box
      sx={{
        position: 'relative',
        height: '80vh',
        width: '100%',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.8)), url(https://image.tmdb.org/t/p/original${backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: '600px', pl: 3 }}>
          <Typography variant="h2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
            {title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
            <Chip label={`${country}`} color="primary" variant="outlined" />
            <Chip label={`${year}`} color="primary" variant="outlined" />
            <Chip label={`Popularité: ${popularityRounded}`} color="primary" variant="outlined" />
            <Chip label={rating} color="error" />
            {seasons && <Chip label={`${seasons} saison${seasons > 1 ? 's' : ''}`} color="success" />}
          </Box>
          
          <Typography variant="body1" sx={{ color: 'white', mb: 4 }}>
            {overview}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<PlayArrowIcon />}
              size="large"
            >
              {isMovie ? 'LECTURE' : 'VOIR SAISON'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              size="large"
              sx={{ color: 'white', borderColor: 'white' }}
            >
              PLUS D'INFOS
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;