import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AppBar from './AppBar';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const handleMenuClick = () => {
    // Logique de menu si nécessaire
  };

  const handleSearch = (query: string) => {
    navigate(`/search/${encodeURIComponent(query)}`);
  };

  return (
    <>
      <AppBar onMenuClick={handleMenuClick} onSearch={handleSearch} />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;