import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Button,
  Container,
  Paper,
  CircularProgress,
  Chip,
  useTheme,
  alpha,
  Avatar,
  Menu,
  IconButton,
  Divider,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Analytics as AnalyticsIcon,
  CalendarToday as CalendarIcon,
  Business as BusinessIcon,
  TrendingUp as TrendingUpIcon,
  SupportAgent as SupportAgentIcon,
  LocalHospital as LocalHospitalIcon,
  HomeWork as HomeWorkIcon,
  CleaningServices as CleaningServicesIcon,
  Star as StarIcon,
  AccountCircle as AccountCircleIcon,
  Logout as LogoutIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { departments, AUTH_ENABLED } from '../utils/constants';
import { getYesterdayDate, getCurrentDate, getDepartmentsForDate } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ 
  selectedDepartment, 
  selectedDate,
  onDepartmentChange, 
  onDateChange
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const theme = useTheme();
  const { user, signOut } = useAuth();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    signOut();
    handleProfileClose();
  };

  // Get department-specific icon
  const getDepartmentIcon = (department) => {
    if (department.includes('Sales')) {
      return TrendingUpIcon; // Sales departments
    } else if (department.includes('Resolvers')) {
      return SupportAgentIcon; // Resolver departments
    } else if (department === 'Delighters') {
      return StarIcon; // Delighters (special customer service)
    } else if (department === 'Doctors') {
      return LocalHospitalIcon; // Medical department
    } else if (department.includes('AT') || department.includes('Maids')) {
      return CleaningServicesIcon; // Domestic service departments
    } else if (department === 'LLM Cost Analysis') {
      return AttachMoneyIcon; // LLM Cost Analysis
    } else {
      return BusinessIcon; // Default fallback
    }
  };

  // Export to PDF function (keeping original logic)
  const exportToPDF = async () => {
    setIsExporting(true);
    
    try {
      // Create a custom first page element
      const createFirstPage = () => {
        const firstPageDiv = document.createElement('div');
        firstPageDiv.id = 'pdf-first-page';
        firstPageDiv.style.cssText = `
          width: 1200px;
          height: 800px;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          font-family: 'Helvetica', sans-serif;
          position: relative;
          overflow: hidden;
        `;
        
        firstPageDiv.innerHTML = `
          <div style="text-align: center; z-index: 1; max-width: 800px; padding: 40px;">
            <div style="background: rgba(255,255,255,0.15); border-radius: 20px; padding: 60px; border: 2px solid rgba(255,255,255,0.3); box-shadow: 0 8px 32px rgba(0,0,0,0.1);">
              <h1 style="font-size: 48px; font-weight: 700; margin: 0 0 20px 0; letter-spacing: -1px; text-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                ${selectedDepartment}
              </h1>
              <div style="width: 100px; height: 4px; background: rgba(255,255,255,0.9); margin: 0 auto 30px auto; border-radius: 2px;"></div>
              <p style="font-size: 24px; margin: 0 0 30px 0; font-weight: 300; opacity: 0.95;">
                Dashboard Report
              </p>
              <p style="font-size: 20px; margin: 0; font-weight: 400; opacity: 0.85;">
                ${getCurrentDate(selectedDate)}
              </p>
            </div>
          </div>
          <div style="position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%); text-align: center; z-index: 1;">
            <p style="font-size: 14px; opacity: 0.8; margin: 0;">Chatbot Evals Dashboard</p>
          </div>
        `;
        
        document.body.appendChild(firstPageDiv);
        return firstPageDiv;
      };

      // Create a custom snapshot page wrapper
      const createSnapshotWrapper = () => {
        const originalSnapshot = document.getElementById('todays-snapshot');
        if (!originalSnapshot) return null;
        
        const wrapperDiv = document.createElement('div');
        wrapperDiv.id = 'pdf-snapshot-wrapper';
        wrapperDiv.style.cssText = `
          width: 1200px;
          min-height: 800px;
          background: white;
          padding: 40px;
          font-family: 'Helvetica', sans-serif;
        `;
        
        // Clone the original snapshot content
        const snapshotClone = originalSnapshot.cloneNode(true);
        snapshotClone.id = 'pdf-snapshot-clone';
        snapshotClone.style.cssText = `
          width: 100%;
          margin: 0;
          padding: 0;
        `;
        
        wrapperDiv.appendChild(snapshotClone);
        document.body.appendChild(wrapperDiv);
        return wrapperDiv;
      };

      // Start with landscape orientation for all pages
      const pdf = new jsPDF('l', 'mm', 'a4'); // landscape
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      
      let pageCount = 0;
      
      // Helper function to add a new page (always landscape)
      const addNewPage = () => {
        if (pageCount > 0) {
          pdf.addPage('a4', 'landscape');
        }
        pageCount++;
      };
      
      // Helper function to capture element and add to PDF
      const captureAndAddElement = async (elementId, title = '', options = {}) => {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        try {
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            ...options
          });
          
          const imgData = canvas.toDataURL('image/png');
          
          addNewPage();
          const imgWidth = pageWidth - 2 * margin;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          if (title) {
            pdf.setFontSize(16);
            pdf.setFont('helvetica', 'bold');
            pdf.text(title, margin, margin + 10);
          }
          
          const yPosition = title ? margin + 20 : margin;
          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, Math.min(imgHeight, pageHeight - yPosition - margin));
          
        } catch (error) {
          console.error(`Error capturing ${elementId}:`, error);
        }
      };

      // Helper function to capture two elements side by side
      const captureTwoElementsSideBySide = async (elementId1, elementId2, title = '') => {
        const element1 = document.getElementById(elementId1);
        const element2 = document.getElementById(elementId2);
        
        if (!element1 && !element2) return;
        
        addNewPage();
        
        if (title) {
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.text(title, margin, margin + 10);
        }
        
        const startY = title ? margin + 20 : margin;
        const availableWidth = pageWidth - 2 * margin;
        const chartWidth = (availableWidth - 10) / 2; // 10px gap between charts
        
        // Capture first element
        if (element1) {
          try {
            const canvas1 = await html2canvas(element1, {
              scale: 1.5,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
            });
            
            const imgData1 = canvas1.toDataURL('image/png');
            const imgHeight1 = (canvas1.height * chartWidth) / canvas1.width;
            
            pdf.addImage(imgData1, 'PNG', margin, startY, chartWidth, Math.min(imgHeight1, pageHeight - startY - margin));
          } catch (error) {
            console.error(`Error capturing ${elementId1}:`, error);
          }
        }
        
        // Capture second element
        if (element2) {
          try {
            const canvas2 = await html2canvas(element2, {
              scale: 1.5,
              useCORS: true,
              allowTaint: true,
              backgroundColor: '#ffffff'
            });
            
            const imgData2 = canvas2.toDataURL('image/png');
            const imgHeight2 = (canvas2.height * chartWidth) / canvas2.width;
            
            pdf.addImage(imgData2, 'PNG', margin + chartWidth + 10, startY, chartWidth, Math.min(imgHeight2, pageHeight - startY - margin));
          } catch (error) {
            console.error(`Error capturing ${elementId2}:`, error);
          }
        }
      };
      
      // Page 1: Custom first page (landscape)
      const firstPageElement = createFirstPage();
      await captureAndAddElement('pdf-first-page', '');
      
      // Page 2: Today's snapshot (landscape)
      const snapshotWrapper = createSnapshotWrapper();
      if (snapshotWrapper) {
        await captureAndAddElement('pdf-snapshot-wrapper', '');
      }
      
      // Clean up custom elements
      if (firstPageElement) document.body.removeChild(firstPageElement);
      if (snapshotWrapper) document.body.removeChild(snapshotWrapper);
      
      // Page 3: Conversion funnel (landscape - if enabled and not excluded departments)
      if (!['CC Resolvers', 'MV Resolvers', 'Delighters', 'Doctors'].includes(selectedDepartment)) {
        await captureAndAddElement('conversion-funnel', 'Conversion Funnel');
      }
      
      // Page 4: Weekly Report (landscape - if enabled and not in excluded departments)
      if (!['CC Resolvers', 'MV Resolvers', 'Delighters', 'Doctors'].includes(selectedDepartment)) {
        await captureAndAddElement('weekly-report', 'Weekly Report');
      }
      
      // Page 5: Loss of Interest (only for AT Filipina)
      if (selectedDepartment === 'AT Filipina') {
        await captureAndAddElement('loss-of-interest', 'Loss of Interest');
      }
      
      // Trendlines (stacked subplots - one per page) - landscape
      const trendlineConfigs = [
        { id: 'cvr-subplot', title: '7D cohort - 3DW %' },
        { id: 'cost-subplot', title: 'Cost Analysis' },
        { id: 'repetition-subplot', title: 'Chats with Repetition' },
        { id: 'delays-subplot', title: 'Average Delays & 4-min Messages' },
        { id: 'sentiment-subplot', title: 'Sentiment Analysis' },
        { id: 'tools-subplot', title: 'Tools Performance' }
      ];
      
      // Add each subplot on its own page (since they're stacked and take more vertical space)
      for (let i = 0; i < trendlineConfigs.length; i++) {
        const trendline = trendlineConfigs[i];
        await captureAndAddElement(trendline.id, trendline.title);
      }
      
      // Rules and policy performance
      await captureAndAddElement('rules-policy-subplot', 'Rules & Policy Performance');
      
      // Rule breaking
      await captureAndAddElement('rule-breaking', 'Rule breaking');
      
      // Create and save PDF
      pdf.save(`${selectedDepartment}_${selectedDate}_dashboard.pdf`);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    // Prevent selection of July 12, 2025
    if (date === '2025-07-12') {
      alert('July 12, 2025 is not available for selection.');
      return;
    }
    
    // Check if current department is valid for the new date
    const validDepartments = getDepartmentsForDate(date);
    if (!validDepartments.includes(selectedDepartment)) {
      // If current department is not valid, keep the current selection or use a default
      // (getDepartmentsForDate now always returns the same list, so this should rarely happen)
    }
    
    onDateChange(date);
  };

  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          width: '100%',
          left: 0,
          right: 0,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar 
            sx={{ 
              py: 2, 
              minHeight: { xs: 'auto', md: '80px !important' },
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'stretch', md: 'center' },
              gap: { xs: 2, md: 0 },
            }}
          >
            {/* Logo and Title Section */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              flexGrow: 1,
              justifyContent: { xs: 'center', md: 'flex-start' },
              mb: { xs: 1, md: 0 },
            }}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    borderRadius: 3,
                    p: 1.5,
                    mr: { xs: 2, md: 3 },
                    boxShadow: theme.shadows[3],
                  }}
                >
                  <AnalyticsIcon sx={{ color: 'white', fontSize: { xs: 24, md: 28 } }} />
                </Box>
              </motion.div>
              
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{ 
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '2rem' },
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Chatbot Evals
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500, 
                    mt: -0.5,
                    fontSize: { xs: '0.75rem', md: '0.875rem' },
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Advanced Analytics Dashboard
                </Typography>
              </Box>
            </Box>

            {/* Controls Section */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: { xs: 1, sm: 2, md: 3 },
              flexDirection: { xs: 'column', sm: 'row' },
              width: { xs: '100%', md: 'auto' },
              justifyContent: { xs: 'center', sm: 'flex-end' },
            }}>
              {/* Department Selector */}
              <Paper
                elevation={0}
                sx={{
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <FormControl size="small" sx={{ minWidth: { xs: '100%', sm: 220, md: 280 } }}>
                  <Select
                    value={selectedDepartment}
                    onChange={(e) => onDepartmentChange(e.target.value)}
                    sx={{
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                      '.MuiSelect-select': {
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', md: '0.95rem' },
                        py: { xs: 1, md: 1.25 },
                      },
                    }}
                  >
                    {getDepartmentsForDate(selectedDate).map(dept => {
                      const DeptIcon = getDepartmentIcon(dept);
                      return (
                        <MenuItem key={dept} value={dept}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DeptIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                            <Typography variant="body2" fontWeight={500}>
                              {dept}
                            </Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Paper>



              {/* Date Picker */}
              <Paper
                elevation={0}
                sx={{
                  background: alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  borderRadius: 2,
                  overflow: 'hidden',
                  width: { xs: '100%', sm: 'auto' },
                }}
              >
                <TextField
                  type="date"
                  size="small"
                  value={selectedDate}
                  inputProps={{
                    min: "2025-07-08",
                    max: getYesterdayDate(),
                  }}
                  onChange={(e) => handleDateChange(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <CalendarIcon sx={{ color: 'text.secondary', mr: 1, fontSize: { xs: 18, md: 20 } }} />
                    ),
                  }}
                  sx={{
                    width: { xs: '100%', sm: '180px', md: '220px' },
                    '.MuiOutlinedInput-root': {
                      '.MuiOutlinedInput-notchedOutline': { border: 0 },
                      py: { xs: 0, md: 0.25 },
                    },
                    '.MuiInputBase-input': {
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', md: '0.95rem' },
                      py: { xs: 1, md: 1.25 },
                    },
                  }}
                />
              </Paper>

              {/* Current Date Chip */}
              <Chip
                label={getCurrentDate(selectedDate)}
                variant="outlined"
                sx={{
                  borderColor: alpha(theme.palette.primary.main, 0.3),
                  color: theme.palette.primary.main,
                  fontWeight: 500,
                  background: alpha(theme.palette.primary.main, 0.05),
                  display: { xs: 'none', md: 'inline-flex' },
                  fontSize: { md: '0.875rem' },
                  px: { md: 2 },
                  py: { md: 1.5 },
                  minHeight: { md: '36px' },
                }}
              />
            </Box>

            {/* User Profile - Only show when authentication is enabled */}
            {AUTH_ENABLED && (
              <Box sx={{ ml: { xs: 0, sm: 'auto' }, display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={handleProfileClick}
                size="small"
                sx={{
                  padding: 1,
                  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Avatar
                  src={user?.picture}
                  alt={user?.name}
                  sx={{ 
                    width: 32, 
                    height: 32,
                    fontSize: '0.875rem',
                    fontWeight: 600,
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase() || <AccountCircleIcon />}
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileClose}
                onClick={handleProfileClose}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    minWidth: 200,
                    '& .MuiAvatar-root': {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    '&::before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1.5, borderBottom: `1px solid ${theme.palette.divider}` }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    {user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <MenuItem onClick={handleLogout} sx={{ py: 1.5 }}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Sign out</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
            )}

            {/* Export Button - Separate container for proper right alignment */}
            <Box sx={{ ml: AUTH_ENABLED ? 2 : { xs: 0, sm: 'auto' }, mt: { xs: 2, sm: 0 }, width: { xs: '100%', sm: 'auto' } }}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="contained"
                  onClick={exportToPDF}
                  disabled={isExporting}
                  startIcon={
                    isExporting ? (
                      <CircularProgress size={16} color="inherit" />
                    ) : (
                      <DownloadIcon sx={{ fontSize: { xs: 16, md: 18 } }} />
                    )
                  }
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    px: { xs: 2, md: 4 },
                    py: { xs: 1.2, md: 1.5 },
                    fontWeight: 600,
                    textTransform: 'none',
                    boxShadow: theme.shadows[4],
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: '140px', md: '160px' },
                    fontSize: { xs: '0.75rem', md: '0.9rem' },
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                      boxShadow: theme.shadows[8],
                    },
                    '&:disabled': {
                      background: alpha(theme.palette.action.disabled, 0.12),
                      color: alpha(theme.palette.action.disabled, 0.38),
                    },
                  }}
                >
                  {isExporting ? 'Exporting...' : 'Export PDF'}
                </Button>
              </motion.div>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </motion.div>
  );
};

export default Header; 