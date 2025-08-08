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
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Gavel as GavelIcon,
} from '@mui/icons-material';

const RuleBreakingSection = ({ dashboardData, selectedDepartment }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Show PIL messages for all departments
  const shouldShowDoctorsPILMessage = selectedDepartment === 'Doctors';
  const shouldShowGeneralPILMessage = selectedDepartment !== 'Doctors';
  
  // Departments that should show "Pending new chatbot to go live"
  const newChatbotDepartments = ['MaidsAT African', 'MaidsAT Ethiopian', 'Delighters', 'CC Resolvers'];
  const shouldShowNewChatbotMessage = newChatbotDepartments.includes(selectedDepartment);

  // Mobile Card View for Table Data
  const MobileTableCard = ({ data, title }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
        {title}
      </Typography>
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
  const DesktopTable = ({ data, title }) => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: 'text.primary' }}>
        {title}
      </Typography>
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
                    letterSpacing: '0.5px'
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
                      py: 2
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
    </Box>
  );

  const hasOverallViolations = dashboardData.ruleBreaking.overallViolations.length > 0;
  const hasRuleBreakdown = dashboardData.ruleBreaking.ruleBreakdown.length > 0;
  const hasData = hasOverallViolations || hasRuleBreakdown;

  return (
    <Card 
      id="rule-breaking"
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
          <GavelIcon sx={{ color: 'primary.main', fontSize: 28 }} />
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Rule Breaking
          </Typography>
        </Box>

        {/* Show "Removed based on PIL request" for Doctors */}
        {shouldShowDoctorsPILMessage ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            color: 'text.secondary',
            background: alpha(theme.palette.info.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
          }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>📋</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, fontStyle: 'italic' }}>
              Removed based on PIL request
            </Typography>
          </Box>
        ) : shouldShowGeneralPILMessage ? (
          <Box sx={{ 
            textAlign: 'center', 
            py: 8, 
            color: 'text.secondary',
            background: alpha(theme.palette.warning.main, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`
          }}>
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>⏳</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, fontStyle: 'italic' }}>
              {shouldShowNewChatbotMessage ? 'Pending new chatbot to go live' : 'Pending PIL to prompt'}
            </Typography>
          </Box>
        ) : hasData ? (
          <Box>
            {/* Overall Violations Table */}
            {hasOverallViolations && (
              <>
                {isMobile ? (
                  <MobileTableCard 
                    data={dashboardData.ruleBreaking.overallViolations} 
                    title="Overall Violations"
                  />
                ) : (
                  <DesktopTable 
                    data={dashboardData.ruleBreaking.overallViolations} 
                    title="Overall Violations"
                  />
                )}
              </>
            )}

            {/* Rule Breakdown Table */}
            {hasRuleBreakdown && (
              <>
                {isMobile ? (
                  <MobileTableCard 
                    data={dashboardData.ruleBreaking.ruleBreakdown} 
                    title="Rule Breakdown"
                  />
                ) : (
                  <DesktopTable 
                    data={dashboardData.ruleBreaking.ruleBreakdown} 
                    title="Rule Breakdown"
                  />
                )}
              </>
            )}
          </Box>
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
            <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>⏳</Typography>
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {shouldShowNewChatbotMessage ? 'Pending new chatbot to go live' : 'Pending prompt (due 17 July)'}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default RuleBreakingSection; 