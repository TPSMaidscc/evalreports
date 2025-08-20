import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  CircularProgress,
  Typography,
  Alert,
  AlertTitle,
  Button,
  Paper,
  useTheme,
  alpha,
  Fade,
  Skeleton,
} from '@mui/material';
import {
  Error as ErrorIcon,
  Refresh as RefreshIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardData } from '../hooks/useDashboardData';
import { updateURL } from '../utils/helpers';
import Header from './Header';
import SnapshotSection from './SnapshotSection';
import ConversionFunnelSection from './ConversionFunnelSection';
import WeeklyReportSection from './WeeklyReportSection';
import TransferInterventionSection from './TransferInterventionSection';
import RuleBreakingSection from './RuleBreakingSection';
import TrendlinesSection from './TrendlinesSection';
import AllChatbotsSummary from './AllChatbotsSummary';
import LLMCostAnalysis from './LLMCostAnalysis';

const Dashboard = () => {
  const theme = useTheme();
  const {
    selectedDepartment,
    setSelectedDepartment,
    selectedDate,
    setSelectedDate,
    isInitialized,
    dashboardData,
    loading,
    error,
    isLoadingData
  } = useDashboardData();
  
  // AT Filipina sub-department state
  const [selectedATFilipinaSubDept, setSelectedATFilipinaSubDept] = useState('All');
  
  // Separate state for AT Filipina sub-department data
  const [atFilipinaSubData, setAtFilipinaSubData] = useState(null);

  // Handle department change
  const handleDepartmentChange = (department) => {
    setSelectedDepartment(department);
    // Reset sub-department to 'All' when changing departments
    if (department !== 'AT Filipina') {
      setSelectedATFilipinaSubDept('All');
    }
    updateURL(department, selectedDate);
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    updateURL(selectedDepartment, date);
  };
  
  // Handle AT Filipina sub-department change
  const handleATFilipinaSubDeptChange = (subDept) => {
    setSelectedATFilipinaSubDept(subDept);
  };
  
  // Effect to fetch AT Filipina sub-department data when needed
  useEffect(() => {
    const fetchATFilipinaSubData = async () => {
      if (selectedDepartment === 'AT Filipina' && selectedATFilipinaSubDept !== 'All') {
        try {
          const { fetchTodaysSnapshot, fetchTrendlines } = await import('../services/googleSheets');
          const [snapshot, trendlines] = await Promise.all([
            fetchTodaysSnapshot('AT Filipina', selectedDate, selectedATFilipinaSubDept),
            fetchTrendlines('AT Filipina', selectedDate, selectedATFilipinaSubDept)
          ]);
          setAtFilipinaSubData({ snapshot, trendlines });
        } catch (error) {
          console.error('Error fetching AT Filipina sub-department data:', error);
          setAtFilipinaSubData(null);
        }
      } else {
        setAtFilipinaSubData(null);
      }
    };

    fetchATFilipinaSubData();
  }, [selectedDepartment, selectedDate, selectedATFilipinaSubDept]);

  // Loading state component
  const LoadingState = () => (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            background: alpha(theme.palette.background.paper, 0.8),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <DashboardIcon 
              sx={{ 
                fontSize: 48, 
                color: theme.palette.primary.main,
                mb: 3
              }} 
            />
          </motion.div>
          
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ fontWeight: 600, color: theme.palette.text.primary }}
          >
            Loading Dashboard
          </Typography>
          
          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 3 }}
          >
            Fetching analytics data...
          </Typography>
          
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress 
              size={40}
              thickness={4}
              sx={{
                color: theme.palette.primary.main,
              }}
            />
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );

  // Error state component
  const ErrorState = () => (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.02)} 0%, ${alpha(theme.palette.warning.main, 0.02)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            background: alpha(theme.palette.background.paper, 0.9),
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.error.main, 0.2)}`,
            textAlign: 'center',
            maxWidth: 500,
          }}
        >
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ErrorIcon 
              sx={{ 
                fontSize: 64, 
                color: theme.palette.error.main,
                mb: 3
              }} 
            />
          </motion.div>
          
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700, 
              color: theme.palette.error.main,
              mb: 2 
            }}
          >
            Oops! Something went wrong
          </Typography>
          
          <Alert 
            severity="error" 
            variant="outlined"
            sx={{ 
              mb: 4,
              borderRadius: 2,
              background: alpha(theme.palette.error.main, 0.05),
            }}
          >
            <AlertTitle sx={{ fontWeight: 600 }}>Error Details</AlertTitle>
            {error}
          </Alert>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                },
              }}
            >
              Try Again
            </Button>
          </motion.div>
        </Paper>
      </motion.div>
    </Box>
  );

  // Content loading skeleton
  const ContentSkeleton = () => (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: { xs: 2, md: 4 },
        px: { xs: 1, sm: 2, md: 3 },
      }}
    >
      {[...Array(6)].map((_, index) => (
        <Skeleton
          key={index}
          variant="rectangular"
          height={{ xs: 150, md: 200 }}
          sx={{
            mb: { xs: 2, md: 3 },
            borderRadius: 2,
            bgcolor: alpha(theme.palette.primary.main, 0.05),
          }}
        />
      ))}
    </Container>
  );

  // If loading or not initialized, show loading state
  if (loading || !isInitialized) {
    return <LoadingState />;
  }

  // If error, show error state
  if (error) {
    return <ErrorState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ width: '100%' }}
    >
      {/* Header */}
      <Header 
        selectedDepartment={selectedDepartment}
        selectedDate={selectedDate}
        onDepartmentChange={handleDepartmentChange}
        onDateChange={handleDateChange}
      />

      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.01)} 50%, ${alpha(theme.palette.background.default, 1)} 100%)`,
        }}
      >

        <Container 
          maxWidth="xl" 
          sx={{ 
            py: { xs: 2, md: 4 },
            px: { xs: 1, sm: 2, md: 3 },
          }}
        >
          <AnimatePresence mode="wait">
            {isLoadingData ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ContentSkeleton />
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
              >
                {/* All Chatbots Summary - Special View */}
                {selectedDepartment === 'All Chatbots Summary' ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{ marginBottom: '24px' }}
                  >
                    <AllChatbotsSummary
                      selectedDate={selectedDate}
                    />
                  </motion.div>
                ) : selectedDepartment === 'LLM Cost Analysis' ? (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    style={{ marginBottom: '24px' }}
                  >
                    <LLMCostAnalysis
                      selectedDate={selectedDate}
                    />
                  </motion.div>
                ) : (
                  <>
                    {/* Section 2: Today's Snapshot (includes definitions) */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      style={{ marginBottom: '24px' }}
                    >
                                          <SnapshotSection 
                      selectedDepartment={selectedDepartment}
                      selectedDate={selectedDate}
                      dashboardData={atFilipinaSubData || dashboardData}
                      selectedATFilipinaSubDept={selectedATFilipinaSubDept}
                      onATFilipinaSubDeptChange={handleATFilipinaSubDeptChange}
                    />
                    </motion.div>

                {/* Section 4: Conversion Funnel */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{ marginBottom: '24px' }}
                >
                  <ConversionFunnelSection 
                    selectedDepartment={selectedDepartment}
                    selectedDate={selectedDate}
                    dashboardData={dashboardData}
                  />
                </motion.div>

                {/* Section 5: Weekly Report */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  style={{ marginBottom: '24px' }}
                >
                  <WeeklyReportSection 
                    selectedDepartment={selectedDepartment}
                    selectedDate={selectedDate}
                    dashboardData={dashboardData}
                  />
                </motion.div>

                {/* Transfer Intervention */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  style={{ marginBottom: '24px' }}
                >
                  <TransferInterventionSection 
                    selectedDepartment={selectedDepartment}
                    selectedDate={selectedDate}
                    dashboardData={dashboardData}
                  />
                </motion.div>

                {/* Rule breaking - HIDDEN */}
                {/* <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{ marginBottom: '24px' }}
                >
                  <RuleBreakingSection 
                    dashboardData={dashboardData} 
                    selectedDepartment={selectedDepartment}
                  />
                </motion.div> */}

                    {/* Trendlines */}
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                      style={{ marginBottom: '24px' }}
                    >
                                          <TrendlinesSection 
                      selectedDepartment={selectedDepartment}
                      dashboardData={atFilipinaSubData || dashboardData}
                    />
                    </motion.div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </Box>
    </motion.div>
  );
};

export default Dashboard; 