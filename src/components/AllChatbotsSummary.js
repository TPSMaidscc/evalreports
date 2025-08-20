import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import { fetchTodaysSnapshot } from '../services/googleSheets';
import { formatDisplayDate, getDepartmentsForDate } from '../utils/helpers';

const AllChatbotsSummary = ({ selectedDate }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState([]);

  // Get departments based on selected date (excluding All Chatbots Summary itself)
  const getDepartmentsForSummary = (date) => {
    return getDepartmentsForDate(date).filter(dept => dept !== 'All Chatbots Summary' && dept !== 'LLM Cost Analysis');
  };

  useEffect(() => {
    const fetchAllDepartmentsData = async () => {
      setLoading(true);
      try {
        const departments = getDepartmentsForSummary(selectedDate);
        const dataPromises = departments.map(async (department) => {
          try {
            const snapshot = await fetchTodaysSnapshot(department, selectedDate);
            return { department, data: snapshot };
          } catch (error) {
            console.error(`Error fetching data for ${department}:`, error);
            return { department, data: {} };
          }
        });

        const results = await Promise.all(dataPromises);
        setSummaryData(results);
      } catch (error) {
        console.error('Error fetching all departments data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchAllDepartmentsData();
    }
  }, [selectedDate]);

  const formatValue = (value) => {
    if (value === null || value === undefined || value === '') {
      return 'N/A';
    }
    return value;
  };

  // Special formatter for META Quality that handles CC Sales and MV Sales dual values
  const formatMetaQuality = (data, department) => {
    if (department === 'CC Sales' || department === 'MV Sales') {
      const meta691 = data['META Quality for 97145810691'];
      const meta641 = data['META Quality for 97145810641'];
      
      if ((meta691 === null || meta691 === undefined || meta691 === '') && 
          (meta641 === null || meta641 === undefined || meta641 === '')) {
        return 'N/A';
      }
      
      const value691 = formatValue(meta691);
      const value641 = formatValue(meta641);
      
      return `691: ${value691} | 641: ${value641}`;
    } else {
      return formatValue(data['META Quality']);
    }
  };

  const StyledTableCell = ({ children, ...props }) => (
    <TableCell
      {...props}
      sx={{
        border: `1px solid ${theme.palette.divider}`,
        padding: '12px 16px',
        fontSize: '0.8rem',
        textAlign: 'center',
        verticalAlign: 'middle',
        backgroundColor: props.isHeader ? alpha(theme.palette.primary.main, 0.05) : '#ffffff',
        fontWeight: props.isHeader ? 600 : 400,
        minWidth: '120px',
        whiteSpace: 'nowrap',
        ...props.sx,
      }}
    >
      {children}
    </TableCell>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ mb: 3, boxShadow: theme.shadows[2] }}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <TableContainer component={Paper} sx={{ overflowX: 'auto', position: 'relative' }}>
            <Table sx={{ minWidth: 2270 }}>
              <TableHead>
                {/* Row 1: Main Title */}
                <TableRow>
                  <StyledTableCell 
                    colSpan={21} 
                    isHeader 
                    sx={{ 
                      fontSize: '1.1rem', 
                      fontWeight: 700,
                      backgroundColor: '#4A90E2',
                      color: 'white',
                      padding: '16px',
                    }}
                  >
                    Chatbots Evals -- {formatDisplayDate(selectedDate)}
                  </StyledTableCell>
                </TableRow>

                {/* Row 2: Main Categories */}
                <TableRow>
                  <StyledTableCell rowSpan={3} isHeader sx={{ 
                    fontWeight: 700, 
                    minWidth: '160px',
                    position: 'sticky',
                    left: 0,
                    zIndex: 3,
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    boxShadow: `2px 0 5px ${alpha(theme.palette.common.black, 0.1)}`
                  }}>
                    Chat Bot
                  </StyledTableCell>
                  <StyledTableCell colSpan={11} isHeader sx={{ fontWeight: 700, backgroundColor: '#4A90E2', color: 'white' }}>
                    Code-based Evals
                  </StyledTableCell>
                  <StyledTableCell colSpan={7} isHeader sx={{ fontWeight: 700, backgroundColor: '#FF8C42', color: 'white' }}>
                    LLM as a judge
                  </StyledTableCell>
                  <StyledTableCell colSpan={3} isHeader sx={{ fontWeight: 700, backgroundColor: '#26A69A', color: 'white' }}>
                    Human annotation
                  </StyledTableCell>
                </TableRow>

                {/* Row 3: Sub-categories */}
                <TableRow>
                  {/* Code-based Evals individual headers (cols 2-10) */}
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '120px', backgroundColor: '#4A90E2', color: 'white' }}>META Quality</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '140px', backgroundColor: '#4A90E2', color: 'white' }}>Spam warnings last 7 days</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '130px', backgroundColor: '#4A90E2', color: 'white' }}>LLM Model Used</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '100px', backgroundColor: '#4A90E2', color: 'white' }}>Cost ($)</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '160px', backgroundColor: '#4A90E2', color: 'white' }}>Chats supposed to be handled by bot (#)</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '140px', backgroundColor: '#4A90E2', color: 'white' }}>Fully handled by bot %</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '150px', backgroundColor: '#4A90E2', color: 'white' }}>Identical messages repeated</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '150px', backgroundColor: '#4A90E2', color: 'white' }}>
                    {new Date(selectedDate) >= new Date('2025-08-06') ? "50% Message similarity %" : "80% Message similarity %"}
                  </StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '120px', backgroundColor: '#4A90E2', color: 'white' }}>7D cohort - 3DW %</StyledTableCell>
                  
                  {/* Delays header (cols 10-11) */}
                  <StyledTableCell colSpan={2} isHeader sx={{ backgroundColor: '#4A90E2', color: 'white' }}>Delays (Secs)</StyledTableCell>
                  
                  {/* LLM as a judge individual headers (cols 12-13) */}
                  {/* <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '130px', backgroundColor: '#FF8C42', color: 'white' }}>Rule Breaking (%)</StyledTableCell> */}
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '140px', backgroundColor: '#FF8C42', color: 'white' }}>Sentiment Analysis (/5)</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '160px', backgroundColor: '#FF8C42', color: 'white' }}># Transfers due to client escalation</StyledTableCell>
                  
                  {/* Tools header (cols 15-16) */}
                  <StyledTableCell colSpan={2} isHeader sx={{ minWidth: '260px', backgroundColor: '#FF8C42', color: 'white' }}>Tools {'{Per tools supposed to be called}'}</StyledTableCell>
                  
                  {/* Policies header (cols 17-19) */}
                  <StyledTableCell colSpan={3} isHeader sx={{ minWidth: '390px', backgroundColor: '#FF8C42', color: 'white' }}>Policies {'{per chat}'}</StyledTableCell>
                  
                  {/* Human annotation individual headers (cols 20-22) */}
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '130px', backgroundColor: '#26A69A', color: 'white' }}>Chats shadowed %</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '130px', backgroundColor: '#26A69A', color: 'white' }}>Reported issues (#)</StyledTableCell>
                  <StyledTableCell rowSpan={2} isHeader sx={{ minWidth: '160px', backgroundColor: '#26A69A', color: 'white' }}>Issues pending to be solved (#)</StyledTableCell>
                </TableRow>

                {/* Row 4: Detailed sub-headers */}
                <TableRow>
                  {/* Delays sub-headers (cols 10-11) */}
                  <StyledTableCell isHeader sx={{ fontSize: '0.75rem', minWidth: '140px', backgroundColor: '#4A90E2', color: 'white' }}>
                    avg. Initial msg delays<br/>{'(excl. ">4 min")'}
                  </StyledTableCell>
                  <StyledTableCell isHeader sx={{ fontSize: '0.75rem', minWidth: '140px', backgroundColor: '#4A90E2', color: 'white' }}>
                    avg. Non-initial msg delays<br/>{'(excl. ">4 min")'}
                  </StyledTableCell>
                  
                  {/* Tools sub-headers (cols 15-16) */}
                  <StyledTableCell isHeader sx={{ fontSize: '0.75rem', minWidth: '130px', backgroundColor: '#FF8C42', color: 'white' }}>
                    Wrong tool called (%)
                  </StyledTableCell>
                  <StyledTableCell isHeader sx={{ fontSize: '0.75rem', minWidth: '130px', backgroundColor: '#FF8C42', color: 'white' }}>
                    Missed to be called (%)
                  </StyledTableCell>
                  
                  {/* Policies sub-headers (cols 17-19) */}
                  <StyledTableCell isHeader sx={{ fontSize: '0.75rem', minWidth: '130px', backgroundColor: '#FF8C42', color: 'white' }}>
                    Missing Policy (%)
                  </StyledTableCell>
                  <StyledTableCell isHeader sx={{ fontSize: '0.75rem', minWidth: '130px', backgroundColor: '#FF8C42', color: 'white' }}>
                    Unclear Policy (%)
                  </StyledTableCell>
                  <StyledTableCell isHeader sx={{ fontSize: '0.75rem', minWidth: '180px', backgroundColor: '#FF8C42', color: 'white' }}>
                    Transfers due to known missing flows or policies (%)
                  </StyledTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {summaryData.map(({ department, data }) => (
                  <TableRow key={department}>
                    <StyledTableCell sx={{ 
                      fontWeight: 600, 
                      textAlign: 'left', 
                      minWidth: '160px',
                      position: 'sticky',
                      left: 0,
                      zIndex: 2,
                      backgroundColor: '#ffffff',
                      borderRight: `2px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      boxShadow: `2px 0 5px ${alpha(theme.palette.common.black, 0.1)}`
                    }}>
                      {department}
                    </StyledTableCell>
                    
                                         {/* Code-based Evals columns */}
                     <StyledTableCell>{formatMetaQuality(data, department)}</StyledTableCell>
                     <StyledTableCell>{formatValue(data['Spam warnings last 7 days'])}</StyledTableCell>
                     <StyledTableCell>{formatValue(data['LLM Model used'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Cost'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Total Number of Chats'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Handling %'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Repetition %'])}</StyledTableCell>
                    <StyledTableCell>
                      {formatValue(data[new Date(selectedDate) >= new Date('2025-08-06') ? '50% similarity' : '80% similarity'])}
                    </StyledTableCell>
                    <StyledTableCell>{formatValue(data['7DR-3DW'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Avg Delay - Initial msg'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Avg Delay - non-initial msg'])}</StyledTableCell>
                    
                    {/* LLM as a judge columns */}
                    {/* <StyledTableCell>{formatValue(data['Rule Breaking'])}</StyledTableCell> */}
                    <StyledTableCell>{formatValue(data['Sentiment Analysis'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Transfers due to escalations'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Wrong tool called'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Missed to be called'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Missing policy'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Unclear policy'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Transfers due to known flows'])}</StyledTableCell>
                    
                    {/* Human annotation columns */}
                    <StyledTableCell>{formatValue(data['% chats shadowed'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Reported issue'])}</StyledTableCell>
                    <StyledTableCell>{formatValue(data['Issues pending to be solved'])}</StyledTableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AllChatbotsSummary; 