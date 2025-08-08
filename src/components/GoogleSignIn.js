import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { motion } from 'framer-motion';
import { APPROVED_EMAILS } from '../utils/constants';

const GoogleSignIn = ({ onSignInSuccess, onSignInError }) => {
  const theme = useTheme();
  const [error, setError] = useState('');

  useEffect(() => {
    // Load Google Identity Services
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait a bit for DOM to be ready, then initialize
      setTimeout(initializeGoogleSignIn, 100);
    };
    document.head.appendChild(script);

    return () => {
      // Clean up script on unmount
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && process.env.REACT_APP_GOOGLE_CLIENT_ID) {
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: false,
          use_fedcm_for_prompt: false, // Disable FedCM to avoid AbortError
        });
        
        // Also render the sign-in button for better reliability
        const buttonElement = document.getElementById('google-signin-button');
        if (buttonElement) {
          window.google.accounts.id.renderButton(
            buttonElement,
            {
              theme: 'outline',
              size: 'large',
              width: '100%',
            }
          );
        }
      } catch (error) {
        console.error('Failed to initialize Google Sign-In:', error);
        setError('Failed to initialize Google Sign-In. Please refresh the page.');
      }
    } else {
      setError('Google Client ID not configured. Please check your environment variables.');
    }
  };

  const handleCredentialResponse = async (response) => {
    setError('');

    try {
      // Decode the JWT token to get user info
      const decoded = JSON.parse(atob(response.credential.split('.')[1]));
      const { email, name, picture } = decoded;

      // Validate email - allow @maids.cc domain or specific approved emails
      const domain = email.split('@')[1];
      
      if (domain !== 'maids.cc' && !APPROVED_EMAILS.includes(email)) {
        setError('You are not eligible to enter');
        return;
      }

      // Successful authentication
      const userInfo = {
        email,
        name,
        picture,
        token: response.credential,
      };

      onSignInSuccess(userInfo);
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Sign-in failed. Please try again.');
      onSignInError(err);
    }
  };



  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
        p: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Paper
          elevation={8}
          sx={{
            p: { xs: 4, md: 6 },
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Logo/Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: theme.palette.primary.main,
                mb: 3,
              }}
            >
              Reports Dashboard
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, textAlign: 'left' }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          {/* Google-rendered Sign-In Button */}
          <Box sx={{ mt: 2 }}>
            <div id="google-signin-button" style={{ display: 'flex', justifyContent: 'center' }}></div>
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
};

export default GoogleSignIn; 