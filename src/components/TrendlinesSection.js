import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  useTheme,
  alpha,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import StackedSubplots, { createChartData } from './StackedSubplots';
import { dashboardConfig } from '../utils/constants';

const TrendlinesSection = ({ selectedDepartment, dashboardData }) => {
  const theme = useTheme();
  
  // State for 7DMA toggles
  const [toggles, setToggles] = useState({
    totalChats: false,
    cvr: false,
    repetition: false,
    botHandled: false,
    delays: false,
    sentiment: false
  });

  const handleToggleChange = (chartType) => {
    setToggles(prev => ({
      ...prev,
      [chartType]: !prev[chartType]
    }));
  };

  // Helper function to check if a section should be shown
  const shouldShowSection = (sectionKey) => {
    const config = dashboardConfig.trendlines?.[sectionKey];
    
    // If config has allowedDepartments, check if current department is allowed
    if (config && config.allowedDepartments) {
      return config.allowedDepartments.includes(selectedDepartment);
    }
    
    return true; // Show by default if no restrictions
  };

  // Helper function to render dashboard sections
  const renderDashboardSection = (sectionKey, content) => {
    const config = dashboardConfig.trendlines?.[sectionKey];
    
    // Check if section should be enabled for current department
    const isEnabled = config?.enabled || (config?.enabledDepartments && config.enabledDepartments.includes(selectedDepartment));
    
    if (!config || isEnabled) {
      return content;
    } else {
      // Show pending message for allowed departments
      let emoji = "⏳";
      let showTimeframe = true;
      
      if (sectionKey === 'cvrWithin7Days') {
        emoji = "❄️";
        showTimeframe = false; // Don't show "Needs 1 week" for CVR
      } else if (sectionKey === 'lossOfInterest') {
        emoji = "📊";
        showTimeframe = false; // Don't show "Needs 1 week" for Loss of Interest
      } else if (sectionKey === 'toolsPerformance') {
        showTimeframe = false; // Don't show "Needs 1 week" for Tools performance
      } else if (sectionKey === 'rulesAndPolicy') {
        showTimeframe = false; // Don't show "Needs 1 week" for Rules & policy performance
      }
      
      return (
        <Box sx={{ 
          textAlign: 'center', 
          py: 8, 
          color: 'text.secondary',
          background: alpha(theme.palette.info.main, 0.05),
          borderRadius: 2,
          border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
        }}>
          <Typography variant="h1" sx={{ fontSize: '3rem', mb: 2 }}>{emoji}</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
            {config.notAvailableText}
          </Typography>
          {showTimeframe && (
            <Typography variant="body2" color="text.secondary">
              Needs {config.timeframe}
            </Typography>
          )}
        </Box>
      );
    }
  };

  // Enhanced Chart Container Component with optional 7DMA toggle
  const ChartContainer = ({ id, title, children, toggleType = null }) => (
    <Box id={id}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Typography 
        variant="h6" 
        sx={{ 
          fontWeight: 600,
          color: 'text.primary',
          fontSize: { xs: '1rem', md: '1.125rem' }
        }}
      >
        {title}
      </Typography>
        {toggleType && (
          <FormControlLabel
            control={
              <Switch
                checked={toggles[toggleType]}
                onChange={() => handleToggleChange(toggleType)}
                size="small"
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.primary.main,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.primary.main,
                  },
                }}
              />
            }
            label={
              <Typography variant="caption" sx={{ fontWeight: 500 }}>
                7DMA
              </Typography>
            }
            labelPlacement="start"
            sx={{ m: 0 }}
          />
        )}
      </Stack>
      {children}
    </Box>
  );

  return (
    <Box>
      {/* Section 6-8: Trendlines - Now using Stacked Subplots */}
      <Card 
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
              Trendlines
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { 
              xs: '1fr', 
              lg: 'repeat(2, 1fr)' 
            },
            gap: { xs: 2, md: 3 },
            width: '100%'
          }}>
            {/* Total Chats Supposed to be Handled by Bot */}
            <Box>
              <ChartContainer id="totalchats-subplot" title="Chats Supposed to be Handled by Bot (16 July onwards)" toggleType="totalChats">
                <StackedSubplots 
                  title="Chats Supposed to be Handled by Bot (16 July onwards)"
                  data={dashboardData.trendlines.totalChatsData}
                  metrics={createChartData(dashboardData, 'totalChats', toggles.totalChats).metrics}
                />
              </ChartContainer>
            </Box>

            {/* 7D cohort - 3DW % */}
            {shouldShowSection('cvrWithin7Days') && (
              <Box>
                <ChartContainer id="cvr-subplot" title="7D cohort - 3DW  (Last 30 days)" toggleType="cvr">
                  {renderDashboardSection('cvrWithin7Days',
                    <StackedSubplots 
                      title="7D cohort - 3DW  (Last 30 days)"
                      data={dashboardData.trendlines.cvrData}
                      metrics={createChartData(dashboardData, 'cvr', toggles.cvr).metrics}
                    />
                  )}
                </ChartContainer>
              </Box>
            )}

            {/* Cost Subplots */}
            <Box>
              <ChartContainer id="cost-subplot" title="Cost Analysis (Last 30 days)">
                <StackedSubplots 
                  title="Cost Analysis (Last 30 days)"
                  data={dashboardData.trendlines.costData.filter(item => item.last30DaysCost !== null)}
                  metrics={createChartData(dashboardData, 'cost').metrics}
                />
              </ChartContainer>
            </Box>

            {/* Chats with Repetition Subplots */}
            <Box>
              <ChartContainer id="repetition-subplot" title="Chats with Repetition (16 July onwards)" toggleType="repetition">
                <StackedSubplots 
                  title="Chats with Repetition (16 July onwards)"
                  data={dashboardData.trendlines.repetitionData}
                  metrics={createChartData(dashboardData, 'repetition', toggles.repetition).metrics}
                />
              </ChartContainer>
            </Box>

            {/* Fully Handled by Bot Subplots */}
            <Box>
              <ChartContainer id="bothandled-subplot" title="Fully Handled by Bot % (16 July onwards)" toggleType="botHandled">
                <StackedSubplots 
                  title="Fully Handled by Bot % (16 July onwards)"
                  data={dashboardData.trendlines.botHandledData}
                  metrics={createChartData(dashboardData, 'botHandled', toggles.botHandled).metrics}
                />
              </ChartContainer>
            </Box>

            {/* Average Delays & 4-min msgs Subplots */}
            <Box>
              <ChartContainer id="delays-subplot" title="Average Delays & 4-min Messages (16 July onwards)" toggleType="delays">
                <StackedSubplots 
                  title="Average Delays & 4-min Messages (16 July onwards)"
                  data={dashboardData.trendlines.delayData}
                  metrics={createChartData(dashboardData, 'delays', toggles.delays).metrics}
                />
              </ChartContainer>
            </Box>

            {/* Sentiment analysis Subplots */}
            <Box>
              <ChartContainer id="sentiment-subplot" title="Sentiment Analysis (Last 30 days)" toggleType="sentiment">
                {renderDashboardSection('sentimentAnalysis',
                  <StackedSubplots 
                    title="Sentiment Analysis (Last 30 days)"
                    data={dashboardData.trendlines.sentimentData}
                    metrics={createChartData(dashboardData, 'sentiment', toggles.sentiment).metrics}
                  />
                )}
              </ChartContainer>
            </Box>

            {/* Tools performance Subplots */}
            <Box>
              <ChartContainer id="tools-subplot" title="Tools Performance (Last 30 days)">
                {renderDashboardSection('toolsPerformance',
                  <StackedSubplots 
                    title="Tools Performance (Last 30 days)"
                    data={dashboardData.trendlines.toolsData}
                    metrics={createChartData(dashboardData, 'tools').metrics}
                  />
                )}
              </ChartContainer>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Rules and policy performance - Stacked Subplots */}
      <Card 
        id="rules-policy-subplot"
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
            <SecurityIcon sx={{ color: 'primary.main', fontSize: 28 }} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                color: 'text.primary',
                fontSize: { xs: '1.25rem', md: '1.5rem' }
              }}
            >
              Rules & Policy Performance (Last 30 days)
            </Typography>
          </Box>
          {renderDashboardSection('rulesAndPolicy',
            <StackedSubplots 
              title="Rules & Policy Performance (Last 30 days)"
              data={dashboardData.trendlines.policyData}
              metrics={createChartData(dashboardData, 'policy').metrics}
            />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TrendlinesSection; 