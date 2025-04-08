import React from 'react';
import { Box, Typography, Button, Chip, Container, useMediaQuery, useTheme } from '@mui/material';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const year = release_date ? new Date(release_date).getFullYear() : 'N/A';
  const country = origin_country && origin_country.length > 0 ? origin_country[0] : 'FR';
  const popularityRounded = popularity ? Math.round(popularity) : 'N/A';
  const rating = adult ? 'R' : 'PG';

  const truncatedOverview = isMobile && overview && overview.length > 120 
    ? `${overview.substring(0, 120)}...` 
    : overview;

  return (
    <Box
      sx={{
        position: 'relative',
        height: { xs: '70vh', sm: '75vh', md: '80vh' },
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.9)), url(https://image.tmdb.org/t/p/original${backdrop_path})`,
        backgroundSize: 'cover',
        backgroundPosition: { xs: 'center', sm: 'center top' },
        display: 'flex',
        alignItems: 'flex-end',
        pb: { xs: 4, sm: 6, md: 8 },
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: { xs: '70%', sm: '60%', md: '50%' },
          background: 'linear-gradient(transparent, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.9))',
          zIndex: 1,
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ maxWidth: { xs: '100%', md: '60%' } }}>
          <Typography variant="h3" sx={{ 
            fontSize: { xs: '1.75rem', sm: '2.5rem', md: '3rem' },
            fontWeight: 'bold',
            mb: 1,
            textShadow: '0 2px 4px rgba(0,0,0,0.8)'
          }}>
            {title}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 }, 
            mb: { xs: 2, sm: 3 }, 
            flexWrap: 'wrap'
          }}>
            <Chip 
              label={`${country}`} 
              color="primary" 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
            />
            <Chip 
              label={`${year}`} 
              color="primary" 
              variant="outlined" 
              size={isMobile ? "small" : "medium"}
            />
            {!isMobile && (
              <Chip 
                label={`Popularité: ${popularityRounded}`} 
                color="primary" 
                variant="outlined" 
              />
            )}
            <Chip 
              label={rating} 
              color="error" 
              size={isMobile ? "small" : "medium"}
            />
            {seasons && (
              <Chip 
                label={`${seasons} saison${seasons > 1 ? 's' : ''}`} 
                color="success" 
                size={isMobile ? "small" : "medium"}
              />
            )}
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white', 
              mb: { xs: 3, sm: 4 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: { xs: 3, sm: 'unset' },
              textShadow: '0 1px 2px rgba(0,0,0,0.5)',
              lineHeight: { xs: 1.4, sm: 1.6 }
            }}
          >
            {truncatedOverview}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            gap: { xs: 1, sm: 2 },
            flexDirection: { xs: isMobile ? 'column' : 'row', sm: 'row' }
          }}>
            <Button
              variant="contained"
              color="error"
              startIcon={<PlayArrowIcon />}
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              sx={{ py: isMobile ? 1 : 'inherit' }}
            >
              {isMovie ? 'LECTURE' : 'VOIR SAISON'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<InfoIcon />}
              size={isMobile ? "medium" : "large"}
              fullWidth={isMobile}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                py: isMobile ? 1 : 'inherit'
              }}
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