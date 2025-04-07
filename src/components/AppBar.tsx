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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import logo from '../assets/FG.png';

interface AppBarProps {
  onMenuClick: () => void;
  onSearch: (query: string) => void;
}

const AppBar: React.FC<AppBarProps> = ({ onMenuClick, onSearch }) => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
      navigate('/search');
    }
  };

  return (
    <MuiAppBar position="static">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <img 
          src={logo} 
          alt="Logo" 
          style={{ height: '40px', marginRight: '20px', cursor: 'pointer' }} 
          onClick={() => handleNavigation('/')}
        />
        
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => handleNavigation('/')}>Accueil</Button>
          <Button color="inherit" onClick={() => handleNavigation('/movies')}>Films</Button>
          <Button color="inherit" onClick={() => handleNavigation('/series')}>Séries</Button>
          <Button color="inherit" onClick={() => handleNavigation('/about')}>À propos</Button>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <form onSubmit={handleSearchSubmit}>
            <TextField
              placeholder="Que recherchez-vous?"
              variant="outlined"
              size="small"
              value={searchValue}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <IconButton type="submit" edge="start" size="small">
                    <SearchIcon sx={{ color: 'white' }} />
                  </IconButton>
                ),
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                },
              }}
            />
          </form>
          <Button
            variant="contained"
            color="error"
            sx={{ color: 'white' }}
          >
            S'inscrire
          </Button>
          <IconButton color="inherit">
            <Avatar sx={{ bgcolor: 'primary.main' }} />
          </IconButton>
        </Box>
      </Toolbar>
    </MuiAppBar>
  );
};

export default AppBar;