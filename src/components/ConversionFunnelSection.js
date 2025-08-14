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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { formatDisplayDate } from '../utils/helpers';

const ConversionFunnelSection = ({ selectedDepartment, selectedDate, dashboardData }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Skip rendering for excluded departments
  if (['CC Resolvers', 'MV Resolvers', 'Delighters', 'Doctors'].includes(selectedDepartment)) {
    return null;
  }

  // Mobile Card View for Table Data
  const MobileTableCard = ({ data, title, headers = [] }) => (
    <Box sx={{ mb: 2 }}>
      {title && (
        <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
          {title}
        </Typography>
      )}
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

  // Desktop Table View
  const DesktopTable = ({ data, title, headers = [] }) => (
    <TableContainer component={Paper} sx={{ mb: 3, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
      {title && (
        <Box sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          p: 2,
          textAlign: 'center'
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      )}
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.light, 0.8) }}>
            {(headers.length > 0 ? headers : (data.length > 0 ? Object.keys(data[0]) : [])).map((header, index) => (
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
              {Object.values(row).map((value, cellIndex) => (
                <TableCell 
                  key={cellIndex} 
                  sx={{ 
                    textAlign: cellIndex === 0 ? 'left' : 'center',
                    fontWeight: cellIndex === 0 ? 600 : 400,
                    fontSize: '0.875rem'
                  }}
                >
                  {value || '-'}
                </TableCell>
              ))}
            </TableRow>
          )) : (
            <TableRow>
              <TableCell 
                colSpan={headers.length || (data.length > 0 ? Object.keys(data[0]).length : 1)} 
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

  // Complex Sales Funnel Table for CC Sales and MV Sales
  const SalesFunnelTable = ({ funnelData }) => {
    if (!funnelData || funnelData.type !== 'salesFunnel') {
      return null;
    }

    const { department, headerRow1, headerRow2, dataRows } = funnelData;
    
    // Extract date headers from headerRow2 - they should be the first 7 elements after the first 2 columns
    const dateHeaders = headerRow2.slice(2, 9) || ['Jul 23', 'Jul 22', 'Jul 21', 'Jul 20', 'Jul 19', 'Jul 18', 'Jul 17'];
    
    console.log('Extracted date headers:', dateHeaders);
    console.log('Header row 2 full:', headerRow2);
    
    // Process hierarchical data structure for merging main categories
    const processHierarchicalData = (rows) => {
      const processedRows = [];
      let i = 0;
      
      while (i < rows.length) {
        const currentRow = rows[i];
        const mainCategory = currentRow[0];
        const subCategory = currentRow[1];
        
        // If first column has content, this is a main category
        if (mainCategory && mainCategory.toString().trim() !== '') {
          // Count how many subcategories follow this main category
          let subCategoryCount = 0;
          let j = i + 1;
          
          // Look ahead to count subcategories (rows where first column is empty but second has content)
          while (j < rows.length) {
            const nextRow = rows[j];
            const nextMain = nextRow[0];
            const nextSub = nextRow[1];
            
            if ((!nextMain || nextMain.toString().trim() === '') && nextSub && nextSub.toString().trim() !== '') {
              subCategoryCount++;
              j++;
            } else {
              break;
            }
          }
          
          console.log(`Main category "${mainCategory}" has ${subCategoryCount} subcategories`);
          
          // Add the main category row with rowSpan
          processedRows.push({
            data: currentRow,
            isMainCategory: true,
            rowSpan: Math.max(1, subCategoryCount + 1), // +1 for the main category itself
            subCategoryCount: subCategoryCount
          });
          
          // Add the subcategory rows
          for (let k = 1; k <= subCategoryCount; k++) {
            const subRow = rows[i + k];
            if (subRow) {
              console.log(`Adding subcategory row: "${subRow[1]}" under "${mainCategory}"`);
              processedRows.push({
                data: subRow,
                isSubCategory: true,
                hideMainCategory: true // Don't render the first column for subcategories
              });
            }
          }
          
          i += subCategoryCount + 1;
        } else {
          // This is a standalone row or we couldn't determine the structure
          processedRows.push({
            data: currentRow,
            isMainCategory: true,
            rowSpan: 1,
            subCategoryCount: 0
          });
          i++;
        }
      }
      
      console.log('Processed hierarchical data:', processedRows);
      return processedRows;
    };
    
    const processedDataRows = processHierarchicalData(dataRows);
    
    // Debug the final structure
    console.log('=== FINAL PROCESSED DATA STRUCTURE ===');
    processedDataRows.forEach((row, index) => {
      console.log(`Row ${index}:`, {
        type: row.isMainCategory ? 'MAIN' : 'SUB',
        rowSpan: row.rowSpan || 'N/A',
        firstCol: row.data[0],
        secondCol: row.data[1],
        isMainCategory: row.isMainCategory,
        isSubCategory: row.isSubCategory,
        dataLength: row.data.length
      });
    });
    console.log('=== END STRUCTURE DEBUG ===');

    return (
      <Box>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 3, 
            fontWeight: 600, 
            color: 'text.primary',
            textAlign: 'center',
            fontSize: '1.1rem'
          }}
        >
          {department} Summary Table
        </Typography>
        
        <TableContainer component={Paper} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}`, overflowX: 'auto' }}>
          <Table size="small" sx={{ minWidth: 1200 }}>
            {/* Complex Multi-Row Headers */}
            <TableHead>
              {/* First Header Row */}
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableCell 
                  rowSpan={2}
                  colSpan={2}
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    border: `1px solid ${theme.palette.divider}`,
                    minWidth: 350,
                    fontSize: '0.8rem'
                  }}
                >
                  Applicant Stage
                </TableCell>
                
                {/* Entered the Knowledge Base Last 7 days - 7 columns */}
                <TableCell 
                  colSpan={7}
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: alpha(theme.palette.secondary.main, 0.1),
                    fontSize: '0.8rem'
                  }}
                >
                  Entered the Knowledge Base Last 7 days
                </TableCell>
                
                {/* Average columns - each merged with row below (rowSpan 2) */}
                <TableCell 
                  rowSpan={2}
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    border: `1px solid ${theme.palette.divider}`,
                    minWidth: 100,
                    fontSize: '0.75rem'
                  }}
                >
                  Avg. last 7 days
                </TableCell>
                <TableCell 
                  rowSpan={2}
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    border: `1px solid ${theme.palette.divider}`,
                    minWidth: 100,
                    fontSize: '0.75rem'
                  }}
                >
                  Avg. previous 7 days
                </TableCell>
                <TableCell 
                  rowSpan={2}
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    border: `1px solid ${theme.palette.divider}`,
                    minWidth: 100,
                    fontSize: '0.75rem'
                  }}
                >
                  Avg. previous previous 7 days
                </TableCell>
                <TableCell 
                  rowSpan={2}
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    border: `1px solid ${theme.palette.divider}`,
                    minWidth: 100,
                    fontSize: '0.75rem'
                  }}
                >
                  Avg. last 30 days
                </TableCell>
                
                {/* Funnel Performance - merged and centered over 3 columns */}
                <TableCell 
                  colSpan={3}
                  sx={{ 
                    fontWeight: 700, 
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundColor: alpha(theme.palette.warning.main, 0.1),
                    fontSize: '0.8rem'
                  }}
                >
                  Funnel Performance
                </TableCell>
              </TableRow>
              
              {/* Second Header Row */}
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                {/* Daily columns - use actual headers from sheet */}
                {dateHeaders.map((day, index) => (
                  <TableCell 
                    key={index}
                    sx={{ 
                      fontWeight: 600, 
                      textAlign: 'center',
                      border: `1px solid ${theme.palette.divider}`,
                      fontSize: '0.75rem',
                      minWidth: 60
                    }}
                  >
                    {day || `Day ${index + 1}`}
                  </TableCell>
                ))}
                
                {/* Funnel Performance sub-headers - these go under "Funnel Performance" */}
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.75rem',
                    minWidth: 80
                  }}
                >
                  7 day Date range
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.75rem',
                    minWidth: 80
                  }}
                >
                  Funnel Threshold
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    textAlign: 'center',
                    border: `1px solid ${theme.palette.divider}`,
                    fontSize: '0.75rem',
                    minWidth: 80
                  }}
                >
                  Max. Conv. Window
                </TableCell>
              </TableRow>
            </TableHead>
            
            {/* Data Rows */}
            <TableBody>
              {processedDataRows.map((row, index) => (
                <TableRow 
                  key={index}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.main, 0.02) },
                    '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) }
                  }}
                >
                  {/* Render cells based on whether this is a main category or subcategory */}
                  {row.isMainCategory && (
                    /* Main category - render first column with rowSpan */
                    <TableCell 
                      rowSpan={row.rowSpan}
                      sx={{ 
                        border: `1px solid ${theme.palette.divider}`,
                        fontSize: '0.75rem',
                        py: 1,
                        px: 1.5,
                        fontWeight: 600,
                        verticalAlign: 'middle',
                        textAlign: 'center',
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }}
                    >
                      {row.data[0] || '-'}
                    </TableCell>
                  )}
                  
                  {/* Second column and beyond */}
                  {row.data.map((cell, cellIndex) => {
                    // Skip first column for subcategories (it's merged with main category)
                    if (cellIndex === 0 && row.isSubCategory) {
                      return null;
                    }
                    
                    // Skip first column for main categories (already rendered above)
                    if (cellIndex === 0 && row.isMainCategory) {
                      return null;
                    }
                    
                    return (
                      <TableCell 
                        key={cellIndex}
                        sx={{ 
                          border: `1px solid ${theme.palette.divider}`,
                          fontSize: '0.75rem',
                          py: 1,
                          px: 1.5,
                          ...(cellIndex === 1 ? { 
                            paddingLeft: row.isSubCategory ? 3 : 1.5, 
                            fontStyle: row.isSubCategory ? 'italic' : 'normal',
                            color: row.isSubCategory ? 'text.secondary' : 'text.primary',
                            fontWeight: row.isSubCategory ? 400 : 500
                          } : {})
                        }}
                      >
                        {cell || '-'}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  };

  // Get the funnel data
  const renderFunnelContent = () => {
    // Handle CC Sales and MV Sales with complex table structure
    if (selectedDepartment === 'CC Sales' || selectedDepartment === 'MV Sales') {
      const funnelData = dashboardData.funnel;
      console.log(`${selectedDepartment} funnel data:`, funnelData);
      
      if (funnelData && funnelData.type === 'salesFunnel') {
        return <SalesFunnelTable funnelData={funnelData} />;
      } else {
        return (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            color: 'text.secondary',
            background: alpha(theme.palette.warning.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>📊</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
              No funnel data available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Check the sheet for date {selectedDate}
            </Typography>
          </Box>
        );
      }
    } 
    
    else if (selectedDepartment === 'AT Filipina') {
      console.log('AT Filipina funnel data:', dashboardData.funnel);
      console.log('Type of funnel data:', typeof dashboardData.funnel);
      console.log('Is array:', Array.isArray(dashboardData.funnel));
      
      // Handle both array and object formats
      let funnelData = dashboardData.funnel || {};
      let outsideUAEData = [];
      let philippinesData = [];
      
      if (Array.isArray(funnelData)) {
        // If it's an array, it means the data wasn't processed correctly or wasn't fetched
        console.log('Funnel data is an array, possibly not fetched');
        outsideUAEData = [];
        philippinesData = [];
      } else if (funnelData.outsideUAE || funnelData.philippines) {
        // If it's an object with the expected properties
        outsideUAEData = funnelData.outsideUAE || [];
        philippinesData = funnelData.philippines || [];
      }
      
      console.log('Outside UAE data:', outsideUAEData);
      console.log('Philippines data:', philippinesData);
      
      const headers = ['Metric (From)', 'Value', 'Denominator', '%', 'Date Range', '% Last Month', 'Window'];

      // Always show both sections if there's any data
      if (outsideUAEData.length > 0 || philippinesData.length > 0) {
        if (isMobile) {
          return (
            <Box>
              {outsideUAEData.length > 0 && (
                <MobileTableCard 
                  data={outsideUAEData} 
                  title="Conversion Report - Filipinas - Outside UAE"
                />
              )}
              {philippinesData.length > 0 && (
                <MobileTableCard 
                  data={philippinesData} 
                  title="Conversion Report - Filipinas - Philippines"
                />
              )}
            </Box>
          );
        } else {
          return (
            <Box>
              {outsideUAEData.length > 0 && (
                <DesktopTable 
                  data={outsideUAEData} 
                  title="Conversion Report - Filipinas - Outside UAE"
                  headers={headers}
                />
              )}
              {philippinesData.length > 0 && (
                <DesktopTable 
                  data={philippinesData} 
                  title="Conversion Report - Filipinas - Philippines" 
                  headers={headers}
                />
              )}
            </Box>
          );
        }
      }

      // If no data at all, fall through to show empty table
      if (isMobile) {
        return <MobileTableCard data={[]} title="Conversion Report - AT Filipina" />;
      } else {
        return <DesktopTable data={[]} title="Conversion Report - AT Filipina" headers={headers} />;
      }
    } 
    
    else if (selectedDepartment === 'MaidsAT African' || selectedDepartment === 'MaidsAT Ethiopian') {
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
          Pending New Chatbot to go Live
          </Typography>
       
        </Box>
      );
    } 
    
    else {
      // For other departments - show the funnel if available
      const data = dashboardData.funnel || [];
      
      if (isMobile) {
        return <MobileTableCard data={data} />;
      } else {
        return <DesktopTable data={data} />;
      }
    }
  };

  return (
    <Card 
      id="conversion-funnel"
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
          <TrendingUpIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Conversion Funnel
          </Typography>
        </Box>
      {renderFunnelContent()}
      </CardContent>
    </Card>
  );
};

export default ConversionFunnelSection; 