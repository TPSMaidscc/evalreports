import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  useTheme,
  alpha,
  styled,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  MenuBook as MenuBookIcon,
  Assessment as AssessmentIcon,
  Description as DescriptionIcon,
  Functions as FunctionsIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  boxShadow: 'none',
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  borderRadius: '16px !important',
  overflow: 'hidden',
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.02)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`,
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
    boxShadow: theme.shadows[4],
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

const DefinitionsSection = ({ definitions }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleChange = (event, isExpanded) => {
    setExpanded(isExpanded);
  };

  // Group definitions by eval type for better organization
  const groupedDefinitions = definitions.reduce((groups, item) => {
    const evalType = item.eval || 'General';
    if (!groups[evalType]) {
      groups[evalType] = [];
    }
    groups[evalType].push(item);
    return groups;
  }, {});

  const getEvalIcon = (evalType) => {
    switch (evalType.toLowerCase()) {
      case 'code-based':
        return <AssessmentIcon sx={{ color: theme.palette.primary.main }} />;
      case 'llm-as-a-judge':
        return <MenuBookIcon sx={{ color: theme.palette.secondary.main }} />;
      case 'human annotation':
        return <DescriptionIcon sx={{ color: theme.palette.success.main }} />;
      default:
        return <FunctionsIcon sx={{ color: theme.palette.info.main }} />;
    }
  };

  const getEvalColor = (evalType) => {
    switch (evalType.toLowerCase()) {
      case 'code-based':
        return theme.palette.primary.main;
      case 'llm-as-a-judge':
        return theme.palette.secondary.main;
      case 'human annotation':
        return theme.palette.success.main;
      default:
        return theme.palette.info.main;
    }
  };

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Box sx={{ mb: 4 }}>
        <StyledAccordion expanded={expanded} onChange={handleChange}>
          <StyledAccordionSummary
            expandIcon={
              <motion.div
                animate={{ rotate: expanded ? 180 : 0 }}
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
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
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
                  {expanded ? 'Click to collapse' : 'Click to view detailed metric definitions and formulas'}
                </Typography>
              </Box>

              <Chip
                label={`${definitions.length} metrics`}
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
              {expanded && (
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
                          <StyledTableHeadCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <AssessmentIcon sx={{ mr: 1, fontSize: 16 }} />
                              Evaluation Type
                            </Box>
                          </StyledTableHeadCell>
                          <StyledTableHeadCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <MenuBookIcon sx={{ mr: 1, fontSize: 16 }} />
                              Metric
                            </Box>
                          </StyledTableHeadCell>
                          <StyledTableHeadCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <DescriptionIcon sx={{ mr: 1, fontSize: 16 }} />
                              Description
                            </Box>
                          </StyledTableHeadCell>
                          <StyledTableHeadCell>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <FunctionsIcon sx={{ mr: 1, fontSize: 16 }} />
                              Formula
                            </Box>
                          </StyledTableHeadCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
              {definitions.map((item, index) => (
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
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {getEvalIcon(item.eval)}
                                <Chip
                                  label={item.eval}
                                  size="small"
                                  variant="outlined"
                                  sx={{
                                    ml: 1,
                                    borderColor: alpha(getEvalColor(item.eval), 0.3),
                                    color: getEvalColor(item.eval),
                                    background: alpha(getEvalColor(item.eval), 0.05),
                                    fontWeight: 500,
                                    fontSize: '0.75rem',
                                  }}
                                />
                              </Box>
                            </StyledTableCell>
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
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontFamily: 'monospace',
                                  fontSize: '0.75rem',
                                  background: alpha(theme.palette.grey[500], 0.1),
                                  px: 1,
                                  py: 0.5,
                                  borderRadius: 1,
                                  color: 'text.secondary',
                                }}
                              >
                                {item.formula}
                              </Typography>
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
  );
};

export default DefinitionsSection; 