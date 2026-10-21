import React from 'react';

// MainLayout (sidebar + navbar)
const MainLayout = ({ children }) => {
  return (
    <div className="main-layout">
      {/* Sidebar & Navbar */}
      <main>{children}</main>
    </div>
  );
};

export default MainLayout;
