import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar as MuiAppBar,
  Toolbar,
  IconButton,
  Button,
  TextField,
  Box,
  Avatar,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useMediaQuery,
  InputAdornment,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import InfoIcon from '@mui/icons-material/Info';
import logo from '../assets/FG.png';

interface AppBarProps {
  onMenuClick: () => void;
  onSearch: (query: string) => void;
}

const AppBar: React.FC<AppBarProps> = ({ onMenuClick, onSearch }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleNavigation = (path: string) => {
    navigate(path);
    setDrawerOpen(false); // Ferme le drawer après navigation sur mobile
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      // Naviguer directement vers la recherche avec le terme dans l'URL
      navigate(`/search/${encodeURIComponent(searchValue)}`);
      setSearchValue(''); // Réinitialiser la barre après recherche
      setDrawerOpen(false);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const menuItems = [
    { text: 'Accueil', icon: <HomeIcon />, path: '/' },
    { text: 'Films', icon: <MovieIcon />, path: '/movies' },
    { text: 'Séries', icon: <TvIcon />, path: '/series' },
    { text: 'À propos', icon: <InfoIcon />, path: '/about' }
  ];

  const drawer = (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={toggleDrawer}
    >
      <Box sx={{ width: 250, pt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: '40px', cursor: 'pointer' }} 
            onClick={() => handleNavigation('/')}
          />
        </Box>
        
        {isMobile && (
          <Box sx={{ px: 2, mb: 2 }}>
            <form onSubmit={handleSearchSubmit}>
              <TextField
                placeholder="Rechercher..."
                fullWidth
                variant="outlined"
                size="small"
                value={searchValue}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>
        )}
        
        <List>
          {menuItems.map((item) => (
            <ListItem 
              button 
              key={item.text} 
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );

  return (
    <>
      {drawer}
      <MuiAppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer} // Utiliser toggleDrawer au lieu de onMenuClick
          >
            <MenuIcon />
          </IconButton>
          
          <img 
            src={logo} 
            alt="Logo" 
            style={{ height: '40px', marginRight: '20px', cursor: 'pointer' }} 
            onClick={() => handleNavigation('/')}
          />
          
          {/* Navigation sur desktop uniquement */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button color="inherit" onClick={() => handleNavigation('/')}>Accueil</Button>
              <Button color="inherit" onClick={() => handleNavigation('/movies')}>Films</Button>
              <Button color="inherit" onClick={() => handleNavigation('/series')}>Séries</Button>
              <Button color="inherit" onClick={() => handleNavigation('/about')}>À propos</Button>
            </Box>
          )}
          
          {/* Barre flexible pour mobile */}
          {isMobile && <Box sx={{ flexGrow: 1 }} />}

          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: isMobile ? 1 : 2 
          }}>
            {/* Icône de recherche universelle */}
            <IconButton 
              color="inherit" 
              onClick={() => handleNavigation('/search')}
              aria-label="search"
            >
              <SearchIcon />
            </IconButton>
            
            {/* Bouton d'inscription */}
            <Button
              variant="contained"
              color="error"
              sx={{ 
                color: 'white',
                display: { xs: 'none', sm: 'flex' }
              }}
            >
              S'inscrire
            </Button>
            
            <IconButton color="inherit">
              <Avatar sx={{ bgcolor: 'primary.main', width: isMobile ? 32 : 40, height: isMobile ? 32 : 40 }} />
            </IconButton>
          </Box>
        </Toolbar>
      </MuiAppBar>
    </>
  );
};

export default AppBar;