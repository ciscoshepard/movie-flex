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
          transform: 'scale(1.05)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          cursor: 'pointer'
        }
      }}
      onClick={() => onClick(id, isMovie)}
    >
      <CardMedia
        component="img"
        height="auto"
        sx={{ 
          width: '100%',
          aspectRatio: '2/3',
          objectFit: 'cover'
        }}
        image={
          posterPath
            ? `https://image.tmdb.org/t/p/w500${posterPath}`
            : 'https://via.placeholder.com/500x750?text=No+Image'
        }
        alt={title}
      />
      <CardContent sx={{ flexGrow: 1, padding: '8px', textAlign: 'center' }}>
        <Typography gutterBottom variant="subtitle2" component="div" noWrap>
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