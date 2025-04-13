import React, { useState } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import InfoIcon from '@mui/icons-material/Info';
import SearchField from './SearchField';

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm)}`);
      setSearchTerm('');
      onClose();
    }
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
      PaperProps={{
        style: {
          backgroundColor: 'yellow !important', // Couleur très visible
          border: '10px solid purple !important', // Bordure impossibe à manquer
          boxShadow: '0 0 30px red !important',
          width: '240px !important'
        }
      }}
      sx={{ width: 240 }}
    >
      <Box sx={{ p: 2 }}>
        {/* Formulaire de recherche */}
        <form onSubmit={handleSearch} style={{ marginBottom: '16px' }}>
          <SearchField
            placeholder="Rechercher..."
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
        </form>

        <List>
          <ListItem button onClick={() => handleNavigation('/')} sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}>
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Accueil" />
          </ListItem>
          
          <ListItem button onClick={() => handleNavigation('/movies')} sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}>
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <MovieIcon />
            </ListItemIcon>
            <ListItemText primary="Films" />
          </ListItem>
          
          <ListItem button onClick={() => handleNavigation('/series')} sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}>
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <TvIcon />
            </ListItemIcon>
            <ListItemText primary="Séries" />
          </ListItem>
          
          <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <ListItem button onClick={() => handleNavigation('/about')} sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            }
          }}>
            <ListItemIcon sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary="À propos" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;