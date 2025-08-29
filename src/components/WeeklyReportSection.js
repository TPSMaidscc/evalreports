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

  // Get headers and data from dashboardData for loss of interest
  const lossOfInterestData = dashboardData.lossOfInterest || {};
  const headers = lossOfInterestData.headers || [];
  
  // Debug logging
  console.log('🔍 WeeklyReportSection Debug:');
  console.log('  - selectedDepartment:', selectedDepartment);
  console.log('  - lossOfInterestData:', lossOfInterestData);
  console.log('  - headers:', headers);
  console.log('  - headers[0]:', headers[0]);
  console.log('  - headers[2]:', headers[2]);
  
  // Extract title and date ranges from sheet headers
  const sheetTitle = headers[0] && headers[0][0] ? headers[0][0] : `${selectedDepartment} -- Loss of interest Report`;
  const prev1WeekRange = headers[2] && headers[2][5] ? headers[2][5] : ''; // F3
  const prev2WeekRange = headers[2] && headers[2][7] ? headers[2][7] : ''; // H3
  // Note: User specified H3 for both prev2WeekRange and prev3WeekRange, which seems like a typo
  // Using I3 (index 8) as a reasonable alternative for prev3WeekRange
  // TODO: Clarify with user which column should be used for prev3WeekRange
  const prev3WeekRange = headers[2] && headers[2][9] ? headers[2][9] : '';

  // Calculate current week range
  const endDate = new Date(new Date(selectedDate).getTime() + 6 * 24 * 60 * 60 * 1000);
  const currentWeekRange = headers[1] && headers[1][2] ? headers[1][2] : '';
  
  // Fallback date ranges if sheet headers are not available
  const fallbackPrev1WeekStart = new Date(new Date(selectedDate).getTime() - 7 * 24 * 60 * 60 * 1000);
  const fallbackPrev1WeekEnd = new Date(new Date(selectedDate).getTime() - 1 * 24 * 60 * 60 * 1000);
  const fallbackPrev1WeekRange = `${formatDisplayDate(fallbackPrev1WeekStart.toISOString().split('T')[0])} — ${formatDisplayDate(fallbackPrev1WeekEnd.toISOString().split('T')[0])}`;
  
  const fallbackPrev2WeekStart = new Date(new Date(selectedDate).getTime() - 14 * 24 * 60 * 60 * 1000);
  const fallbackPrev2WeekEnd = new Date(new Date(selectedDate).getTime() - 8 * 24 * 60 * 60 * 1000);
  const fallbackPrev2WeekRange = `${formatDisplayDate(fallbackPrev2WeekStart.toISOString().split('T')[0])} — ${formatDisplayDate(fallbackPrev2WeekEnd.toISOString().split('T')[0])}`;
  
  const fallbackPrev3WeekStart = new Date(new Date(selectedDate).getTime() - 21 * 24 * 60 * 60 * 1000);
  const fallbackPrev3WeekEnd = new Date(new Date(selectedDate).getTime() - 15 * 24 * 60 * 60 * 1000);
  const fallbackPrev3WeekRange = `${formatDisplayDate(fallbackPrev3WeekStart.toISOString().split('T')[0])} — ${formatDisplayDate(fallbackPrev3WeekEnd.toISOString().split('T')[0])}`;
  
  // Use sheet data if available, otherwise use fallback calculations
  const finalPrev1WeekRange = prev1WeekRange || fallbackPrev1WeekRange;
  const finalPrev2WeekRange = prev2WeekRange || fallbackPrev2WeekRange;
  const finalPrev3WeekRange = prev3WeekRange || fallbackPrev3WeekRange;
  
  console.log('  - sheetTitle:', sheetTitle);
  console.log('  - prev1WeekRange (from sheet):', prev1WeekRange);
  console.log('  - prev2WeekRange (from sheet):', prev2WeekRange);
  console.log('  - prev3WeekRange (from sheet):', prev3WeekRange);
  console.log('  - finalPrev1WeekRange:', finalPrev1WeekRange);
  console.log('  - finalPrev2WeekRange:', finalPrev2WeekRange);
  console.log('  - finalPrev3WeekRange:', finalPrev3WeekRange);
    
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
                      {finalPrev1WeekRange}
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
                      {finalPrev2WeekRange}
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
                  <Box sx={{ mb: 2, p: 1, backgroundColor: alpha(theme.palette.info.main, 0.05), borderRadius: 1 }}>
                    <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                      {finalPrev3WeekRange}
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

  // Mobile Card View for Loss of Interest Data
  const MobileLossOfInterestCard = ({ data }) => (
    <Box>
      {data.map((row, index) => (
        <Card key={index} sx={{ mb: 2, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={1}>
              {Object.entries(row).map(([key, value], cellIndex) => (
                <Box key={cellIndex} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: '40%' }}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>
                    {value || '-'}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>
      ))}
    </Box>
  );

  // Desktop Table View for Loss of Interest Data
  const DesktopLossOfInterestTable = ({ data, headers }) => (
    <TableContainer component={Paper} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
      <Table size="small">
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.8) }}>
            {headers.map((header, index) => (
              <TableCell 
                key={index}
                sx={{ 
                  fontWeight: 600,
                  color: 'white',
                  textAlign: 'center',
                  fontSize: '0.875rem'
                }}
              >
                {header.charAt(0).toUpperCase() + header.slice(1)}
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
              {headers.map((header, cellIndex) => (
                <TableCell 
                  key={cellIndex}
                  sx={{ 
                    textAlign: 'center',
                    fontSize: '0.875rem'
                  }}
                >
                  {row[header] || '-'}
                </TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell 
                colSpan={headers.length}
                sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}
              >
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );

  // Verbatim Loss of Interest table for AT departments
  const VerbatimLossOfInterestTable = ({ headers, rows }) => {
    const columnLetters = ['A','B','C','D','E','F','G','H','I','J','K','L','M'];
    const maxCols = Math.max(...[(headers || []).map(r => r.length), [columnLetters.length]].flat());

    return (
      <TableContainer component={Paper} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
        <Table size="small">
          <TableHead>
            {(headers || []).map((headerRow, rIdx) => (
              <TableRow key={rIdx} sx={{ backgroundColor: rIdx === 0 ? alpha(theme.palette.primary.main, 0.8) : alpha(theme.palette.primary.main, 0.05) }}>
                {Array.from({ length: maxCols }).map((_, cIdx) => (
                  <TableCell
                    key={cIdx}
                    sx={{
                      fontWeight: 600,
                      color: rIdx === 0 ? 'white' : 'inherit',
                      textAlign: 'center',
                      fontSize: '0.875rem'
                    }}
                  >
                    {(headerRow && headerRow[cIdx]) || ''}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {(rows || []).map((row, rIdx) => (
              <TableRow key={rIdx} sx={{ '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.main, 0.02) } }}>
                {Array.from({ length: maxCols }).map((_, cIdx) => {
                  const key = columnLetters[cIdx];
                  return (
                    <TableCell key={cIdx} sx={{ textAlign: 'center', fontSize: '0.875rem' }}>
                      {key ? (row?.[key] ?? '-') : '-'}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  // Desktop Table View with responsive headers
  const DesktopWeeklyReportTable = ({ data, isCC }) => {
    const colSpan = isCC ? 13 : 12;
    
    return (
      <TableContainer 
        component={Paper} 
        sx={{ 
          border: `1px solid black`,
          '& .MuiTableCell-root': {
            border: `1px solid ${alpha(theme.palette.divider, 0.3)}`,
            fontSize: '0.75rem',
            padding: '8px 4px',
          },
          '& .MuiTableCell-root.bold-border': {
            border: `1px solid black !important`
          },
          '& .MuiTableCell-root.column-border-left': {
            borderLeft: `1px solid black !important`
          },
          '& .MuiTableCell-root.column-border-right': {
            borderRight: `1px solid black !important`
          },
          '& .MuiTableCell-root.cell-border': {
            border: `1px solid black !important`
          }
        }}
      >
        <Table size="small">
          <TableHead>
            {/* Title Row */}
            <TableRow sx={{ backgroundColor: `#eb8800` }}>
              <TableCell 
                colSpan={colSpan}
                sx={{ 
                  textAlign: 'center', 
                  fontWeight: 'bold',
                  color: 'white',
                  fontSize: '0.875rem'
                }}
                className="bold-border"
              >
            {sheetTitle}
              </TableCell>
            </TableRow>

            {/* Section Headers Row */}
            <TableRow sx={{ backgroundColor: '#517bb8' }}>
          {isCC && (
                <TableCell 
                  rowSpan={3}
                  sx={{ 
                    textAlign: 'center',
                    fontWeight: 600,
                    color: 'white',
                    verticalAlign: 'middle'
                  }}
                  className="cell-border"
                >
                  Category
                </TableCell>
          )}
              <TableCell 
                rowSpan={3}
                sx={{ 
                  textAlign: 'center',
                  fontWeight: 600,
                  color: 'white',
                  verticalAlign: 'middle'
                }}
                className="column-border-left column-border-right"
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
                className="column-border-left column-border-right"
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
                className="column-border-left column-border-right"
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
                className="column-border-left column-border-right"
              >
            Best Metrics
              </TableCell>
            </TableRow>

            {/* Date Ranges Row */}
            <TableRow sx={{ backgroundColor: '#517bb8' }}>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }} className="column-border-left">
            Count
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            Lost Interest %
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }} className="column-border-right">
              7D cohort - 7DW %
              </TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }} className="column-border-left">
            {finalPrev1WeekRange}
              </TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }}>
            {finalPrev2WeekRange}
              </TableCell>
              <TableCell colSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }} className="column-border-right">
            {finalPrev3WeekRange}
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }} className="column-border-left">
            Lowest Lost Interest %
              </TableCell>
              <TableCell rowSpan={2} sx={{ textAlign: 'center', fontWeight: 600, color: 'white' }} className="column-border-right">
            Best 7D cohort - 7DW %
              </TableCell>
            </TableRow>

            {/* Column Headers Row */}
            <TableRow sx={{ backgroundColor: '#517bb8' }}>
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
                    className="cell-border"
                  >
                    {row.category || '-'}
                  </TableCell>
                )}
                <TableCell sx={{ 
                  textAlign: 'left', 
                  fontWeight: 500
                }}
                className="column-border-left column-border-right">
                  {isCC ? (row.B || row.inquiry || 'N/A') : (row.A || row.inquiry || 'N/A')}
                </TableCell>
                
                {/* Current week data */}
                <TableCell sx={{ textAlign: 'center' }} className="column-border-left">
                  {isCC ? (row.C || '-') : (row.B || '-')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }}>
                  {isCC ? (row.D || '-') : (row.C || '-')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center' }} className="column-border-right">
                  {isCC ? (row.E || '-') : (row.D || '-')}
                </TableCell>
                
                {/* Historical data */}
                {[...Array(6)].map((_, cellIndex) => (
                  <TableCell 
                    key={cellIndex} 
                    sx={{ textAlign: 'center' }}
                    className={cellIndex === 0 ? 'column-border-left' : cellIndex === 5 ? 'column-border-right' : ''}
                  >
                    {isCC ? 
                      (row[String.fromCharCode(70 + cellIndex)] || '-') : 
                      (row[String.fromCharCode(69 + cellIndex)] || '-')
                    }
                  </TableCell>
                ))}
                
                {/* Best metrics */}
                <TableCell sx={{ textAlign: 'center', color: 'success.main', fontWeight: 500 }} className="column-border-left">
                  {isCC ? (row.L || '-') : (row.K || '-')}
                </TableCell>
                <TableCell sx={{ textAlign: 'center', color: 'success.main', fontWeight: 500 }} className="column-border-right">
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
            Pending Development
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {/* Needs Last 30 days */}
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
    <Box>
      {!['AT Filipina', 'MaidsAT African', 'MaidsAT Ethiopian'].includes(selectedDepartment) && (
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
      )}

      {/* Loss of Interest Section - AT departments verbatim */}
      {['AT Filipina', 'MaidsAT African', 'MaidsAT Ethiopian'].includes(selectedDepartment) && (
        <Card 
          id="loss-of-interest"
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
                Loss of Interest
              </Typography>
            </Box>
            
            {(() => {
              // For AT departments, print dashboardData.lossOfInterest.headers and rows verbatim
              const headers = dashboardData.lossOfInterest?.headers || [];
              const rows = dashboardData.lossOfInterest?.data || [];
              
              if (!headers.length || rows.length === 0) {
                return (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 8, 
                    color: 'text.secondary',
                    background: alpha(theme.palette.info.main, 0.05),
                    borderRadius: 2,
                    border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
                  }}>
                    <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>⏳</Typography>
                    <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                      Data not available
                    </Typography>
                  </Box>
                );
              }
              
              return (
                <VerbatimLossOfInterestTable headers={headers} rows={rows} />
              );
            })()}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default WeeklyReportSection; 