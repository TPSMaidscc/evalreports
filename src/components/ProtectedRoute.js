import React from 'react';
import { Box, CircularProgress, Typography, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import GoogleSignIn from './GoogleSignIn';
import { AUTH_ENABLED } from '../utils/constants';

const LoadingScreen = () => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
          }}
        />
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ fontWeight: 500 }}
        >
          Loading Dashboard...
        </Typography>
      </motion.div>
    </Box>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading, signIn } = useAuth();

  // If authentication is disabled, render children directly
  if (!AUTH_ENABLED) {
    return children;
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Show sign-in if not authenticated
  if (!isAuthenticated) {
    return (
      <GoogleSignIn
        onSignInSuccess={signIn}
        onSignInError={(error) => {
          console.error('Sign-in error:', error);
        }}
      />
    );
  }

  // Render protected content if authenticated
  return children;
};

export default ProtectedRoute; 