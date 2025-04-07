import React, { useState } from 'react';
import { Box } from '@mui/material';
import AppBar from './AppBar';
import SideBar from './SideBar';
import CenterScreen from './CenterScreen';

const UI: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppBar 
        onMenuClick={toggleSidebar} 
        onSearch={(query) => {
          console.log("Search query:", query);
          // Implémentez la logique de recherche ici ou utilisez un gestionnaire externe
        }} 
      />
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SideBar open={isSidebarOpen} onClose={toggleSidebar} />
        <CenterScreen />
      </Box>
    </Box>
  );
};

export default UI;