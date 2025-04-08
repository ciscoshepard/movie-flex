import React from 'react';
import { Card, CardMedia, CardContent, Typography } from '@mui/material';

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  releaseDate?: string;
  isMovie: boolean;
  onClick: (id: number, isMovie: boolean) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ 
  id, title, posterPath, releaseDate, isMovie, onClick 
}) => {
  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: { xs: 'none', sm: 'scale(1.05)' }, // Désactive l'effet hover sur mobile
          boxShadow: { xs: '0 4px 8px rgba(0,0,0,0.1)', sm: '0 10px 20px rgba(0,0,0,0.2)' }
        },
        '&:active': { // Ajoute un effet de toucher pour mobile
          transform: { xs: 'scale(0.98)', sm: 'none' },
          bgcolor: { xs: 'rgba(0,0,0,0.05)', sm: 'transparent' }
        },
        cursor: 'pointer'
      }}
      onClick={() => onClick(id, isMovie)}
    >
      <CardMedia
        component="img"
        loading="lazy" // Charge les images seulement quand nécessaire
        height="auto"
        sx={{ 
          width: '100%',
          aspectRatio: '2/3',
          objectFit: 'cover',
          minHeight: { xs: '200px', sm: 'auto' } // Hauteur minimale sur mobile
        }}
        image={
          posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'https://via.placeholder.com/500x750?text=No+Image'
        }
        alt={title}
      />
      <CardContent sx={{ 
        flexGrow: 1, 
        padding: { xs: '12px 8px', sm: '16px' }, // Plus de padding vertical sur mobile
        textAlign: 'center' 
      }}>
        <Typography 
          gutterBottom 
          variant="subtitle2" 
          component="div" 
          noWrap
          sx={{ fontSize: { xs: '0.85rem', sm: '0.875rem' } }} // Légèrement plus grand sur mobile
        >
          {title}
        </Typography>
        {releaseDate && (
          <Typography variant="body2" color="text.secondary">
            {new Date(releaseDate).getFullYear()}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default MediaCard;