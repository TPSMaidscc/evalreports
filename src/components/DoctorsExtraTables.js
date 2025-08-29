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
import { useEffect, useState } from 'react';
import { fetchTableBySheetName } from '../services/googleSheets';

const CLINIC_RECOMMENDATION_SHEET_ID = '1xFSfzL82Cdg3vV5jKlgzsaqsXds0AHftKTglPeuO0qo';
// No longer using a fixed GID; fetch by date-specific sheet name instead

const INTERVENTION_ANALYSIS_SHEET_ID = '1igr9_hHgg2736wqgb9H0gfHPTMKV3I4Es5h7YlEktcs';

const DataTable = ({ title, rows, emptyMessage = null, centerAlign = false }) => {
  const theme = useTheme();

  const headers = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

  return (
    <Card 
      sx={{ 
        borderRadius: 2,
        boxShadow: theme.shadows[2],
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>{title}</Typography>
        {(!rows || rows.length === 0) && emptyMessage ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            color: 'text.secondary',
            background: alpha(theme.palette.info.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>📊</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {emptyMessage}
            </Typography>
          </Box>
        ) : (
        <TableContainer component={Paper} sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.2)}` }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.grey[50], 1) }}>
                {headers.map((h, idx) => (
                  <TableCell 
                    key={idx} 
                    align={centerAlign ? 'center' : undefined}
                    sx={{ 
                      fontWeight: 600, 
                      color: 'text.secondary', 
                      textTransform: 'uppercase', 
                      fontSize: '0.75rem', 
                      letterSpacing: '0.5px',
                      ...(centerAlign ? { textAlign: 'center', verticalAlign: 'middle' } : {})
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => (
                <TableRow key={i} sx={{ '&:nth-of-type(odd)': { backgroundColor: alpha(theme.palette.primary.main, 0.02) }, '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.04) } }}>
                  {headers.map((h, j) => (
                    <TableCell 
                      key={j} 
                      align={centerAlign ? 'center' : undefined}
                      sx={{ fontSize: '0.875rem', ...(centerAlign ? { textAlign: 'center', verticalAlign: 'middle' } : {}) }}
                    >
                      {row[h]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

const DoctorsExtraTables = ({ selectedDate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [clinicRows, setClinicRows] = useState([]);
  const [interventionRows, setInterventionRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const dateSheetName = `${new Date(selectedDate).toISOString().split('T')[0]}-summary`;
        const [clinic, intervention] = await Promise.all([
          // For Clinic Recommendation Reason, load the date-specific "YYYY-MM-DD-summary" tab
          fetchTableBySheetName(
            CLINIC_RECOMMENDATION_SHEET_ID,
            dateSheetName
          ),
          // For Intervention Analysis, load the date-specific "YYYY-MM-DD-summary" tab
          fetchTableBySheetName(
            INTERVENTION_ANALYSIS_SHEET_ID,
            dateSheetName
          )
        ]);
        if (isMounted) {
          setClinicRows(Array.isArray(clinic) ? clinic : []);
          setInterventionRows(Array.isArray(intervention) ? intervention : []);
        }
      } catch (e) {
        if (isMounted) {
          setClinicRows([]);
          setInterventionRows([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [selectedDate]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary', border: `1px dashed ${alpha(theme.palette.primary.main, 0.3)}`, borderRadius: 2 }}>
        <Typography variant="body2">Loading tables…</Typography>
      </Box>
    );
  }

  if ((!clinicRows || clinicRows.length === 0) && (!interventionRows || interventionRows.length === 0)) {
    return (
      <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary', background: alpha(theme.palette.warning.main, 0.05), border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`, borderRadius: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>No data available</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: { xs: 2, md: 3 } }}>
        <DataTable title="Intervention Analysis" rows={interventionRows} centerAlign={true} />
        <DataTable title="Clinic Recommendation Reason" rows={clinicRows} centerAlign={true} />
      </Box>
    </Box>
  );
};

export default DoctorsExtraTables;


