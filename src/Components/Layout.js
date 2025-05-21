import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showBackIcon = location.pathname !== '/dashboard';
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleBack = () => navigate(-1);
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const headerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '14vh',
    backgroundColor: '#4a90e2',
    color: 'white',
    fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 20px',
    borderBottom: '2px solid #e0e0e0',
    borderRadius: '0 0 16px 16px',
    boxSizing: 'border-box',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  };

  const leftStyle = {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    marginLeft: '50px',
  };

  const centerStyle = {
    flex: '1 1 auto',
    textAlign: 'center',
  };

  const rightStyle = {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    marginRight: '60px',
  };

  const iconStyle = {
    fontSize: '1.6rem',
    cursor: 'pointer',
    color: '#f2f2f2',
    transition: 'color 0.3s ease',
  };

  const companyNameStyle = {
    fontSize: '1.6rem',
    fontWeight: '700',
    lineHeight: '1.2',
  };

  const companyPhoneStyle = {
    fontSize: '1.1rem',
    fontWeight: '400',
    marginTop: '4px',
  };

  const logoutButtonStyle = {
    padding: '10px 20px',
    backgroundColor: isLogoutHovered ? '#d32f2f' : '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  };

  return (
    <>
      <header style={headerStyle}>
        {/* Left: Back Arrow */}
        <div style={leftStyle}>
          {showBackIcon && (
            <FaArrowLeft onClick={handleBack} style={iconStyle} title="Go Back" />
          )}
        </div>

        {/* Center: Company Info */}
        <div style={centerStyle}>
          <div style={companyNameStyle}>RAKESH GLASS & PLYWOOD</div>
          <div style={companyPhoneStyle}>📞 99521 79391</div>
        </div>

        {/* Right: Logout Button */}
        <div style={rightStyle}>
          <button
            onClick={handleLogout}
            onMouseEnter={() => setIsLogoutHovered(true)}
            onMouseLeave={() => setIsLogoutHovered(false)}
            style={logoutButtonStyle}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ marginTop: '12vh', padding: '20px' }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
