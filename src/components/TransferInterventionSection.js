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
  Stack,
} from '@mui/material';
import {
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { getCurrentDateRawTabName, getSelectedDateRawTabName } from '../utils/helpers';
import { getSheetIdForDateTab } from '../services/googleSheets';

const TransferInterventionSection = ({ dashboardData, selectedDepartment, selectedDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sheetId, setSheetId] = React.useState(null);
  const [isLoadingSheetId, setIsLoadingSheetId] = React.useState(false);

  // Function to get sheet ID for selected date tab
  const fetchSheetId = React.useCallback(async () => {
    if (sheetId) return; // Already fetched
    
    setIsLoadingSheetId(true);
    try {
      const selectedDateTabName = getSelectedDateRawTabName(selectedDate);
   
      
      const id = await getSheetIdForDateTab(selectedDateTabName);
  
      
      if (id) {
        setSheetId(id);
      
      } else {
        console.warn('No sheet ID received for tab:', selectedDateTabName);
      }
    } catch (error) {
      console.error('Error fetching sheet ID:', error);
    } finally {
      setIsLoadingSheetId(false);
    }
  }, [sheetId, selectedDate]);

  // Fetch sheet ID on component mount and when selectedDate changes
  React.useEffect(() => {
    fetchSheetId();
  }, [fetchSheetId, selectedDate]);

  // Only show for MV Resolvers
  if (selectedDepartment !== 'MV Resolvers') {
    return null;
  }

  // Mobile Card View for Table Data
  const MobileTableCard = ({ data }) => (
    <Box sx={{ mb: 2 }}>
      {data.map((row, index) => (
        <Card key={index} sx={{ mb: 2, border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
          <CardContent sx={{ p: 2 }}>
            <Stack spacing={1}>
              {Object.entries(row).map(([key, value], cellIndex) => (
                <Box key={cellIndex} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: '40%' }}>
                    {key}:
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
  const DesktopTable = ({ data }) => (
    <TableContainer component={Paper} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: alpha(theme.palette.grey[50], 1) }}>
            {data.length > 0 && Object.keys(data[0]).map((header, index) => (
              <TableCell 
                key={index} 
                sx={{ 
                  fontWeight: 600, 
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                  fontSize: '0.75rem',
                  letterSpacing: '0.5px',
                  textAlign: index === 0 ? 'left' : 'center'
                }}
              >
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
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
                    fontSize: '0.875rem',
                    py: 2,
                    textAlign: cellIndex === 0 ? 'left' : 'center'
                  }}
                >
                  {value || '-'}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const hasData = dashboardData.transferIntervention && dashboardData.transferIntervention.length > 0;

  return (
    <Card 
      id="transfer-intervention"
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
          <SwapHorizIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
                         <a 
               href={sheetId 
                 ? `https://docs.google.com/spreadsheets/d/1hJUaSX75lgtKY8tnqzWVXF7MXUBGhlltTiHBu_xSM10/edit#gid=${sheetId}`
                 : `https://docs.google.com/spreadsheets/d/1hJUaSX75lgtKY8tnqzWVXF7MXUBGhlltTiHBu_xSM10/edit#gid=0`
               }
               target="_blank"
               rel="noopener noreferrer"
               style={{
                 color: theme.palette.primary.main,
                 textDecoration: 'none',
                 cursor: 'pointer',
                 transition: 'all 0.2s ease-in-out',
                 '&:hover': {
                   color: theme.palette.primary.dark
                 }
               }}
                               title={sheetId 
                  ? `Click to open Transfer and intervention analysis spreadsheet directly to ${getSelectedDateRawTabName(selectedDate)} tab`
                  : `Click to open Transfer and intervention analysis spreadsheet. Look for the tab: ${getSelectedDateRawTabName(selectedDate)}`
                }
               onClick={!sheetId ? fetchSheetId : undefined}
             >
                             Transfer and intervention analysis
               <span style={{ fontStyle: 'italic', fontSize: '0.85em', marginLeft: 8, textDecoration: 'underline' }}>
                 (click for raw data)
               </span>
               {isLoadingSheetId && (
                 <span style={{ marginLeft: '8px', fontSize: '0.8em', opacity: 0.7 }}>
                   🔄
                 </span>
               )}
             </a>
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              fontSize: '0.75rem',
              fontStyle: 'italic',
              mt: 1,
              textAlign: 'center'
            }}
          >
             
          </Typography>
        </Box>

        {hasData ? (
          <>
            {isMobile ? (
              <MobileTableCard data={dashboardData.transferIntervention} />
            ) : (
              <DesktopTable data={dashboardData.transferIntervention} />
            )}
          </>
        ) : (
          /* No data message */
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            color: 'text.secondary',
            background: alpha(theme.palette.warning.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>📊</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              No transfer and intervention data available
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default TransferInterventionSection; 