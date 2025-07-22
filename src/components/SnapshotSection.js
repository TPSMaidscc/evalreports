import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Tooltip,
  IconButton,
  Button,
  Chip,
  useTheme,
  alpha,
  Stack,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
} from '@mui/material';
import {
  Info as InfoIcon,
  Camera as CameraIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Code as CodeIcon,
  Assessment as AssessmentIcon,
  Build as BuildIcon,
  Policy as PolicyIcon,
  DateRange as DateIcon,
  Business as BusinessIcon,
  ExpandMore as ExpandMoreIcon,
  MenuBook as MenuBookIcon,
  Description as DescriptionIcon,
  Functions as FunctionsIcon,
  TrendingUp as TrendingUpIcon,
  SupportAgent as SupportAgentIcon,
  LocalHospital as LocalHospitalIcon,
  HomeWork as HomeWorkIcon,
  CleaningServices as CleaningServicesIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { codeBasedEvalTooltips } from '../utils/constants';
import { navigateToRawDataSheet, navigateToBotHandledSheet, navigateToRepetitionSheet, navigateToUnresponsiveChatsSheet } from '../services/googleSheets';
import SnapshotValueRenderer from './SnapshotValueRenderer';
import { getCurrentDate } from '../utils/helpers';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
  borderRadius: '16px !important',
  overflow: 'hidden',
  backgroundColor: theme.palette.background.paper,
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
    boxShadow: theme.shadows[2],
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  minHeight: 80,
  '&.Mui-expanded': {
    minHeight: 80,
  },
  '& .MuiAccordionSummary-content': {
    margin: theme.spacing(1, 0),
    '&.Mui-expanded': {
      margin: theme.spacing(1, 0),
    },
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  fontSize: '0.875rem',
  borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.primary.main, 0.05),
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  color: theme.palette.primary.main,
  borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

// Component to display mathematical formulas
const FormulaDisplay = ({ formula }) => {
  const theme = useTheme();
  
  // Transform text-based formulas into mathematical display
  const formatFormula = (text) => {
    if (!text) return text;
    
    // Replace division symbols and format fractions
    let formatted = text
      .replace(/÷/g, '/')
      .replace(/#/g, 'Number')
      .replace(/</g, '<')
      .replace(/>/g, '>')
      .replace(/=/g, '=');
    
    // Check if it's a division formula (contains '/')
    if (formatted.includes('/')) {
      const parts = formatted.split('/');
      if (parts.length === 2) {
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.75rem',
                textAlign: 'center',
                borderBottom: `1px solid ${theme.palette.text.secondary}`,
                pb: 0.5,
                mb: 0.5,
                minWidth: 'max-content',
              }}
            >
              {parts[0].trim()}
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                fontSize: '0.75rem',
                textAlign: 'center',
              }}
            >
              {parts[1].trim()}
            </Typography>
          </Box>
        );
      }
    }
    
    // For non-fraction formulas, just return formatted text
    return (
      <Typography 
        variant="body2" 
        sx={{ 
          fontSize: '0.75rem',
          fontStyle: 'italic',
        }}
      >
        {formatted}
      </Typography>
    );
  };

  return (
    <Box
      sx={{
        background: alpha(theme.palette.grey[100], 0.5),
        border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
        borderRadius: 2,
        p: 1.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 60,
      }}
    >
      {formatFormula(formula)}
    </Box>
  );
};

const SnapshotSection = ({ selectedDepartment, selectedDate, dashboardData }) => {
  const theme = useTheme();
  const [definitionsExpanded, setDefinitionsExpanded] = React.useState(false);

  const handleDefinitionsChange = (event, isExpanded) => {
    setDefinitionsExpanded(isExpanded);
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
    } else {
      return BusinessIcon; // Default fallback
    }
  };

  const DepartmentIcon = getDepartmentIcon(selectedDepartment);

  // Handle click on Total Number of Chats label to navigate to raw data
  const handleTotalChatsClick = async () => {
    console.log('Total Chats clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToRawDataSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to raw data sheet:', error);
      alert('Error opening raw data sheet. Please try again.');
    }
  };

  // Handle click on Fully handled by bot % label to navigate to bot handled sheet
  const handleBotHandledClick = async () => {
    console.log('Bot Handled clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToBotHandledSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to bot handled sheet:', error);
      alert('Error opening bot handled sheet. Please try again.');
    }
  };

  // Handle click on Verbatim messages repeated % (Avg) label to navigate to repetition sheet
  const handleRepetitionClick = async () => {
    console.log('Repetition clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToRepetitionSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to repetition sheet:', error);
      alert('Error opening repetition sheet. Please try again.');
    }
  };

  // Handle click on Unresponsive Chats (%) label to navigate to unresponsive chats sheet
  const handleUnresponsiveChatsClick = async () => {
    console.log('Unresponsive Chats clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToUnresponsiveChatsSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to unresponsive chats sheet:', error);
      alert('Error opening unresponsive chats sheet. Please try again.');
    }
  };


  // Helper component for metric rows with tooltips
  const MetricRow = ({ 
    label, 
    fieldName, 
    clickHandler = null, 
    showTooltip = true,
    isClickable = false 
  }) => {
    const hasTooltip = showTooltip && codeBasedEvalTooltips[label];
    
    const LabelComponent = ({ children }) => {
      if (isClickable && clickHandler) {
        return (
          <Button
            onClick={clickHandler}
            variant="text"
            sx={{
              justifyContent: 'flex-start',
              textAlign: 'left',
              textTransform: 'none',
              p: 0,
              minWidth: 'auto',
              color: theme.palette.primary.main,
              fontWeight: 400,
              fontSize: '0.875rem',
              '&:hover': {
                backgroundColor: 'transparent',
                textDecoration: 'underline',
              },
            }}
            title={`Click to open ${label.toLowerCase()} data sheet`}
          >
            {children}
          </Button>
        );
      }
      return (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'left' }}>
          {children}
        </Typography>
      );
    };

    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          minHeight: 32,
          py: 0.5,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 2 }}>
          <LabelComponent>
            {label}
          </LabelComponent>
          {hasTooltip && (
            <Tooltip 
              title={codeBasedEvalTooltips[label]}
              placement="top"
              arrow
              sx={{ ml: 1 }}
            >
              <IconButton 
                size="small" 
                sx={{ 
                  p: 0,
                  width: 16,
                  height: 16,
                  ml: 0.5,
                }}
              >
                <InfoIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ textAlign: 'right', maxWidth: '60%' }}>
          <SnapshotValueRenderer fieldName={fieldName} dashboardData={dashboardData} />
        </Box>
      </Box>
    );
  };

  // Special MetricRow for "Reason for using the model" with value underneath
  const ReasonMetricRow = ({ label, fieldName }) => {
    const hasTooltip = codeBasedEvalTooltips[label];
    
    return (
      <Box sx={{ py: 0.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {label}
          </Typography>
          {hasTooltip && (
            <Tooltip 
              title={codeBasedEvalTooltips[label]}
              placement="top"
              arrow
              sx={{ ml: 1 }}
            >
              <IconButton 
                size="small" 
                sx={{ 
                  p: 0,
                  width: 16,
                  height: 16,
                  ml: 0.5,
                }}
              >
                <InfoIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
              </IconButton>
            </Tooltip>
          )}
        </Box>
        <Box sx={{ pl: 2 }}>
          <SnapshotValueRenderer fieldName={fieldName} dashboardData={dashboardData} />
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Section 1: Department Name and Date */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: { xs: 3, md: 4 },
            backgroundColor: theme.palette.background.paper,
            border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <DepartmentIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 32 }} />
            <Typography 
              variant="h4" 
              component="h2"
              sx={{ 
                fontWeight: 700,
                color: theme.palette.text.primary,
              }}
            >
              {selectedDepartment}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DateIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              {getCurrentDate(selectedDate)}
            </Typography>
          </Box>
        </Paper>
      </motion.div>

      {/* Definitions Section */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Box sx={{ mb: 4 }}>
          <StyledAccordion expanded={definitionsExpanded} onChange={handleDefinitionsChange}>
            <StyledAccordionSummary
              expandIcon={
                <motion.div
                  animate={{ rotate: definitionsExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ExpandMoreIcon sx={{ color: theme.palette.primary.main, fontSize: 28 }} />
                </motion.div>
              }
              aria-controls="definitions-content"
              id="definitions-header"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      backgroundColor: theme.palette.primary.main,
                      mr: 3,
                      boxShadow: theme.shadows[2],
                    }}
                  >
                    <MenuBookIcon sx={{ color: 'white', fontSize: 24 }} />
                  </Box>
                </motion.div>
                
                <Box sx={{ flex: 1 }}>
                  <Typography 
                    variant="h5" 
                    component="h2"
                    sx={{ 
                      fontWeight: 700,
                      color: 'text.primary',
                      mb: 0.5,
                    }}
                  >
                    Definitions & Metrics
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {definitionsExpanded ? 'Click to collapse' : 'Click to view detailed metric definitions and formulas'}
                  </Typography>
                </Box>

                <Chip
                  label={`${dashboardData.definitions?.length || 0} metrics`}
                  variant="outlined"
                  sx={{
                    borderColor: alpha(theme.palette.primary.main, 0.3),
                    color: theme.palette.primary.main,
                    fontWeight: 500,
                    background: alpha(theme.palette.primary.main, 0.05),
                  }}
                />
              </Box>
            </StyledAccordionSummary>
            
            <AccordionDetails sx={{ p: 0 }}>
              <AnimatePresence>
                {definitionsExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <TableContainer 
                      component={Paper} 
                      elevation={0}
                      sx={{ 
                        background: 'transparent',
                        maxHeight: 600,
                      }}
                    >
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <StyledTableHeadCell sx={{ width: '25%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <MenuBookIcon sx={{ mr: 1, fontSize: 16 }} />
                                Metric
                              </Box>
                            </StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: '45%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DescriptionIcon sx={{ mr: 1, fontSize: 16 }} />
                                Description
                              </Box>
                            </StyledTableHeadCell>
                            <StyledTableHeadCell sx={{ width: '30%' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <FunctionsIcon sx={{ mr: 1, fontSize: 16 }} />
                                Formula
                              </Box>
                            </StyledTableHeadCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {(dashboardData.definitions || []).map((item, index) => (
                            <motion.tr
                              key={index}
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: index * 0.05, duration: 0.3 }}
                              component={TableRow}
                              sx={{
                                '&:nth-of-type(odd)': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.02),
                                },
                                '&:hover': {
                                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                                },
                                transition: 'background-color 0.2s ease',
                              }}
                            >
                              <StyledTableCell>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {item.metric}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell>
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    lineHeight: 1.5,
                                    color: 'text.secondary',
                                  }}
                                >
                                  {item.description}
                                </Typography>
                              </StyledTableCell>
                              <StyledTableCell>
                                <FormulaDisplay formula={item.formula} />
                              </StyledTableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </motion.div>
                )}
              </AnimatePresence>
            </AccordionDetails>
          </StyledAccordion>
        </Box>
      </motion.div>

      {/* Section 3: Today's Snapshot */}
      <Box id="todays-snapshot">
        <Typography 
          variant="h4" 
          component="h3"
          sx={{ 
            mb: { xs: 3, md: 4 },
            fontWeight: 600,
            color: 'text.primary',
            display: 'flex',
            alignItems: 'center',
            fontSize: { xs: '1.5rem', md: '2rem' },
            flexDirection: { xs: 'column', sm: 'row' },
            textAlign: { xs: 'center', sm: 'left' },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <CameraIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
          Today's Snapshot
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', lg: 'row' },
            gap: { xs: 2, md: 3 },
            alignItems: 'stretch'
          }}
        >
          {/* Code-Based Evals */}
          <Box sx={{ flex: '1.4 1 0', minWidth: 0, display: 'flex' }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              style={{ width: '100%', flex: 1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-4px)' },
                    boxShadow: { xs: theme.shadows[2], md: theme.shadows[8] },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 }, overflow: 'hidden', wordWrap: 'break-word' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <CodeIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 600 }}>
                      Code-Based Evals
                    </Typography>
                  </Box>
                  
                  <Stack spacing={1}>
              {/* META Quality section - different for CC/MV Sales vs other departments */}
              {(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') ? (
                      <>
                        <MetricRow 
                          label="META Quality for 97145810691"
                          fieldName="META Quality for 97145810691"
                        />
                        <MetricRow 
                          label="META Quality for 97145810641"
                          fieldName="META Quality for 97145810641"
                        />
                </>
              ) : (
                      <MetricRow 
                        label="META Quality"
                        fieldName="META Quality"
                      />
              )}
              
              {/* Rest of the Code-Based Evals metrics */}
                    <MetricRow label="LLM Model used" fieldName="LLM Model used" />
                    <ReasonMetricRow label="Reason for using the model" fieldName="Reason for using the model" />
                    <MetricRow label="Chatbot prompt type" fieldName="Chatbot prompt type" />
                    <MetricRow label="N8N/ERP" fieldName="N8N/ERP" />
                    <MetricRow label="Cost ($)" fieldName="Cost ($)" />
                    <MetricRow 
                      label="Total Number of Chats (#)" 
                      fieldName="Total Number of Chats (#)"
                      clickHandler={handleTotalChatsClick}
                      isClickable={true}
                    />
                    <MetricRow 
                      label="Fully handled by bot %" 
                      fieldName="Fully handled by bot %"
                      clickHandler={handleBotHandledClick}
                      isClickable={true}
                    />
                    <MetricRow 
                      label="Verbatim messages repeated % (Avg)" 
                      fieldName="Verbatim messages repeated % (Avg)"
                      clickHandler={handleRepetitionClick}
                      isClickable={true}
                    />
                    <MetricRow label="Avg Delay - Initial msg (sec)" fieldName="Avg Delay - Initial msg (sec)" />
                    <MetricRow label="Avg Delay - non-initial msg (sec)" fieldName="Avg Delay - non-initial msg (sec)" />

                    {/* Unresponsive Chats field - only for specific departments */}
                    {(['MaidsAT African', 'MaidsAT Ethiopian', 'AT Filipina'].includes(selectedDepartment)) && (
                      <MetricRow 
                        label="Unresponsive Chats (%)" 
                        fieldName="Unresponsive chats"
                        clickHandler={handleUnresponsiveChatsClick}
                        isClickable={true}
                      />
                    )}

                    {/* Sales department fields */}
                    {(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <MetricRow label="7D cohort - 3DW" fieldName="7D cohort - 3DW" />
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* LLM-as-a-Judge */}
          <Box sx={{ flex: '1.4 1 0', minWidth: 0, display: 'flex' }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ width: '100%', flex: 1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-4px)' },
                    boxShadow: { xs: theme.shadows[2], md: theme.shadows[8] },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 }, overflow: 'hidden', wordWrap: 'break-word' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PsychologyIcon sx={{ color: theme.palette.secondary.main, mr: 1.5 }} />
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 600 }}>
                      LLM-as-a-Judge
                    </Typography>
                  </Box>
                  
                  <Stack spacing={1}>
                    <MetricRow label="Rule-breaking %" fieldName="Rule-breaking %" />
                    <MetricRow 
                      label="Sentiment analysis (/5)" 
                      fieldName="Sentiment analysis (/5)"
                    />
                    <MetricRow label="Transfers due to escalations %" fieldName="Transfers due to escalations %" />
                    <MetricRow label="Transfers due to known flows %" fieldName="Transfers due to known flows %" />
                    
                    {/* First Time resolution for specific departments */}
              {['CC Resolvers', 'MV Resolvers', 'Delighters'].includes(selectedDepartment) && (
                      <MetricRow 
                        label="First Time resolution on actionable chats" 
                        fieldName="First Time resolution on actionable chats" 
                      />
              )}
              
              {/* Doctor department fields */}
              {selectedDepartment === 'Doctors' && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <MetricRow 
                          label="First time resolution on actionable chats" 
                          fieldName="First Time resolution on actionable chats" 
                        />
                        <MetricRow label="Medical mis-prescriptions" fieldName="Medical mis-prescriptions" />
                        <MetricRow label="Unnecessary clinic recommendations" fieldName="Unnecessary clinic recommendations" />
                      </>
                    )}
                    
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <BuildIcon sx={{ color: theme.palette.info.main, mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Tools
                        </Typography>
                      </Box>
                      <Stack spacing={1}>
                        <MetricRow label="Wrong tool called %" fieldName="Wrong tool called %" />
                        <MetricRow label="Missed to be called %" fieldName="Missed to be called %" />
                      </Stack>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <PolicyIcon sx={{ color: theme.palette.warning.main, mr: 1, fontSize: 20 }} />
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          Policies
                        </Typography>
                      </Box>
                      <Stack spacing={1}>
                        <MetricRow label="Missing policy %" fieldName="Missing policy %" />
                        <MetricRow label="Unclear policy %" fieldName="Unclear policy %" />
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>

          {/* Human annotation */}
          <Box sx={{ flex: '1 1 0', minWidth: 0, display: 'flex' }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ width: '100%', flex: 1 }}
            >
              <Card 
                sx={{ 
                  height: '100%',
                  width: '100%',
                  minWidth: 0,
                  flex: 1,
                  border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-4px)' },
                    boxShadow: { xs: theme.shadows[2], md: theme.shadows[8] },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 }, overflow: 'hidden', wordWrap: 'break-word' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PersonIcon sx={{ color: theme.palette.success.main, mr: 1.5 }} />
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 600 }}>
                      Human Annotation
                    </Typography>
                  </Box>
                  
                  <Stack spacing={1}>
                    <MetricRow 
                      label="Chats shadowed %" 
                      fieldName="Chats shadowed %"
                    />
                    <MetricRow label="Reported issue (#)" fieldName="Reported issue (#)" />
                    <MetricRow label="Issues pending to be solved (#)" fieldName="Issues pending to be solved (#)" />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SnapshotSection; 