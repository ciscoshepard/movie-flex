import React from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, Divider, Drawer } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import InfoIcon from '@mui/icons-material/Info';

interface SideBarProps {
  open: boolean;
  onClose: () => void;
}

const SideBar: React.FC<SideBarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          <ListItem button onClick={() => handleNavigation('/')}>
            <ListItemIcon><HomeIcon /></ListItemIcon>
            <ListItemText primary="Accueil" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/movies')}>
            <ListItemIcon><MovieIcon /></ListItemIcon>
            <ListItemText primary="Films" />
          </ListItem>
          <ListItem button onClick={() => handleNavigation('/series')}>
            <ListItemIcon><TvIcon /></ListItemIcon>
            <ListItemText primary="Séries" />
          </ListItem>
          <Divider sx={{ my: 1 }} />
          <ListItem button onClick={() => handleNavigation('/about')}>
            <ListItemIcon><InfoIcon /></ListItemIcon>
            <ListItemText primary="À propos" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;