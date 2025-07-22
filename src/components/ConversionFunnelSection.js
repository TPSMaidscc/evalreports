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

  const renderFunnelContent = () => {
    if (selectedDepartment === 'CC Sales') {
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
    
    else if (selectedDepartment === 'MV Sales') {
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
            Pending Business Team
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Needs till 28 July
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