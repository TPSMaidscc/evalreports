import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Paper,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  TableChart as TableChartIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';
import { fetchLLMCostData, fetchLLMCostSummary, fetchLLMCostTable } from '../services/googleSheets';

const LLMCostAnalysis = ({ selectedDate }) => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Format date for display (e.g., "17 August 2025")
  const formatDisplayDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      return dateString; // Fallback to original string if parsing fails
    }
  };
  const [costData, setCostData] = useState({
    totalCost: [],
    modelData: [],
    categoryData: [],
    detailedModelData: [],
    detailedCategoryData: [],
    detailedChatbotData: {
      sales: [],
      resolvers: [],
      medical: [],
      otherChatbots: []
    }
  });

  const [summaryData, setSummaryData] = useState({
    totalCostToday: { cost: 0, percentage: null, trend: null },
    totalCostThisMonth: { cost: 0, percentage: null, trend: null },
    totalCostLast30Days: { cost: 0, percentage: null, trend: null },
    totalCostLastMonth: { cost: 0, percentage: null, trend: null },
    forecastedCostThisMonth: { cost: 0, percentage: null, trend: null }
  });

  const [tableData, setTableData] = useState({
    headers: [],
    rows: []
  });

  // Enhanced colors for charts - more variety and better contrast
  const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#8884D8', '#82CA9D', '#FFC658', '#FF7C7C',
    '#8DD1E1', '#D084D0', '#87D068', '#FFA940',
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'
  ];

  // Fetch data from Google Sheets
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Import the service functions dynamically
        const { fetchLLMCostData, fetchLLMCostSummary, fetchLLMCostTable } = await import('../services/googleSheets');

        // Fetch cost data, summary data, and table data
        const [costDataResult, summaryDataResult, tableDataResult] = await Promise.all([
          fetchLLMCostData(selectedDate),
          fetchLLMCostSummary(selectedDate),
          fetchLLMCostTable(selectedDate)
        ]);

        setCostData(costDataResult);
        setSummaryData(summaryDataResult);
        setTableData(tableDataResult);

      } catch (error) {
        console.error('Error fetching LLM cost data:', error);
        // Show user-friendly message instead of technical error details
        setError('Data not available yet for this date. Please try again later or select a different date.');
      } finally {
        setLoading(false);
      }
    };

    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate]);

  // Custom tooltip for line chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {label}
          </Typography>
          {payload.map((entry, index) => (
            <Typography key={index} variant="body2" sx={{ color: entry.color }}>
              {entry.name}: ${entry.value.toFixed(2)}
            </Typography>
          ))}
        </Paper>
      );
    }
    return null;
  };

  // Custom tooltip for pie charts
  const PieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Paper sx={{ p: 2, border: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {data.name}
          </Typography>
          <Typography variant="body2">
            Percentage: {data.value}%
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Card sx={{
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
        }}>
          <CardContent sx={{
            textAlign: 'center',
            py: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>📊</Typography>
            <Typography variant="h5" sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              mb: 1
            }}>
              LLM Cost Analysis - {formatDisplayDate(selectedDate)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1, color: 'text.secondary' }}>
              Data not available yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please try again later or select a different date
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography
          variant="h3"
          sx={{
            mb: 4,
            fontWeight: 'bold',
            textAlign: 'center',
            background: 'linear-gradient(45deg, #0088FE 30%, #00C49F 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
           LLM Cost Analysis - {formatDisplayDate(selectedDate)}
        </Typography>

        {/* LLM Cost Summary Section */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
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
                LLM Cost Summary
              </Typography>
            </Box>

            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {/* Total Cost For Today */}
              <Grid item xs={12} sm={6} lg={2.4}>
                <Box sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                  border: '1px solid #e0e0e0',
                
                }}>
                  {/* Header */}
                  <Box sx={{
                    background: '#4a69bd',
                    color: 'white',
                    p: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      Total Cost For Today
                    </Typography>
                  </Box>

                  {/* Value Section */}
                  <Box sx={{
                    background: summaryData.totalCostToday.trend === 'increase'
                      ? '#e74c3c'
                      : summaryData.totalCostToday.trend === 'decrease'
                      ? '#27ae60'
                      : '#f8f9fa',
                    color: summaryData.totalCostToday.trend ? 'white' : '#333',
                    p: 2,
                    textAlign: 'center',
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem'
                      }}
                    >
                      ${summaryData.totalCostToday.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {summaryData.totalCostToday.percentage !== null && (
                        <span style={{ fontSize: '1rem', marginLeft: '8px' }}>
                          ({summaryData.totalCostToday.percentage >= 0 ? '+' : ''}{summaryData.totalCostToday.percentage.toFixed(2)}%)
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Total Cost For This Month */}
              <Grid item xs={12} sm={6} lg={2.4}>
                <Box sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                  border: '1px solid #e0e0e0'
                }}>
                  {/* Header */}
                  <Box sx={{
                    background: '#4a69bd',
                    color: 'white',
                    p: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      Total Cost For This Month
                    </Typography>
                  </Box>

                  {/* Value Section */}
                  <Box sx={{
                    background: summaryData.totalCostThisMonth.trend === 'increase'
                      ? '#e74c3c'
                      : summaryData.totalCostThisMonth.trend === 'decrease'
                      ? '#27ae60'
                      : '#f8f9fa',
                    color: summaryData.totalCostThisMonth.trend ? 'white' : '#333',
                    p: 2,
                    textAlign: 'center',
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem'
                      }}
                    >
                      ${summaryData.totalCostThisMonth.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {summaryData.totalCostThisMonth.percentage !== null && (
                        <span style={{ fontSize: '1rem', marginLeft: '8px' }}>
                          ({summaryData.totalCostThisMonth.percentage >= 0 ? '+' : ''}{summaryData.totalCostThisMonth.percentage.toFixed(2)}%)
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Total Cost For Last 30 Days */}
              <Grid item xs={12} sm={6} lg={2.4}>
                <Box sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                  border: '1px solid #e0e0e0'
                }}>
                  {/* Header */}
                  <Box sx={{
                    background: '#4a69bd',
                    color: 'white',
                    p: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      Total Cost For Last 30 Days
                    </Typography>
                  </Box>

                  {/* Value Section */}
                  <Box sx={{
                    background: summaryData.totalCostLast30Days.trend === 'increase'
                      ? '#e74c3c'
                      : summaryData.totalCostLast30Days.trend === 'decrease'
                      ? '#27ae60'
                      : '#f8f9fa',
                    color: summaryData.totalCostLast30Days.trend ? 'white' : '#333',
                    p: 2,
                    textAlign: 'center',
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem'
                      }}
                    >
                      ${summaryData.totalCostLast30Days.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {summaryData.totalCostLast30Days.percentage !== null && (
                        <span style={{ fontSize: '1rem', marginLeft: '8px' }}>
                          ({summaryData.totalCostLast30Days.percentage >= 0 ? '+' : ''}{summaryData.totalCostLast30Days.percentage.toFixed(2)}%)
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Total Cost For Last Month */}
              <Grid item xs={12} sm={6} lg={2.4}>
                <Box sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                  border: '1px solid #e0e0e0'
                }}>
                  {/* Header */}
                  <Box sx={{
                    background: '#4a69bd',
                    color: 'white',
                    p: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      Total Cost For Last Month
                    </Typography>
                  </Box>

                  {/* Value Section */}
                  <Box sx={{
                    background: summaryData.totalCostLastMonth.trend === 'increase'
                      ? '#e74c3c'
                      : summaryData.totalCostLastMonth.trend === 'decrease'
                      ? '#27ae60'
                      : '#f8f9fa',
                    color: summaryData.totalCostLastMonth.trend ? 'white' : '#333',
                    p: 2,
                    textAlign: 'center',
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem'
                      }}
                    >
                      ${summaryData.totalCostLastMonth.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {summaryData.totalCostLastMonth.percentage !== null && (
                        <span style={{ fontSize: '1rem', marginLeft: '8px' }}>
                          ({summaryData.totalCostLastMonth.percentage >= 0 ? '+' : ''}{summaryData.totalCostLastMonth.percentage.toFixed(2)}%)
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>

              {/* Forecasted Cost For This Month */}
              <Grid item xs={12} sm={6} lg={2.4}>
                <Box sx={{
                  borderRadius: 1,
                  overflow: 'hidden',
                  boxShadow: theme.shadows[2],
                  border: '1px solid #e0e0e0'
                }}>
                  {/* Header */}
                  <Box sx={{
                    background: '#4a69bd',
                    color: 'white',
                    p: 1.5,
                    textAlign: 'center'
                  }}>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      Forecasted Cost For This Month
                    </Typography>
                  </Box>

                  {/* Value Section */}
                  <Box sx={{
                    background: summaryData.forecastedCostThisMonth.trend === 'increase'
                      ? '#e74c3c'
                      : summaryData.forecastedCostThisMonth.trend === 'decrease'
                      ? '#27ae60'
                      : '#f8f9fa',
                    color: summaryData.forecastedCostThisMonth.trend ? 'white' : '#333',
                    p: 2,
                    textAlign: 'center',
                    minHeight: 80,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 'bold',
                        fontSize: '1.4rem'
                      }}
                    >
                      ${summaryData.forecastedCostThisMonth.cost.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      {summaryData.forecastedCostThisMonth.percentage !== null && (
                        <span style={{ fontSize: '1rem', marginLeft: '8px' }}>
                          ({summaryData.forecastedCostThisMonth.percentage >= 0 ? '+' : ''}{summaryData.forecastedCostThisMonth.percentage.toFixed(2)}%)
                        </span>
                      )}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* LLM Cost Table Section */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <TableChartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                LLM Cost Table
              </Typography>
            </Box>

            {tableData.rows.length > 0 ? (
              <>
              
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: theme.shadows[1], border: '1px solid #ddd' }}>
                <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="LLM cost table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Provider
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Model
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        CC Resolvers
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        MV Resolvers
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        MV Sales
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        CC Sales
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Delighters
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Doctors
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Maids AT
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Other Chatbots
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Devs
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        ERP Usage
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Analytics
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Testing
                      </TableCell>
                      <TableCell sx={{
                        fontWeight: 'bold',
                        color: 'white',
                        backgroundColor: '#4472C4',
                        border: '1px solid #ddd',
                        textAlign: 'center',
                        fontSize: '0.875rem',
                        py: 1
                      }}>
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableData.rows.map((row, index) => {
                      // Helper function to format display values
                      const formatValue = (value) => {
                        if (!value || value === '' || value === '-') return '-';
                        return value;
                      };



                      // Helper function to get cell background color for Total row
                      const getTotalCellColor = (value) => {
                        if (!row.isTotal || !value || value === '-') {
                          if (row.isTotal) {
                            console.log(`🎨 getTotalCellColor: No color for value "${value}" (isTotal: ${row.isTotal})`);
                          }
                          return 'transparent';
                        }

                        const valueStr = value.toString();
                        console.log(`🎨 getTotalCellColor: Processing value "${valueStr}"`);

                        if (valueStr.includes('(') && valueStr.includes(')')) {
                          const percentageMatch = valueStr.match(/\(([+-]?\d+%)\)/);
                          if (percentageMatch) {
                            const percentage = percentageMatch[1];
                            console.log(`🎨 Found percentage: "${percentage}"`);

                            if (percentage.startsWith('-')) {
                              console.log(`🟢 Returning GREEN for negative: ${percentage}`);
                              return '#d4edda'; // Light green for negative (decrease)
                            } else if (percentage.startsWith('+')) {
                              console.log(`🔴 Returning RED for positive: ${percentage}`);
                              return '#f8d7da'; // Light red for positive (increase)
                            }
                          }
                        }
                        console.log(`🔵 Returning BLUE default for Total row`);
                        return '#e8f4fd'; // Default blue for Total row
                      };

                      // Check if this is one of the last two rows
                      const isLastTwoRows = index >= tableData.rows.length - 2;

                      // Debug logging for last two rows
                      if (isLastTwoRows) {
                        console.log(`🔍 Row ${index} Debug:`, {
                          index,
                          totalRows: tableData.rows.length,
                          isLastTwoRows,
                          provider: row.provider,
                          model: row.model,
                          isTotal: row.isTotal,
                          isPrompts: row.isPrompts,
                          rowData: row
                        });
                      }

                      // Calculate rowspan for provider cell
                      const getProviderRowSpan = () => {
                        // For last two rows, merge Provider and Model into one cell (colSpan=2)
                        if (isLastTwoRows) {
                          return 1; // Single row span, but will use colSpan=2
                        }

                        if (!row.provider || row.isTotal || row.isPrompts) return 1;

                        let span = 1;
                        for (let i = index + 1; i < tableData.rows.length; i++) {
                          const nextRow = tableData.rows[i];
                          if (nextRow.currentProvider === row.currentProvider && !nextRow.provider) {
                            span++;
                          } else {
                            break;
                          }
                        }
                        return span;
                      };

                      // Check if this row should skip provider cell (part of merged group)
                      const shouldSkipProviderCell = () => {
                        // For last two rows, we need to handle them specially
                        if (isLastTwoRows) {
                          // Only render the merged cell for the first occurrence (when we haven't skipped it yet)
                          return false; // Always render for last two rows
                        }

                        if (row.provider || row.isTotal || row.isPrompts) return false;

                        // Check if previous row has the same provider and has provider cell
                        for (let i = index - 1; i >= 0; i--) {
                          const prevRow = tableData.rows[i];
                          if (prevRow.currentProvider === row.currentProvider) {
                            if (prevRow.provider) return true;
                            continue;
                          } else {
                            break;
                          }
                        }
                        return false;
                      };

                      // Check if this row should skip model cell (merged with provider for last two rows)
                      const shouldSkipModelCell = () => {
                        // For last two rows, skip model cell as it's merged with provider
                        return isLastTwoRows;
                      };

                      // Determine row styling based on type
                      const getRowStyle = () => {
                        if (row.isTotal || row.isPrompts) {
                          return {
                            backgroundColor: '#e8f4fd', // Light blue for both Total and Prompts
                            fontWeight: 'bold'
                          };
                        }
                        return {
                          backgroundColor: 'white'
                        };
                      };

                      const rowSpan = getProviderRowSpan();
                      const skipProviderCell = shouldSkipProviderCell();
                      const skipModelCell = shouldSkipModelCell();

                      // Debug logging for cell rendering
                      if (isLastTwoRows) {
                        console.log(`🔍 Row ${index} Cell Rendering:`, {
                          index,
                          isLastTwoRows,
                          skipProviderCell,
                          skipModelCell,
                          rowSpan,
                          provider: row.provider,
                          model: row.model,
                          isTotal: row.isTotal,
                          isPrompts: row.isPrompts
                        });
                      }

                      return (
                        <TableRow
                          key={index}
                          sx={{
                            ...getRowStyle(),
                            '&:hover': { backgroundColor: '#f8f9fa' }
                          }}
                        >
                          {(() => {
                            // For last two rows, always render the merged cell regardless of skipProviderCell logic
                            if (isLastTwoRows) {
                              const content = row.isTotal ? 'Total' : 'Prompts Input Tokens';
                              console.log(`📱 Rendering Merged Cell for Row ${index}:`, content, 'colSpan: 2');
                              return (
                                <TableCell
                                  colSpan={2}
                                  sx={{
                                    border: '1px solid #ddd',
                                    fontWeight: 'bold',
                                    backgroundColor: '#e8f4fd',
                                    textAlign: 'center',
                                    fontSize: '0.875rem',
                                    py: 1,
                                    verticalAlign: 'middle'
                                  }}
                                >
                                  {content}
                                </TableCell>
                              );
                            }

                            // For normal rows, use the original logic
                            if (!skipProviderCell) {
                              return (
                                <TableCell
                                  rowSpan={rowSpan}
                                  sx={{
                                    border: '1px solid #ddd',
                                    fontWeight: 'normal',
                                    backgroundColor: row.provider ? '#f8f9fa' : 'transparent',
                                    textAlign: 'center',
                                    fontSize: '0.875rem',
                                    py: 1,
                                    verticalAlign: 'middle'
                                  }}
                                >
                                  {row.provider}
                                </TableCell>
                              );
                            }
                            return null;
                          })()}
                          {!skipModelCell && (
                            <TableCell
                              sx={{
                                border: '1px solid #ddd',
                                color: '#333',
                                textAlign: 'center',
                                fontSize: '0.875rem',
                                py: 1,
                                backgroundColor: row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent',
                                fontWeight: row.isTotal || row.isPrompts ? 'bold' : 'normal',
                                verticalAlign: 'middle'
                              }}
                            >
                              {formatValue(row.model)}
                            </TableCell>
                          )}
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.ccResolvers) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.ccResolvers)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.mvResolvers) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.mvResolvers)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.mvSales) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.mvSales)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.ccSales) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.ccSales)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.delighters) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.delighters)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.doctors) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.doctors)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.maidsAt) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.maidsAt)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.otherChatbots) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.otherChatbots)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.devs) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.devs)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.erpUsage) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.erpUsage)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.analytics) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.analytics)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.testing) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.testing)}
                          </TableCell>
                          <TableCell sx={{
                            border: '1px solid #ddd',
                            fontWeight: row.isTotal || row.isPrompts ? 'bold' : 'normal',
                            color: '#333',
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            py: 1,
                            backgroundColor: getTotalCellColor(row.total) || (row.isTotal || row.isPrompts ? '#e8f4fd' : 'transparent')
                          }}>
                            {formatValue(row.total)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
              </>
            ) : (
              <Typography variant="body1" sx={{ textAlign: 'center', color: '#666', py: 4 }}>
                No LLM cost data available for this date.
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Total Cost Section */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
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
                Total Cost
              </Typography>
            </Box>
            <Box sx={{ height: 400 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={costData.totalCost}>
                  <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                  <XAxis 
                    dataKey="date" 
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                  />
                  <YAxis 
                    stroke={theme.palette.text.secondary}
                    fontSize={12}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="actualCost"
                    stroke="#0088FE"
                    strokeWidth={3}
                    name="Actual Cost"
                    dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="forecastedCost"
                    stroke="#00C49F"
                    strokeWidth={3}
                    name="Forecasted Cost"
                    dot={{ fill: '#00C49F', strokeWidth: 2, r: 4 }}
                    connectNulls={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>

        {/* LLM Cost per Model and Category Section */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
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
                LLM Cost per Model and Category
              </Typography>
            </Box>
            
            {/* Cost Breakdown by Model */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' ,textAlign: 'center',}}>
              Cost Breakdown by Model
            </Typography>
            <Box sx={{ width: '100%', mb: 6 }}>
              <Grid container spacing={1} sx={{ width: '100%', display: 'flex' }}>
                {/* Model Pie Chart */}
                <Grid item xs={6} sx={{ display: 'flex', flex: 1 }}>
                  <Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    height: 550,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                      Cost Breakdown 
                    </Typography>
                    <Box sx={{ flex: 1, width: '100%', minHeight: 480 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costData.modelData}
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            innerRadius={50}
                            fill="#8884d8"
                            dataKey="percentage"
                            nameKey="model"
                            label={({ model, percentage }) => `${model}: ${percentage}%`}
                            labelLine={{
                              stroke: theme.palette.text.secondary,
                              strokeWidth: 1
                            }}
                            fontSize={11}
                          >
                            {costData.modelData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            labelStyle={{ color: theme.palette.text.primary }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={50}
                            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>

                {/* Model Bar Chart */}
                <Grid item xs={6} sx={{ display: 'flex', flex: 1 }}>
                  <Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    height: 550,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                      Cost Distribution 
                    </Typography>
                    <Box sx={{ flex: 1, width: '100%', minHeight: 480 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={costData.modelData}
                          margin={{ top: 20, right: 15, left: 15, bottom: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                          <XAxis
                            dataKey="model"
                            stroke={theme.palette.text.secondary}
                            fontSize={11}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis
                            stroke={theme.palette.text.secondary}
                            fontSize={11}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip
                            formatter={(value) => [`$${value}`, 'Cost']}
                            labelStyle={{ color: theme.palette.text.primary }}
                          />
                          <Bar
                            dataKey="cost"
                            fill="#0088FE"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>

            {/* Cost Breakdown by Category */}
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' ,textAlign: 'center'}}>
              Cost Breakdown by Category
            </Typography>
            <Box sx={{ width: '100%' }}>
              <Grid container spacing={1} sx={{ width: '100%', display: 'flex' }}>
                {/* Category Pie Chart */}
                <Grid item xs={6} sx={{ display: 'flex', flex: 1 }}>
                  <Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    height: 550,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                      Cost Breakdown 
                    </Typography>
                    <Box sx={{ flex: 1, width: '100%', minHeight: 480 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={costData.categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={140}
                            innerRadius={50}
                            fill="#8884d8"
                            dataKey="percentage"
                            nameKey="category"
                            label={({ category, percentage }) => `${category}: ${percentage}%`}
                            labelLine={{
                              stroke: theme.palette.text.secondary,
                              strokeWidth: 1
                            }}
                            fontSize={11}
                          >
                            {costData.categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[(index + costData.modelData.length) % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip
                            formatter={(value, name) => [`${value}%`, name]}
                            labelStyle={{ color: theme.palette.text.primary }}
                          />
                          <Legend
                            verticalAlign="bottom"
                            height={50}
                            wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>

                {/* Category Bar Chart */}
                <Grid item xs={6} sx={{ display: 'flex', flex: 1 }}>
                  <Paper sx={{
                    p: 2,
                    borderRadius: 2,
                    height: 550,
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1
                  }}>
                    <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                      Cost Distribution 
                    </Typography>
                    <Box sx={{ flex: 1, width: '100%', minHeight: 480 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={costData.categoryData}
                          margin={{ top: 20, right: 15, left: 15, bottom: 80 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                          <XAxis
                            dataKey="category"
                            stroke={theme.palette.text.secondary}
                            fontSize={11}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                            interval={0}
                          />
                          <YAxis
                            stroke={theme.palette.text.secondary}
                            fontSize={11}
                            tickFormatter={(value) => `$${value}`}
                          />
                          <Tooltip
                            formatter={(value) => [`$${value}`, 'Cost']}
                            labelStyle={{ color: theme.palette.text.primary }}
                          />
                          <Bar
                            dataKey="cost"
                            fill="#00C49F"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </CardContent>
        </Card>

        {/* Detailed LLM Cost per Model Section - Separate Card */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              mb: 3,
              flexDirection: { xs: 'column', sm: 'row' },
              textAlign: { xs: 'center', sm: 'left' }
            }}>
              <TableChartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', md: '1.5rem' }
                }}
              >
                Detailed LLM Cost per Model
              </Typography>
            </Box>

            {/* First Row */}
            <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
              {/* OpenAI Chart */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    OpenAI
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedModelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="openai"
                          stroke="#0088FE"
                          strokeWidth={3}
                          name="OpenAI"
                          dot={{ fill: '#0088FE', strokeWidth: 2, r: 4 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Anthropic Chart */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Anthropic
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedModelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="anthropic"
                          stroke="#00C49F"
                          strokeWidth={3}
                          name="Anthropic"
                          dot={{ fill: '#00C49F', strokeWidth: 2, r: 4 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Second Row */}
            <Grid container spacing={2} sx={{ width: '100%' }}>
              {/* Gemini Chart */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Gemini
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedModelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="gemini"
                          stroke="#FFBB28"
                          strokeWidth={3}
                          name="Gemini"
                          dot={{ fill: '#FFBB28', strokeWidth: 2, r: 4 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              {/* Other Models Chart */}
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Other Models
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedModelData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="otherModels"
                          stroke="#FF8042"
                          strokeWidth={3}
                          name="Other Models"
                          dot={{ fill: '#FF8042', strokeWidth: 2, r: 4 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Detailed LLM Cost per Category Section - Separate Card */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
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
                Detailed LLM Cost per Category
              </Typography>
            </Box>

            {/* First Row - CC Resolvers, MV Resolvers, MV Sales, CC Sales */}
            <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    CC Resolvers
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="ccResolvers"
                          stroke="#0088FE"
                          strokeWidth={2}
                          name="CC Resolvers"
                          dot={{ fill: '#0088FE', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    MV Resolvers
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="mvResolvers"
                          stroke="#00C49F"
                          strokeWidth={2}
                          name="MV Resolvers"
                          dot={{ fill: '#00C49F', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    MV Sales
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="mvSales"
                          stroke="#FFBB28"
                          strokeWidth={2}
                          name="MV Sales"
                          dot={{ fill: '#FFBB28', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    CC Sales
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="ccSales"
                          stroke="#FF8042"
                          strokeWidth={2}
                          name="CC Sales"
                          dot={{ fill: '#FF8042', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Second Row - Delighters, Doctors, Maids At, Other Chatbots */}
            <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Delighters
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="delighters"
                          stroke="#8884D8"
                          strokeWidth={2}
                          name="Delighters"
                          dot={{ fill: '#8884D8', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Doctors
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="doctors"
                          stroke="#82CA9D"
                          strokeWidth={2}
                          name="Doctors"
                          dot={{ fill: '#82CA9D', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Maids At
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="maidsAt"
                          stroke="#FFC658"
                          strokeWidth={2}
                          name="Maids At"
                          dot={{ fill: '#FFC658', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Other Chatbots
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="otherChatbots"
                          stroke="#FF7C7C"
                          strokeWidth={2}
                          name="Other Chatbots"
                          dot={{ fill: '#FF7C7C', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Third Row - Developers, ERP, Analytics, Testing */}
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Developers
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="developers"
                          stroke="#8DD1E1"
                          strokeWidth={2}
                          name="Developers"
                          dot={{ fill: '#8DD1E1', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    ERP
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="erp"
                          stroke="#D084D0"
                          strokeWidth={2}
                          name="ERP"
                          dot={{ fill: '#D084D0', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Analytics
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="analytics"
                          stroke="#87D068"
                          strokeWidth={2}
                          name="Analytics"
                          dot={{ fill: '#87D068', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={6} lg={3} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 350,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Testing
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 270 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedCategoryData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={10}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="testing"
                          stroke="#FFA940"
                          strokeWidth={2}
                          name="Testing"
                          dot={{ fill: '#FFA940', strokeWidth: 1, r: 3 }}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Detailed LLM Cost per Chatbot Section - Separate Card */}
        <Card sx={{
          mb: 4,
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        }}>
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
                Detailed LLM Cost per Chatbot
              </Typography>
            </Box>

            {/* Row 1 - Sales: CC Sales, MV Sales */}
            <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    CC Sales
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.sales}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="ccSales"
                          stroke="#0088FE"
                          strokeWidth={3}
                          name="CC Sales"
                          dot={costData.detailedChatbotData.sales.length <= 12 ? { fill: '#0088FE', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    MV Sales
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.sales}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="mvSales"
                          stroke="#00C49F"
                          strokeWidth={3}
                          name="MV Sales"
                          dot={costData.detailedChatbotData.sales.length <= 12 ? { fill: '#00C49F', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Row 2 - Resolvers: CC Resolvers, MV Resolvers */}
            <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    CC Resolvers
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.resolvers}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="ccResolvers"
                          stroke="#FFBB28"
                          strokeWidth={3}
                          name="CC Resolvers"
                          dot={costData.detailedChatbotData.resolvers.length <= 12 ? { fill: '#FFBB28', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    MV Resolvers
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.resolvers}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="mvResolvers"
                          stroke="#FF8042"
                          strokeWidth={3}
                          name="MV Resolvers"
                          dot={costData.detailedChatbotData.resolvers.length <= 12 ? { fill: '#FF8042', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Row 3 - Medical: Doctors, Maids At */}
            <Grid container spacing={2} sx={{ width: '100%', mb: 3 }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Doctors
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.medical}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="doctors"
                          stroke="#8884D8"
                          strokeWidth={3}
                          name="Doctors"
                          dot={costData.detailedChatbotData.medical.length <= 12 ? { fill: '#8884D8', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Maids At
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.medical}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="maidsAt"
                          stroke="#82CA9D"
                          strokeWidth={3}
                          name="Maids At"
                          dot={costData.detailedChatbotData.medical.length <= 12 ? { fill: '#82CA9D', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Row 4 - Other: Delighters, Other Chatbots */}
            <Grid container spacing={2} sx={{ width: '100%' }}>
              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Delighters
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.otherChatbots}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="delighters"
                          stroke="#FFC658"
                          strokeWidth={3}
                          name="Delighters"
                          dot={costData.detailedChatbotData.otherChatbots.length <= 12 ? { fill: '#FFC658', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6} sx={{ display: 'flex', flex: 1 }}>
                <Paper sx={{
                  p: 2,
                  borderRadius: 2,
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1
                }}>
                  <Typography variant="subtitle1" sx={{ mb: 2, textAlign: 'center', fontWeight: 'medium' }}>
                    Other Chatbots
                  </Typography>
                  <Box sx={{ flex: 1, width: '100%', minHeight: 320 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={costData.detailedChatbotData.otherChatbots}>
                        <CartesianGrid strokeDasharray="3 3" stroke={alpha(theme.palette.divider, 0.3)} />
                        <XAxis
                          dataKey="date"
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                        />
                        <YAxis
                          stroke={theme.palette.text.secondary}
                          fontSize={11}
                          tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="otherChatbots"
                          stroke="#FF7C7C"
                          strokeWidth={3}
                          name="Other Chatbots"
                          dot={costData.detailedChatbotData.otherChatbots.length <= 12 ? { fill: '#FF7C7C', strokeWidth: 2, r: 4 } : false}
                          connectNulls={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default LLMCostAnalysis;
