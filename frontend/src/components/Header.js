import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Home, User, LogIn } from 'lucide-react';
import styled from 'styled-components';

import { useAuth } from '../context/AuthContext';

const HeaderContainer = styled(motion.header)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
  align-items: center;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }

  ${props => props.active && `
    color: white;
    background: rgba(255, 255, 255, 0.2);
  `}
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;
  font-size: 0.9rem;
`;

const StatusIndicator = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38a169;
  animation: pulse 2s infinite;

  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  return (
    <HeaderContainer
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Nav>
        <Logo to="/">
          <Shield size={28} />
          Post-Quantum FIDO2
        </Logo>

        <NavLinks>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" active={location.pathname === '/dashboard'}>
                <Home size={18} />
                Dashboard
              </NavLink>
              <UserInfo>
                <StatusIndicator />
                <span>Welcome, {user?.displayName || user?.username}</span>
              </UserInfo>
            </>
          ) : (
            <>
              <NavLink to="/login" active={location.pathname === '/login'}>
                <LogIn size={18} />
                Login
              </NavLink>
              <NavLink to="/register" active={location.pathname === '/register'}>
                <User size={18} />
                Register
              </NavLink>
            </>
          )}
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
};

export default Header;
