import React, { useState } from 'react';
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
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import {
  Info as InfoIcon,
  Camera as CameraIcon,
  Psychology as PsychologyIcon,
  Person as PersonIcon,
  Code as CodeIcon,
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
  AcUnit as SnowflakeIcon,
} from '@mui/icons-material';
import { SiTableau as TableauIcon } from 'react-icons/si';
import { motion, AnimatePresence } from 'framer-motion';
import { codeBasedEvalTooltips, AT_FILIPINA_SUB_DEPARTMENTS } from '../utils/constants';
import { navigateToRawDataSheet, navigateToBotHandledSheet, navigateToRepetitionSheet, navigateToUnresponsiveChatsSheet, navigateToSentimentSheet, navigateTo80SimilaritySheet, navigateToTransferInterventionRawSheet, navigateToShadowedSheet, navigateToShadowingRawDataSheet, navigateToFTRSheet, navigateToFalsePromisesSheet, navigateToPolicyEscalationSheet, navigateToClarityScoreSheet, navigateToClientsSuspectingAISheet, navigateToClientsQuestioningLegaltiesSheet, navigateToCallRequestSheet, navigateToThreateningCaseIdentifierSheet, navigateToMedicalMisPrescriptionsSheet, navigateToUnnecessaryClinicRecommendationsSheet, navigateToDoctorsPolicyEscalationSheet, navigateToDoctorsClarityScoreSheet, navigateToDoctorsClientsSuspectingAISheet } from '../services/googleSheets';
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

// Component for displaying Shadowing Breakdown table
const ShadowingBreakdownTable = ({ shadowingData, selectedDepartment }) => {
  const theme = useTheme();

  // Skip rendering for departments that don't have shadowing
  if (['MaidsAT African', 'MaidsAT Ethiopian', 'AT Filipina'].includes(selectedDepartment)) {
    return null;
  }

  // Parse the shadowing breakdown data
  const parseShadowingData = (data) => {
    if (!data || typeof data !== 'string') {
      return [];
    }

    // Split by newlines and parse each line
    return data.split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        const [name, count] = line.split(':').map(part => part.trim());
        return { name, count: parseInt(count) || 0 };
      })
      .filter(item => item.name && !isNaN(item.count))
      .sort((a, b) => b.count - a.count); // Sort by count descending
  };

  const shadowingItems = parseShadowingData(shadowingData);

  if (shadowingItems.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 2 }}>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <PersonIcon sx={{ color: theme.palette.success.main, mr: 1, fontSize: 20 }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Shadowing Breakdown
          </Typography>
          <Tooltip 
            title={codeBasedEvalTooltips['Shadowing Breakdown']}
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
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', border: 'none', pb: 1 }}>Agent</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600, fontSize: '0.75rem', border: 'none', pb: 1 }}>Chats</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {shadowingItems.map((item, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:hover': { backgroundColor: alpha(theme.palette.success.main, 0.04) },
                  '&:last-child td, &:last-child th': { border: 0 }
                }}
              >
                <TableCell sx={{ fontSize: '0.75rem', py: 0.5, border: 'none' }}>
                  {item.name}
                </TableCell>
                <TableCell align="right" sx={{ fontSize: '0.75rem', py: 0.5, fontWeight: 500, border: 'none' }}>
                  {item.count}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
};

const SnapshotSection = ({ selectedDepartment, selectedDate, dashboardData, selectedATFilipinaSubDept = 'All', onATFilipinaSubDeptChange }) => {
  const theme = useTheme();
  const [definitionsExpanded, setDefinitionsExpanded] = React.useState(false);
  
          // State for expandable metrics
    const [expandedMetrics, setExpandedMetrics] = useState({
      inChatPoke: true,
      fullyHandledBot: true,
      verbatimRepeated: true,
      similarityEighty: true
    });

  // Loading states for metric navigation
  const [loadingStates, setLoadingStates] = useState({
    totalChats: false,
    botHandled: false,
    repetition: false,
    similarity: false,
    shadowing: false,
    unresponsive: false,
    agentIntervention: false
  });

  const handleDefinitionsChange = (event, isExpanded) => {
    setDefinitionsExpanded(isExpanded);
  };

  // Department mapping for the new API
  const getDepartmentForAPI = (department, subDepartment = 'All') => {
    if (department === 'AT Filipina') {
      if (subDepartment === 'Inside UAE') return 'AT_Filipina_Inside_UAE';
      if (subDepartment === 'Outside UAE') return 'AT_Filipina_Outside_UAE';
      if (subDepartment === 'In PHL') return 'AT_Filipina_In_PHL';
      return 'AT_Filipina';
    }

    const departmentMap = {
      'CC Sales': 'CC_Sales',
      'MV Resolvers': 'MV_Resolvers',
      'CC Resolvers': 'CC_Resolvers',
      'MV Sales': 'MV_Sales',
      'MaidsAT African': 'AT_African',
      'MaidsAT Ethiopian': 'AT_Ethiopian',
      'Doctors': 'Doctors',
      'Delighters': 'Delighters'
    };

    return departmentMap[department] || department;
  };

  // Metric mapping for the new API
  const getMetricForAPI = (metricType) => {
    const metricMap = {
      'totalChats': 'delays',
      'botHandled': 'bot-handled',
      'repetition': 'repetition',
      'similarity': 'similarity',
      'shadowing': 'shadowing',
      'unresponsive': 'unresponsive',
      'agentIntervention': 'agent-intervention'
    };

    return metricMap[metricType] || metricType;
  };

  // New API function for dates after 2025-08-05
  const navigateWithNewAPI = async (metricType, department, date, subDepartment = 'All') => {
    const cutoffDate = new Date('2025-08-05');
    const selectedDateObj = new Date(date);

    // Use old logic for dates before or equal to 2025-08-05
    if (selectedDateObj <= cutoffDate) {
      return false; // Indicate to use old logic
    }

    const loadingKey = metricType;
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const apiDepartment = getDepartmentForAPI(department, subDepartment);
      const apiMetric = getMetricForAPI(metricType);
      const apiUrl = `https://codeeval-snowflake.up.railway.app/api/get-sheet/${apiDepartment}/${date}/${apiMetric}`;

      console.log(`Calling new API: ${apiUrl}`);

      const response = await fetch(apiUrl);
      const data = await response.json();

      console.log('API Response:', data);

      if (data.success && data.tab_found && data.worksheet_gid) {
        // Open the tab URL
        window.open(data.tab_url, '_blank');
      } else if (data.success && !data.tab_found) {
        // Sheet found but tab not found
        alert(`The ${metricType} raw data tab for ${date} does not exist in the spreadsheet.`);
      } else {
        // API call failed
        alert(`Error: ${data.message || 'Failed to find the sheet data.'}`);
      }

      return true; // Indicate new API was used
    } catch (error) {
      console.error('Error calling new API:', error);
      alert('Error accessing the sheet data. Please try again.');
      return true; // Still indicate new API was attempted
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
    }
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

  // Handle click on Chats supposed to be handled by bot (#) label to navigate to raw data
  const handleTotalChatsClick = async () => {
    console.log('Total Chats clicked for:', selectedDepartment, selectedDate, selectedATFilipinaSubDept);
    try {
      const usedNewAPI = await navigateWithNewAPI('totalChats', selectedDepartment, selectedDate, selectedATFilipinaSubDept);
      if (!usedNewAPI) {
        // Use old logic for dates <= 2025-08-05
        await navigateToRawDataSheet(selectedDepartment, selectedDate, selectedATFilipinaSubDept);
      }
    } catch (error) {
      console.error('Error navigating to raw data sheet:', error);
      alert('Error opening raw data sheet. Please try again.');
    }
  };

  // Handle click on Fully handled by bot % label to navigate to bot handled sheet
  const handleBotHandledClick = async () => {
    console.log('Bot Handled clicked for:', selectedDepartment, selectedDate);
    try {
      const usedNewAPI = await navigateWithNewAPI('botHandled', selectedDepartment, selectedDate);
      if (!usedNewAPI) {
        // Use old logic for dates <= 2025-08-05
        await navigateToBotHandledSheet(selectedDepartment, selectedDate);
      }
    } catch (error) {
      console.error('Error navigating to bot handled sheet:', error);
      alert('Error opening bot handled sheet. Please try again.');
    }
  };

  // Handle click on Agent intervention % label to navigate to agent intervention sheet
  const handleAgentInterventionClick = async () => {
    console.log('Agent intervention clicked for:', selectedDepartment, selectedDate);
    try {
      const usedNewAPI = await navigateWithNewAPI('agentIntervention', selectedDepartment, selectedDate);
      if (!usedNewAPI) {
        // For dates <= 2025-08-05, show message that agent intervention data is not available
        alert('Agent intervention data is only available for dates after August 5, 2025.');
      }
    } catch (error) {
      console.error('Error navigating to agent intervention sheet:', error);
      alert('Error opening agent intervention sheet. Please try again.');
    }
  };

  // Handle click on Identical messages repeated % (Avg) label to navigate to repetition sheet
  const handleRepetitionClick = async () => {
    console.log('Repetition clicked for:', selectedDepartment, selectedDate);
    try {
      const usedNewAPI = await navigateWithNewAPI('repetition', selectedDepartment, selectedDate);
      if (!usedNewAPI) {
        // Use old logic for dates <= 2025-08-05
        await navigateToRepetitionSheet(selectedDepartment, selectedDate);
      }
    } catch (error) {
      console.error('Error navigating to repetition sheet:', error);
      alert('Error opening repetition sheet. Please try again.');
    }
  };

  // Handle click on Unresponsive Chats (%) label to navigate to unresponsive chats sheet
  const handleUnresponsiveChatsClick = async () => {
    console.log('Unresponsive Chats clicked for:', selectedDepartment, selectedDate);
    try {
      const usedNewAPI = await navigateWithNewAPI('unresponsive', selectedDepartment, selectedDate);
      if (!usedNewAPI) {
        // Use old logic for dates <= 2025-08-05
        await navigateToUnresponsiveChatsSheet(selectedDepartment, selectedDate);
      }
    } catch (error) {
      console.error('Error navigating to unresponsive chats sheet:', error);
      alert('Error opening unresponsive chats sheet. Please try again.');
    }
  };

  // Handle click on Sentiment analysis (/5) label to navigate to sentiment analysis sheet
  const handleSentimentClick = async () => {
    console.log('Sentiment analysis clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToSentimentSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to sentiment analysis sheet:', error);
      alert('Error opening sentiment analysis sheet. Please try again.');
    }
  };

  // Handle click on 80% Message similarity % label to navigate to 80% similarity sheet
  const handle80SimilarityClick = async () => {
    console.log('Message similarity clicked for:', selectedDepartment, selectedDate);
    try {
      const usedNewAPI = await navigateWithNewAPI('similarity', selectedDepartment, selectedDate);
      if (!usedNewAPI) {
        // Use old logic for dates <= 2025-08-05
        await navigateTo80SimilaritySheet(selectedDepartment, selectedDate);
      }
    } catch (error) {
      console.error('Error navigating to similarity sheet:', error);
      alert('Error opening similarity sheet. Please try again.');
    }
  };



  // Handle click on Chats shadowed % label to navigate to raw data sheet with shadowing tab
  const handleChatsShadowedClick = async () => {
    console.log('Chats shadowed % clicked for:', selectedDepartment, selectedDate);
    try {
      const usedNewAPI = await navigateWithNewAPI('shadowing', selectedDepartment, selectedDate);
      if (!usedNewAPI) {
        // Use old logic for dates <= 2025-08-05
        await navigateToShadowingRawDataSheet(selectedDepartment, selectedDate);
      }
    } catch (error) {
      console.error('Error navigating to shadowing raw data sheet:', error);
      alert('Error opening shadowing raw data sheet. Please try again.');
    }
  };

  // Handle click on FTR (First Time Resolution) label to navigate to FTR sheet
  const handleFTRClick = async () => {
    console.log('FTR clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToFTRSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to FTR sheet:', error);
      alert('Error opening FTR sheet. Please try again.');
    }
  };

  // Handle click on Medical mis-prescriptions label to navigate to medical mis-prescriptions sheet
  const handleMedicalMisPrescriptionsClick = async () => {
    console.log('Medical mis-prescriptions clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToMedicalMisPrescriptionsSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Medical mis-prescriptions sheet:', error);
      alert('Error opening Medical mis-prescriptions sheet. Please try again.');
    }
  };

  // Handle click on Unnecessary clinic recommendations label to navigate to unnecessary clinic recommendations sheet
  const handleUnnecessaryClinicRecommendationsClick = async () => {
    console.log('Unnecessary clinic recommendations clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToUnnecessaryClinicRecommendationsSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Unnecessary clinic recommendations sheet:', error);
      alert('Error opening Unnecessary clinic recommendations sheet. Please try again.');
    }
  };

  // Handle click on Policy to cause escalation % for Doctors
  const handleDoctorsPolicyEscalationClick = async () => {
    console.log('Doctors Policy to cause escalation % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToDoctorsPolicyEscalationSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Doctors policy escalation sheet:', error);
      alert('Error opening Doctors policy escalation sheet. Please try again.');
    }
  };

  // Handle click on Clarification Requested % for Doctors
  const handleDoctorsClarityScoreClick = async () => {
    console.log('Doctors Clarification Requested % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToDoctorsClarityScoreSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Doctors Clarification Requestedsheet:', error);
      alert('Error opening Doctors Clarification Requestedsheet. Please try again.');
    }
  };

  // Handle click on Clients Suspecting AI % for Doctors
  const handleDoctorsClientsSuspectingAIClick = async () => {
    console.log('Doctors Clients Suspecting AI % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToDoctorsClientsSuspectingAISheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Doctors clients suspecting AI sheet:', error);
      alert('Error opening Doctors clients suspecting AI sheet. Please try again.');
    }
  };

  // Handle click on False Promises label to navigate to False Promises sheet
  const handleFalsePromisesClick = async () => {
    console.log('False Promises clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToFalsePromisesSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to False Promises sheet:', error);
      alert('Error opening False Promises sheet. Please try again.');
    }
  };

  // Handle click handlers for MV Resolvers specific metrics
  const handlePolicyEscalationClick = async () => {
    console.log('Policy to cause escalation % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToPolicyEscalationSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Policy to cause escalation sheet:', error);
      alert('Error opening Policy to cause escalation sheet. Please try again.');
    }
  };

  const handleClarityScoreClick = async () => {
    console.log('Clarification Requested % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToClarityScoreSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Clarification Requestedsheet:', error);
      alert('Error opening Clarification Requestedsheet. Please try again.');
    }
  };

  const handleClientsSuspectingAIClick = async () => {
    console.log('Clients Suspecting AI % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToClientsSuspectingAISheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Clients Suspecting AI sheet:', error);
      alert('Error opening Clients Suspecting AI sheet. Please try again.');
    }
  };

  const handleClientsQuestioningLegaltiesClick = async () => {
    console.log('Clients Questioning Legalties % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToClientsQuestioningLegaltiesSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Clients Questioning Legalties sheet:', error);
      alert('Error opening Clients Questioning Legalties sheet. Please try again.');
    }
  };

  const handleCallRequestClick = async () => {
    console.log('Call Request % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToCallRequestSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Call Request sheet:', error);
      alert('Error opening Call Request sheet. Please try again.');
    }
  };

  const handleThreateningCaseIdentifierClick = async () => {
    console.log('Threatening Case Identifier % clicked for:', selectedDepartment, selectedDate);
    try {
      await navigateToThreateningCaseIdentifierSheet(selectedDepartment, selectedDate);
    } catch (error) {
      console.error('Error navigating to Threatening Case Identifier sheet:', error);
      alert('Error opening Threatening Case Identifier sheet. Please try again.');
    }
  };

  // CC Sales specific click handlers
  const handleCCSalesClarityScoreClick = async () => {
    console.log('CC Sales Clarification Requested % clicked for:', selectedDepartment, selectedDate);
    try {
      window.open('https://docs.google.com/spreadsheets/d/1hFknnkEbbuiyBAU2OUoAMyKp0qc9zqK3o99_Z2rECLs', '_blank');
    } catch (error) {
      console.error('Error opening CC Sales Clarification Requested sheet:', error);
      alert('Error opening CC Sales Clarification Requested sheet. Please try again.');
    }
  };

  const handleCCSalesClientsSuspectingAIClick = async () => {
    console.log('CC Sales Clients Suspecting AI % clicked for:', selectedDepartment, selectedDate);
    try {
      window.open('https://docs.google.com/spreadsheets/d/1odvkCDMC36YZhYOT9kb_MntxJ1PV7YnCbe5cgTTGnbQ', '_blank');
    } catch (error) {
      console.error('Error opening CC Sales Clients Suspecting AI sheet:', error);
      alert('Error opening CC Sales Clients Suspecting AI sheet. Please try again.');
    }
  };

  // MV Sales specific click handlers
  const handleMVSalesClarityScoreClick = async () => {
    console.log('MV Sales Clarification Requested % clicked for:', selectedDepartment, selectedDate);
    try {
      window.open('https://docs.google.com/spreadsheets/d/1xWX9BxmqqNC9q7-nBbcakeyb5kxp0sfXYVtRBu-W28k', '_blank');
    } catch (error) {
      console.error('Error opening MV Sales Clarification Requested sheet:', error);
      alert('Error opening MV Sales Clarification Requested sheet. Please try again.');
    }
  };

  const handleMVSalesClientsSuspectingAIClick = async () => {
    console.log('MV Sales Clients Suspecting AI % clicked for:', selectedDepartment, selectedDate);
    try {
      window.open('https://docs.google.com/spreadsheets/d/1eti8KL3y44Pmp2Yp-YKit0CkHX39X0VBBG3Kck3gZ_Q', '_blank');
    } catch (error) {
      console.error('Error opening MV Sales Clients Suspecting AI sheet:', error);
      alert('Error opening MV Sales Clients Suspecting AI sheet. Please try again.');
    }
  };


  // Helper component for metric rows with tooltips
  const MetricRow = ({
    label,
    fieldName,
    clickHandler = null,
    showTooltip = true,
    isClickable = false,
    icon = null,
    isIndented = false,
    loading = false,
    sx = {}
  }) => {
    const hasTooltip = showTooltip && codeBasedEvalTooltips[label];
    
    const LabelComponent = ({ children }) => {
      if (isClickable && clickHandler) {
        return (
          <Button
            onClick={clickHandler}
            variant="text"
            disabled={loading}
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
              '&.Mui-disabled': {
                color: theme.palette.text.secondary,
              },
            }}
            title={loading ? 'Loading...' : `Click to open ${label.toLowerCase()} data sheet`}
            startIcon={loading ? <CircularProgress size={14} /> : null}
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
          minHeight: isIndented ? 16 : 32,
          py: isIndented ? 0 : 0.5,
          mt: isIndented ? -0.5 : 0,
          pl: isIndented ? 3 : 0,
          ...sx
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, mr: 2 }}>
          {icon && (
            <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
              {React.createElement(icon, { sx: { fontSize: 16, color: 'primary.main' } })}
            </Box>
          )}
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
          <SnapshotValueRenderer fieldName={fieldName} dashboardData={dashboardData} selectedDepartment={selectedDepartment} />
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
          <SnapshotValueRenderer fieldName={fieldName} dashboardData={dashboardData} selectedDepartment={selectedDepartment} />
        </Box>
      </Box>
    );
  };

  // Expandable MetricRow component for metrics with sub-metrics
  const ExpandableMetricRow = ({
    label,
    fieldName,
    metricKey,
    subMetrics = [],
    clickHandler = null,
    showTooltip = true,
    isClickable = false,
    icon = null,
    loading = false
  }) => {
    const hasTooltip = showTooltip && codeBasedEvalTooltips[label];
    const isExpanded = expandedMetrics[metricKey];
    
    const toggleExpanded = () => {
      setExpandedMetrics(prev => ({
        ...prev,
        [metricKey]: !prev[metricKey]
      }));
    };

    const LabelComponent = ({ children }) => {
      if (isClickable && clickHandler) {
        return (
          <Button
            onClick={clickHandler}
            variant="text"
            disabled={loading}
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
              '&.Mui-disabled': {
                color: theme.palette.text.secondary,
              },
            }}
            title={loading ? 'Loading...' : `Click to open ${label.toLowerCase()} data sheet`}
            startIcon={loading ? <CircularProgress size={14} /> : null}
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
      <Box>
        {/* Main metric row */}
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
            {icon && (
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                {React.createElement(icon, { sx: { fontSize: 16, color: 'primary.main' } })}
              </Box>
            )}
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
            {subMetrics.length > 0 && (
              <IconButton
                onClick={toggleExpanded}
                size="small"
                sx={{
                  ml: 0.5,
                  p: 0,
                  width: 20,
                  height: 20,
                  transition: 'transform 0.2s ease-in-out',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              </IconButton>
            )}
          </Box>
          <Box sx={{ textAlign: 'right', maxWidth: '60%' }}>
            <SnapshotValueRenderer fieldName={fieldName} dashboardData={dashboardData} selectedDepartment={selectedDepartment} />
          </Box>
        </Box>

        {/* Sub-metrics */}
        <AnimatePresence>
          {isExpanded && subMetrics.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              style={{ overflow: 'hidden' }}
            >
              <Box sx={{ pl: 2, mt: 1 }}>
                {subMetrics.map((subMetric, index) => (
                  <MetricRow
                    key={index}
                    label={subMetric.label}
                    fieldName={subMetric.fieldName}
                    clickHandler={subMetric.clickHandler}
                    isClickable={subMetric.isClickable}
                    isIndented={true}
                  />
                ))}
              </Box>
            </motion.div>
          )}
        </AnimatePresence>
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: selectedDepartment === 'AT Filipina' ? 2 : 0 }}>
            <DateIcon sx={{ color: 'text.secondary', mr: 1 }} />
            <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
              {getCurrentDate(selectedDate)}
            </Typography>
          </Box>
          
          {/* AT Filipina Sub-Department Selector */}
          {selectedDepartment === 'AT Filipina' && (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <Select
                  value={selectedATFilipinaSubDept}
                  onChange={(e) => onATFilipinaSubDeptChange && onATFilipinaSubDeptChange(e.target.value)}
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': { 
                      borderColor: alpha(theme.palette.primary.main, 0.3)
                    },
                    '.MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      py: 1,
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: theme.palette.primary.main,
                    },
                  }}
                >
                  {Object.entries(AT_FILIPINA_SUB_DEPARTMENTS).map(([key, config]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CleaningServicesIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" fontWeight={500}>
                          {config.label}
                        </Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
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
                          icon={SnowflakeIcon}
                        />
                        <MetricRow 
                          label="META Quality for 97145810641"
                          fieldName="META Quality for 97145810641"
                          icon={SnowflakeIcon}
                        />
                </>
              ) : (
                      <MetricRow 
                        label="META Quality"
                        fieldName="META Quality"
                        icon={SnowflakeIcon}
                      />
              )}
              
              {/* Rest of the Code-Based Evals metrics */}
                    <MetricRow label="LLM Model used" fieldName="LLM Model used" />
                    <MetricRow label="LLM Backup Model" fieldName="LLM Backup Model" />
                    <MetricRow 
                      label="Backup model messages sent #(%)" 
                      fieldName="Messages by backup" 
                      isIndented={true}
                      sx={{ mt: -2, minHeight: 12, pb: 1 }}
                    />
                    <ReasonMetricRow label="Reason for using the model" fieldName="Reason for using the model" />
                    <MetricRow label="Chatbot prompt type" fieldName="Chatbot prompt type" />
                    <MetricRow label="N8N/ERP" fieldName="N8N/ERP" />
                    <MetricRow label="Cost ($)" fieldName="Cost ($)" />
                    <MetricRow
                      label="Chats supposed to be handled by bot (#)"
                      fieldName="Chats supposed to be handled by bot (#)"
                      clickHandler={handleTotalChatsClick}
                      isClickable={true}
                      icon={SnowflakeIcon}
                      loading={loadingStates.totalChats}
                    />
                                            <ExpandableMetricRow
              
              label="Fully handled by bot %"
              fieldName="Fully handled by bot %"
              metricKey="fullyHandledBot"
              clickHandler={handleBotHandledClick}
              isClickable={true}
              icon={SnowflakeIcon}
              loading={loadingStates.botHandled}
              subMetrics={[
                ...(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales' ? [
                  { label: "Fully Handled by bot (excluding agent pokes)", fieldName: "Fully Handled by bot (excluding agent pokes)" }
                ] : []),
                { label: "Chats with at least 2 agent messages", fieldName: "Chats with at least 1 agent message" },
                { label: "Chats with at least 3 agent messages", fieldName: "Chats with at least 2 agent messages" },
                { label: "Chats with at least 5 agent messages", fieldName: "Chats with at least 3 agent messages" }
              ]}
            />
                    
                    {/* Agent intervention % - only for CC Sales and MV Sales */}
                    {(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') && (
                      <MetricRow
                        label="Agent Intervention %"
                        fieldName="Agent intervention %"
                        clickHandler={handleAgentInterventionClick}
                        // isClickable={true}
                        icon={SnowflakeIcon}
                        loading={loadingStates.agentIntervention}
                      />
                    )}
                    
                                        {/* Expandable metrics for CC Sales and MV Sales only */}
                    {(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') ? (
                      <>

                        <ExpandableMetricRow
                          label="Identical messages repeated % (Avg)"
                          fieldName="Identical messages repeated % (Avg)"
                          metricKey="verbatimRepeated"
                          clickHandler={handleRepetitionClick}
                          isClickable={true}
                          icon={SnowflakeIcon}
                          loading={loadingStates.repetition}
                          subMetrics={[
                            { label: "Static messages %", fieldName: "Repetition static messages %" },
                            { label: "Dynamic messages %", fieldName: "Repetition dynamic messages %" }
                          ]}
                        />
                        <ExpandableMetricRow
                          label={new Date(selectedDate) >= new Date('2025-08-06') ? "50% Message similarity %" : "80% Message similarity %"}
                          fieldName={new Date(selectedDate) >= new Date('2025-08-06') ? "50% Message similarity %" : "80% Message similarity %"}
                          metricKey="similarityEighty"
                          clickHandler={handle80SimilarityClick}
                          isClickable={true}
                          icon={SnowflakeIcon}
                          loading={loadingStates.similarity}
                          subMetrics={[
                            {
                              label: new Date(selectedDate) >= new Date('2025-08-06') ? "Static messages %" : "Static messages %",
                              fieldName: new Date(selectedDate) >= new Date('2025-08-06') ? "50% similarity static messages %" : "80% similarity static messages %"
                            },
                            {
                              label: new Date(selectedDate) >= new Date('2025-08-06') ? "Dynamic messages %" : "Dynamic messages %",
                              fieldName: new Date(selectedDate) >= new Date('2025-08-06') ? "50% similarity Dynamic messages %" : "80% similarity Dynamic messages %"
                            }
                          ]}
                        />
                      </>
                    ) : (
                      <>
                        {/* Expandable metrics for AT departments (Filipina, Ethiopian, African) */}
                        {(['AT Filipina', 'MaidsAT Ethiopian', 'MaidsAT African'].includes(selectedDepartment)) ? (
                          <>
                            <ExpandableMetricRow
                              label="Identical messages repeated % (Avg)"
                              fieldName="Identical messages repeated % (Avg)"
                              metricKey="verbatimRepeated"
                              clickHandler={handleRepetitionClick}
                              isClickable={true}
                              icon={SnowflakeIcon}
                              loading={loadingStates.repetition}
                              subMetrics={[
                                { label: "Static messages %", fieldName: "Repetition static messages %" },
                                { label: "Dynamic messages %", fieldName: "Repetition dynamic messages %" }
                              ]}
                            />
                            <ExpandableMetricRow
                              label={new Date(selectedDate) >= new Date('2025-08-06') ? "50% Message similarity %" : "80% Message similarity %"}
                              fieldName={new Date(selectedDate) >= new Date('2025-08-06') ? "50% Message similarity %" : "80% Message similarity %"}
                              metricKey="similarityEighty"
                              clickHandler={handle80SimilarityClick}
                              isClickable={true}
                              icon={SnowflakeIcon}
                              loading={loadingStates.similarity}
                              subMetrics={[
                                {
                                  label: new Date(selectedDate) >= new Date('2025-08-06') ? "Static messages %" : "Static messages %",
                                  fieldName: new Date(selectedDate) >= new Date('2025-08-06') ? "50% similarity static messages %" : "80% similarity static messages %"
                                },
                                {
                                  label: new Date(selectedDate) >= new Date('2025-08-06') ? "Dynamic messages %" : "Dynamic messages %",
                                  fieldName: new Date(selectedDate) >= new Date('2025-08-06') ? "50% similarity Dynamic messages %" : "80% similarity Dynamic messages %"
                                }
                              ]}
                            />
                          </>
                        ) : (
                          <>
                            <MetricRow label="Identical messages repeated % (Avg)" fieldName="Identical messages repeated % (Avg)" clickHandler={handleRepetitionClick} isClickable={true} icon={SnowflakeIcon} loading={loadingStates.repetition} />
                            <MetricRow
                              label={new Date(selectedDate) >= new Date('2025-08-06') ? "50% Message similarity %" : "80% Message similarity %"}
                              fieldName={new Date(selectedDate) >= new Date('2025-08-06') ? "50% Message similarity %" : "80% Message similarity %"}
                              clickHandler={handle80SimilarityClick}
                              isClickable={true}
                              icon={SnowflakeIcon}
                              loading={loadingStates.similarity}
                            />
                          </>
                        )}
                      </>
                    )}
                    
                    {/* Minimum Reply Time for all departments */}
                    <MetricRow label="Minimum Reply Time (sec)" fieldName="Minimum Reply Time (sec)" icon={SnowflakeIcon} />
                    
                    <MetricRow label="Avg Delay - Initial msg (sec)" fieldName="Avg Delay - Initial msg (sec)" icon={SnowflakeIcon} />
                    <MetricRow label="Avg Delay - non-initial msg (sec)" fieldName="Avg Delay - non-initial msg (sec)" icon={SnowflakeIcon} />

                    {/* New metrics for CC Sales and MV Sales only */}
                    {(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') && (
                      <>
                        <MetricRow label="Call Requests Metric %" fieldName="Call Requests Metric %" icon={SnowflakeIcon} />
                        <ExpandableMetricRow 
                          label="In-Chat Poke Re-engagement (%)" 
                          fieldName="In-Chat Poke Re-engagement (%)"
                          metricKey="inChatPoke"
                          icon={SnowflakeIcon}
                          subMetrics={[
                            { label: "In-Chat Bot Poke Re-engagement", fieldName: "In-Chat Bot Poke Re-engagement" },
                            { label: "In-Chat Bot M20 Poke Re-engagement", fieldName: "In-Chat Bot M20 Poke Re-engagement" },
                            { label: "In-Chat Agent Poke Re-engagement", fieldName: "In-Chat Agent Poke Re-engagement" }
                          ]}
                        />
                      </>
                    )}

                    {/* Unresponsive Chats field - only for specific departments */}
                    {(['MaidsAT African', 'MaidsAT Ethiopian', 'AT Filipina', 'MV Resolvers'].includes(selectedDepartment)) && (
                      <MetricRow
                        label="Unresponsive Chats (%)"
                        fieldName="Unresponsive chats"
                        clickHandler={handleUnresponsiveChatsClick}
                        isClickable={true}
                        loading={loadingStates.unresponsive}
                      />
                    )}

                    {/* Sales department fields */}
                    {(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <MetricRow label="7D cohort - 3DW %" fieldName="7D cohort - 3DW %" icon={SnowflakeIcon} />
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
                    {/* <MetricRow label="Rule-breaking %" fieldName="Rule-breaking %" /> */}
                    <MetricRow 
                      label="Sentiment analysis (/5)" 
                      fieldName="Sentiment analysis (/5)"
                      clickHandler={handleSentimentClick}
                      isClickable={true}
                      icon={TableauIcon}
                    />
                    <MetricRow label="Transfers due to escalations %" fieldName="Transfers due to escalations %" icon={TableauIcon} />
                    <MetricRow label="Transfers due to known flows %" fieldName="Transfers due to known flows %" icon={TableauIcon} />
                    
                    {/* MV Resolvers specific metrics */}
                    {selectedDepartment === 'MV Resolvers' && (
                      <>
                        <MetricRow 
                          label="% False Promises %" 
                          fieldName="% False Promises %" 
                          clickHandler={selectedDepartment === 'MV Resolvers' ? handleFalsePromisesClick : null}
                          isClickable={selectedDepartment === 'MV Resolvers'}
                          icon={TableauIcon}
                        />

                        
                        {/* New MV Resolvers specific metrics */}
                                                <MetricRow 
                          label="Policy to cause escalation %" 
                          fieldName="Policy to cause escalation %" 
                          clickHandler={handlePolicyEscalationClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Clarification Requested %" 
                          fieldName="Clarification Requested %" 
                          clickHandler={handleClarityScoreClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Clients Suspecting AI %" 
                          fieldName="Clients Suspecting AI %" 
                          clickHandler={handleClientsSuspectingAIClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Clients Questioning Legalties %"
                          fieldName="Clients Questioning Legalties %" 
                          clickHandler={handleClientsQuestioningLegaltiesClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Call Request %" 
                          fieldName="Call Request %" 
                          clickHandler={handleCallRequestClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Threatening Case Identifier %" 
                          fieldName="Threatening Case Identifier %" 
                          clickHandler={handleThreateningCaseIdentifierClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                      </>
                    )}
                    
                    {/* CC Sales and MV Sales specific metrics */}
                    {(selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') && (
                      <>
                        <MetricRow 
                          label="Clarification Requested %" 
                          fieldName="Clarification Requested %" 
                          clickHandler={selectedDepartment === 'CC Sales' ? handleCCSalesClarityScoreClick : handleMVSalesClarityScoreClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Clients Suspecting AI %" 
                          fieldName="Clients Suspecting AI %" 
                          clickHandler={selectedDepartment === 'CC Sales' ? handleCCSalesClientsSuspectingAIClick : handleMVSalesClientsSuspectingAIClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                      </>
                    )}
                    
                    {/* First Time resolution for specific departments */}
              {['CC Resolvers', 'MV Resolvers', 'Delighters'].includes(selectedDepartment) && (
                      <MetricRow 
                        label="First Time resolution on actionable chats %" 
                        fieldName="FTR" 
                        clickHandler={selectedDepartment === 'MV Resolvers' ? handleFTRClick : null}
                        isClickable={selectedDepartment === 'MV Resolvers'}
                        icon={TableauIcon}
                      />
              )}
              
              {/* Doctor department fields */}
              {selectedDepartment === 'Doctors' && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <MetricRow 
                          label="Policy to cause escalation %" 
                          fieldName="Policy to cause escalation %"
                          clickHandler={handleDoctorsPolicyEscalationClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Clarification Requested %" 
                          fieldName="Clarification Requested %"
                          clickHandler={handleDoctorsClarityScoreClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Clients Suspecting AI %" 
                          fieldName="Clients Suspecting AI %"
                          clickHandler={handleDoctorsClientsSuspectingAIClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="First Time resolution on actionable chats %" 
                          fieldName="FTR" 
                          clickHandler={selectedDepartment === 'MV Resolvers' ? handleFTRClick : null}
                          isClickable={selectedDepartment === 'MV Resolvers'}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Medical mis-prescriptions" 
                          fieldName="Medical mis-prescriptions"
                          clickHandler={handleMedicalMisPrescriptionsClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
                        <MetricRow 
                          label="Unnecessary clinic recommendations" 
                          fieldName="Unnecessary clinic recommendations"
                          clickHandler={handleUnnecessaryClinicRecommendationsClick}
                          isClickable={true}
                          icon={TableauIcon}
                        />
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
                        <MetricRow label="Wrong tool called %" fieldName="Wrong tool called %" icon={TableauIcon} />
                        <MetricRow label="Missed to be called %" fieldName="Missed to be called %" icon={TableauIcon} />
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
                        <MetricRow label="Missing policy %" fieldName="Missing policy %" icon={TableauIcon} />
                        <MetricRow label="Unclear policy %" fieldName="Unclear policy %" icon={TableauIcon} />
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
                      icon={SnowflakeIcon}
                      label="Chats shadowed %"
                      fieldName="Chats shadowed %"
                      clickHandler={handleChatsShadowedClick}
                      isClickable={!['MaidsAT African', 'MaidsAT Ethiopian', 'AT Filipina'].includes(selectedDepartment)}
                      loading={loadingStates.shadowing}
                    />
                    <MetricRow label="Reported issue (#)" icon={SnowflakeIcon} fieldName="Reported issue (#)" />
                    <MetricRow label="Issues pending to be solved (#)" icon={SnowflakeIcon} fieldName="Issues pending to be solved (#)" />
                    
                    {/* Shadowing Breakdown Table */}
                    <ShadowingBreakdownTable 
                      shadowingData={dashboardData.snapshot['Shadowing breakdown']} 
                      selectedDepartment={selectedDepartment}
                    />
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        </Box>
        
        {/* Policy to Cause Escalation section - only for MV Resolvers */}
        {selectedDepartment === 'MV Resolvers' && dashboardData.policyEscalation && dashboardData.policyEscalation.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card 
                sx={{ 
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: { xs: 'none', md: 'translateY(-4px)' },
                    boxShadow: { xs: theme.shadows[2], md: theme.shadows[8] },
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <PolicyIcon sx={{ color: theme.palette.primary.main, mr: 1.5 }} />
                    <Typography variant="h6" component="h4" sx={{ fontWeight: 600 }}>
                      Policy to Cause Escalation
                    </Typography>
                  </Box>
                  
                  <TableContainer 
                    component={Paper} 
                    sx={{ 
                      maxHeight: 500,
                      border: `1px solid ${alpha(theme.palette.grey[300], 0.8)}`,
                      borderRadius: 2,
                      mb: 2
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell 
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              fontSize: '0.9rem',
                              padding: '16px',
                              minWidth: '50%'
                            }}
                          >
                            📋 Policy Description
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              fontSize: '0.9rem',
                              padding: '16px',
                              minWidth: '100px'
                            }}
                          >
                            📊 Count
                          </TableCell>
                          <TableCell 
                            align="center"
                            sx={{ 
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                              fontWeight: 700,
                              color: theme.palette.primary.main,
                              fontSize: '0.9rem',
                              padding: '16px',
                              minWidth: '120px'
                            }}
                          >
                            📈 Percentage
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.policyEscalation.map((row, index) => (
                          <TableRow 
                            key={index}
                            sx={{
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.primary.main, 0.04),
                              },
                              '&:nth-of-type(odd)': {
                                backgroundColor: alpha(theme.palette.grey[50], 0.5),
                              },
                            }}
                          >
                            <TableCell sx={{ padding: '16px', fontSize: '0.9rem' }}>
                              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                <Box sx={{ 
                                  minWidth: 24, 
                                  height: 24, 
                                  borderRadius: '50%', 
                                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  mt: 0.2,
                                  flexShrink: 0
                                }}>
                                  <Typography variant="caption" sx={{ 
                                    fontWeight: 700, 
                                    color: theme.palette.primary.main,
                                    fontSize: '0.7rem'
                                  }}>
                                    {index + 1}
                                  </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ 
                                  fontSize: '0.9rem', 
                                  lineHeight: 1.5,
                                  color: theme.palette.text.primary
                                }}>
                                  {row.policy}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: '16px' }}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 600,
                                color: theme.palette.info.main,
                                fontSize: '0.9rem'
                              }}>
                                {row.count}
                              </Typography>
                            </TableCell>
                            <TableCell align="center" sx={{ padding: '16px' }}>
                              <Typography variant="body2" sx={{ 
                                fontWeight: 700,
                                color: theme.palette.warning.main,
                                fontSize: '0.9rem'
                              }}>
                                {row.percentage}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  
                  <Typography variant="caption" sx={{ 
                    color: theme.palette.text.secondary,
                    fontStyle: 'italic',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mt: 1
                  }}>
                    <Box component="span" sx={{ fontSize: '1rem' }}>💡</Box>
                    Policies ranked by escalation frequency • Higher percentages indicate policies more likely to cause customer escalations
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SnapshotSection; 