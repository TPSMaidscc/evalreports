import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useTheme,
  alpha,
  useMediaQuery,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  Divider,
  Grid,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { formatDisplayDate } from '../utils/helpers';

const WeeklyReportSection = ({ selectedDepartment, selectedDate, dashboardData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg')); // Changed to lg because of complex table

  // Skip rendering for excluded departments
  if (['CC Resolvers', 'MV Resolvers', 'Delighters', 'Doctors'].includes(selectedDepartment)) {
    return null;
  }

  // Calculate date ranges
    const endDate = new Date(new Date(selectedDate).getTime() + 6 * 24 * 60 * 60 * 1000);
    const currentWeekRange = `${formatDisplayDate(selectedDate)} — ${formatDisplayDate(endDate.toISOString().split('T')[0])}`;
    
    const prev1WeekStart = new Date(new Date(selectedDate).getTime() - 7 * 24 * 60 * 60 * 1000);
    const prev1WeekEnd = new Date(new Date(selectedDate).getTime() - 1 * 24 * 60 * 60 * 1000);
    const prev1WeekRange = `${formatDisplayDate(prev1WeekStart.toISOString().split('T')[0])} — ${formatDisplayDate(prev1WeekEnd.toISOString().split('T')[0])}`;
    
    const prev2WeekStart = new Date(new Date(selectedDate).getTime() - 14 * 24 * 60 * 60 * 1000);
    const prev2WeekEnd = new Date(new Date(selectedDate).getTime() - 8 * 24 * 60 * 60 * 1000);
    const prev2WeekRange = `${formatDisplayDate(prev2WeekStart.toISOString().split('T')[0])} — ${formatDisplayDate(prev2WeekEnd.toISOString().split('T')[0])}`;
    
    const prev3WeekStart = new Date(new Date(selectedDate).getTime() - 21 * 24 * 60 * 60 * 1000);
    const prev3WeekEnd = new Date(new Date(selectedDate).getTime() - 15 * 24 * 60 * 60 * 1000);
    const prev3WeekRange = `${formatDisplayDate(prev3WeekStart.toISOString().split('T')[0])} — ${formatDisplayDate(prev3WeekEnd.toISOString().split('T')[0])}`;
    
  // Mobile Card View for Complex Table Data
  const MobileWeeklyReportCard = ({ data, isCC }) => (
    <Box>
      {data.map((row, index) => {
        const inquiry = isCC ? (row.B || row.inquiry || row.Inquiry) : (row.A || row.inquiry || row.Inquiry);
        const category = isCC ? (row.category || 'General') : null;

        return (
          <Accordion key={index} sx={{ mb: 1, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ width: '100%' }}>
                {isCC && category && (
                  <Chip 
                    label={category} 
                    size="small" 
                    sx={{ mb: 1, backgroundColor: alpha(theme.palette.primary.main, 0.1) }}
                  />
                )}
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {inquiry || 'N/A'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Tap to view details
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2}>
                {/* Current Week Data */}
                <Box>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                    Current Week ({currentWeekRange})
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Count:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {isCC ? (row.C || row.count || '-') : (row.B || row.count || '-')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Lost Interest %:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {isCC ? (row.D || row.droppedPercent || '-') : (row.C || row.droppedPercent || '-')}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">7D cohort - 7DW %:</Typography>
                      <Typography variant="body2" fontWeight={500}>
                        {isCC ? (row.E || row.cvr7days || '-') : (row.D || row.cvr7days || '-')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>

                <Divider />

                {/* Historical Data */}
                <Box>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                    Historical Data
                  </Typography>
                  
                  {/* Previous Week 1 */}
                  <Box sx={{ mb: 2, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                      {prev1WeekRange}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Lost Interest %:</Typography>
                        <Typography variant="body2">
                          {isCC ? (row.F || '-') : (row.E || '-')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">7D cohort - 7DW %:</Typography>
                        <Typography variant="body2">
                          {isCC ? (row.G || '-') : (row.F || '-')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Previous Week 2 */}
                  <Box sx={{ mb: 2, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                      {prev2WeekRange}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Lost Interest %:</Typography>
                        <Typography variant="body2">
                          {isCC ? (row.H || '-') : (row.G || '-')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">7D cohort - 7DW %:</Typography>
                        <Typography variant="body2">
                          {isCC ? (row.I || '-') : (row.H || '-')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Previous Week 3 */}
                  <Box sx={{ mb: 2, p: 2, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                      {prev3WeekRange}
                    </Typography>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">Lost Interest %:</Typography>
                        <Typography variant="body2">
                          {isCC ? (row.J || '-') : (row.I || '-')}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">7D cohort - 7DW %:</Typography>
                        <Typography variant="body2">
                          {isCC ? (row.K || '-') : (row.J || '-')}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                </Box>

                <Divider />

                {/* Best Metrics */}
                <Box>
                  <Typography variant="subtitle2" color="primary" sx={{ mb: 1, fontWeight: 600 }}>
                    Best Metrics
                  </Typography>
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Lowest Lost Interest %:</Typography>
                      <Typography variant="body2" fontWeight={500} color="success.main">
                        {isCC ? (row.L || '-') : (row.K || '-')}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Best 7D cohort - 7DW %:</Typography>
                      <Typography variant="body2" fontWeight={500} color="success.main">
                        {isCC ? (row.M || '-') : (row.L || '-')}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Stack>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );

  // Desktop Table View with responsive headers
  const DesktopWeeklyReportTable = ({ data, isCC }) => {
    const colSpan = isCC ? 13 : 12;
    
    return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          border: `1px solid ${alpha(theme.palette.divider, 0.2)}`,
          '& .MuiTableCell-root': {
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            fontSize: '0.75rem',
            padding: '8px 4px',
          }
        }}
      >
        <Table size="small">
          <TableHead>
            {/* Title Row */}
            <TableRow sx={{ backgroundColor: `${theme.palette.primary.main}` }}>
              <TableCell 
                colSpan={colSpan}
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
              >
            {selectedDepartment} -- Loss of interest Report -- {currentWeekRange}
              </TableCell>
            </TableRow>

            {/* Section Headers Row */}
            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.8) }}>
          {isCC && (
                <TableCell 
                  rowSpan={3}
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 600,
                    color: 'white',
                    verticalAlign: 'middle'
                  }}
                >
                  Category
                </TableCell>
          )}
              <TableCell 
                rowSpan={3}
                sx={{ 
                  textAlign: 'left',
                  fontWeight: 600,
                  color: 'white',
                  verticalAlign: 'middle'
                }}
              >
            Inquiry
              </TableCell>
              <TableCell 
                colSpan={3}
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'white'
                }}
              >
            {currentWeekRange}
              </TableCell>
              <TableCell 
                colSpan={6}
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'white'
                }}
              >
            Historical Data
              </TableCell>
              <TableCell 
                colSpan={2}
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'white'
                }}
              >
            Best Metrics
              </TableCell>
            </TableRow>

            {/* Date Ranges Row */}
            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.8) }}>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            Count
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            Lost Interest %
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
              7D cohort - 7DW %
              </TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            {prev1WeekRange}
              </TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            {prev2WeekRange}
              </TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            {prev3WeekRange}
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            Lowest Lost Interest %
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            Best 7D cohort - 7DW %
              </TableCell>
            </TableRow>

            {/* Column Headers Row */}
            <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.8) }}>
              {[...Array(6)].map((_, index) => (
                <TableCell 
                  key={index}
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 600,
                    color: 'white'
                  }}
                >
                  {index % 2 === 0 ? 'Lost Interest %' : '7D cohort - 7DW %'}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.length > 0 ? data.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.main, 0.02) },
                  '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) }
                }}
              >
                {isCC && row.isFirstInGroup && (
                  <TableCell 
                    rowSpan={row.categorySpan}
                    sx={{ 
                      textAlign: 'center',
                      fontWeight: 600,
                      backgroundColor: alpha(theme.palette.grey[100], 0.5),
                      verticalAlign: 'middle'
                    }}
                  >
                    {row.category || '-'}
                  </TableCell>
                )}
                <TableCell sx={{ textAlign: 'left', fontWeight: 500 }}>
                  {isCC ? (row.B || row.inquiry || 'N/A') : (row.A || row.inquiry || 'N/A')}
                </TableCell>
                
                {/* Current week data */}
                <TableCell sx={{ textAlign: 'center' }}>
                  {isCC ? (row.C || '-') : (row.B || '-')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {isCC ? (row.D || '-') : (row.C || '-')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {isCC ? (row.E || '-') : (row.D || '-')}
                </TableCell>
                
                {/* Historical data */}
                {[...Array(6)].map((_, cellIndex) => (
                  <TableCell key={cellIndex} sx={{ textAlign: 'center' }}>
                    {isCC ? 
                      (row[String.fromCharCode(70 + cellIndex)] || '-') : 
                      (row[String.fromCharCode(69 + cellIndex)] || '-')
                    }
                  </TableCell>
                ))}
                
                {/* Best metrics */}
                <TableCell sx={{ textAlign: 'center', color: 'success.main', fontWeight: 500 }}>
                  {isCC ? (row.L || '-') : (row.K || '-')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'success.main', fontWeight: 500 }}>
                  {isCC ? (row.M || '-') : (row.L || '-')}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell 
                  colSpan={colSpan}
                  sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}
                >
                  No data available for this date and department
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderWeeklyReportContent = () => {
    if (['CC Sales', 'MV Sales'].includes(selectedDepartment)) {
    const isCC = selectedDepartment === 'CC Sales';
      const rawData = dashboardData.lossOfInterest?.data || [];
    
      if (rawData.length === 0) {
    return (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            color: 'text.secondary',
            background: alpha(theme.palette.info.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>📊</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              No data available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              for this date and department
            </Typography>
          </Box>
        );
      }

      let processedData = rawData;

                if (isCC) {
        // Process CC Sales data with category grouping
        processedData = [];
                  let currentCategory = '';
                  
        rawData.forEach((row, index) => {
                    if (row.A && row.A.toString().trim() !== '') {
                      currentCategory = row.A.toString().trim();
                    }
                    
                    processedData.push({
                      ...row,
                      category: currentCategory,
                      originalIndex: index
                    });
                  });
                  
        // Add grouping info
                  const groupedData = [];
                  let lastCategory = '';
                  let groupStartIndex = 0;
                  
                  processedData.forEach((row, index) => {
                    const isNewGroup = row.category !== lastCategory;
                    
                    if (isNewGroup) {
                      if (groupedData.length > 0) {
                        const groupSize = index - groupStartIndex;
                        for (let i = groupStartIndex; i < index; i++) {
                          groupedData[i].categorySpan = groupSize;
                        }
                      }
                      groupStartIndex = index;
                      lastCategory = row.category;
                    }
                    
                    groupedData.push({
                      ...row,
                      isFirstInGroup: isNewGroup,
            categorySpan: 1
                    });
                  });
                  
                  if (groupedData.length > 0) {
                    const groupSize = groupedData.length - groupStartIndex;
                    for (let i = groupStartIndex; i < groupedData.length; i++) {
                      groupedData[i].categorySpan = groupSize;
                    }
                  }
                  
        processedData = groupedData;
      }

      if (isMobile) {
        return <MobileWeeklyReportCard data={processedData} isCC={isCC} />;
                } else {
        return <DesktopWeeklyReportTable data={processedData} isCC={isCC} />;
      }
    } 
    
    else if (['MaidsAT African', 'MaidsAT Ethiopian'].includes(selectedDepartment)) {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: 'text.secondary',
          background: alpha(theme.palette.warning.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
        }}>
          <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>⏳</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            Pending development
          </Typography>
        </Box>
      );
    } 
    
    else if (selectedDepartment === 'AT Filipina') {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: 'text.secondary',
          background: alpha(theme.palette.warning.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
        }}>
          <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>⏳</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            Pending business team
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Needs Till 24 July
          </Typography>
        </Box>
      );
    } 
    
    else {
      return (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: 'text.secondary',
          background: alpha(theme.palette.info.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
        }}>
          <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>📊</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            Data not available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Needs 1 week
          </Typography>
        </Box>
      );
    }
  };

  return (
    <Card 
      id="weekly-report"
      sx={{ 
        mb: 3,
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2, 
          mb: 3,
          flexDirection: { xs: 'column', sm: 'row' },
          textAlign: { xs: 'center', sm: 'left' }
        }}>
          <AssessmentIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Weekly Report
          </Typography>
        </Box>
      {renderWeeklyReportContent()}
      </CardContent>
    </Card>
  );
};

export default WeeklyReportSection; 