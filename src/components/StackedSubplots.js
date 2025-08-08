import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';

// Helper function to calculate dynamic Y-axis range
const calculateYAxisRange = (data, paddingPercent = 0.12) => {
  if (!data || data.length === 0) {
    return { min: 0, max: 10 };
  }
  
  // Extract all numeric values
  const values = data.map(d => d.value).filter(v => v !== null && v !== undefined && !isNaN(v));
  
  if (values.length === 0) {
    return { min: 0, max: 10 };
  }
  
  const min = Math.min(...values);
  const max = Math.max(...values);
  
  // Handle case where all values are the same
  if (min === max) {
    const fallbackPadding = Math.max(Math.abs(min) * 0.1, 1); // 10% or minimum 1
    return {
      min: Math.floor(min - fallbackPadding),
      max: Math.ceil(max + fallbackPadding)
    };
  }
  
  const range = max - min;
  const padding = range * paddingPercent;
  
  return {
    min: Math.floor(min - padding),
    max: Math.ceil(max + padding)
  };
};

const StackedSubplots = ({ title, data, metrics }) => {
  const containerRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0 || !metrics || metrics.length === 0) return;

    // Transform data for faceting - each metric becomes a separate subplot
    const facetData = [];
    
    // First, collect all data points that have values
    data.forEach(point => {
      metrics.forEach(metric => {
        const value = point[metric.key];
        // Include if value exists and is not null
        if (value !== undefined && value !== null) {
          // Ensure date is a Date object
          const dateValue = point.date instanceof Date ? point.date : new Date(point.date);
          
          facetData.push({
            date: dateValue,
            value: value,
            metric: metric.name,
            metricKey: metric.key,
            color: metric.color || '#3b82f6'
          });
        }
      });
    });

    // Filter out metrics that have no data or only zeros/empty values
    const metricsWithData = metrics.filter(metric => {
      const metricData = facetData.filter(item => item.metric === metric.name);
      if (metricData.length === 0) return false;
      
      // Check if all values are zero or empty - if so, exclude this metric
      const hasNonZeroValue = metricData.some(item => 
        item.value !== 0 && item.value !== "0" && item.value !== "" && item.value !== null
      );
      return hasNonZeroValue;
    });

    // If no metrics have meaningful data, don't render anything
    if (metricsWithData.length === 0) {
      return;
    }

    // Filter facetData to only include metrics that have meaningful data
    const filteredFacetData = facetData.filter(item => 
      metricsWithData.some(metric => metric.name === item.metric)
    );

    // Clear previous chart
    containerRef.current.innerHTML = '';

    // Get container width for responsive sizing
    const containerWidth = containerRef.current?.offsetWidth || 500;
    const plotWidth = Math.min(containerWidth - 40, 600); // Max 600px, responsive to container
    
    // Calculate height per subplot to maintain fixed total height like original
    const totalHeight = 300; // Fixed height like original
    const subplotHeight = Math.max(80, totalHeight / metricsWithData.length); // At least 80px per subplot
    
    // Create a container div for all subplots
    const mainContainer = document.createElement('div');
    mainContainer.style.width = '100%';
    
    // Create separate plots for each metric with independent y-scales
    metricsWithData.forEach((metric, index) => {
      const metricData = filteredFacetData.filter(item => item.metric === metric.name);
      
      if (metricData.length === 0) return;
      
      // Calculate dynamic Y-axis range for this metric
      const yRange = calculateYAxisRange(metricData);
      
      // Create container for this subplot with horizontal layout (title on left, plot on right)
      const subplotContainer = document.createElement('div');
      subplotContainer.style.display = 'flex';
      subplotContainer.style.alignItems = 'center';
      subplotContainer.style.marginBottom = index < metricsWithData.length - 1 ? '0px' : '0px';
      subplotContainer.style.minHeight = `${subplotHeight}px`;
      
      // Create title for this subplot (positioned on the left)
      const title = document.createElement('div');
      title.style.fontSize = '8px';
      title.style.fontWeight = '600';
      title.style.color = '#374151';
      title.style.width = '50px';
      title.style.textAlign = 'right';
      title.style.paddingRight = '8px';
      title.style.lineHeight = '1.1';
      title.style.flexShrink = '0';
      title.style.wordWrap = 'break-word';
      title.style.overflow = 'hidden';
      title.textContent = metric.name;
      subplotContainer.appendChild(title);
      
      // Create the individual plot
      const plot = Plot.plot({
        width: plotWidth - 90, // Reduce width to account for title space
        height: subplotHeight,
        marginLeft: 50,
        marginRight: 10,
        marginTop: 8,
        marginBottom: index === metricsWithData.length - 1 ? 40 : 8, // Only show x-axis label on last plot
        
        // Configure x-axis (shared time axis)
        x: {
          type: "time",
          label: index === metricsWithData.length - 1 ? "Date" : null, // Only show label on last plot
          axis: index === metricsWithData.length - 1 ? "bottom" : null, // Only show axis on last plot
          grid: false,
          tickFormat: index === metricsWithData.length - 1 ? undefined : () => "" // Hide ticks on all but last
        },
        
                 // Independent y-axis for each subplot with dynamic range
         y: {
           label: null,
           grid: false,
           domain: [yRange.min, yRange.max],
           axis: "left",
           tickSize: 4,
           tickFormat: d => {
             // Format numbers appropriately based on magnitude
             if (d >= 1000) return `${(d/1000).toFixed(1)}k`;
             if (d >= 100) return d.toFixed(0);
             if (d >= 10) return d.toFixed(1);
             return d.toFixed(2);
           }
         },
        
        marks: [
          // Add frame around subplot
          Plot.frame({stroke: "#e5e7eb"}),
          
          // Create line chart for this metric
          Plot.line(metricData, {
            x: "date",
            y: "value",
            stroke: metricData[0]?.color || "#3b82f6",
            strokeWidth: 2
          }),
          
          // Add points to show exact values
          Plot.dot(metricData, {
            x: "date",
            y: "value",
            fill: metricData[0]?.color || "#3b82f6",
            r: 3,
            tip: true,
            title: d => {
              try {
                const dateStr = d.date instanceof Date ? d.date.toLocaleDateString() : new Date(d.date).toLocaleDateString();
                
                // Format value for tooltip (same logic as text labels)
                const metricName = d.metric;
                const shouldRemoveDecimals = metricName.includes('% Chats Rep') || 
                                           metricName.includes('Fully handled by bot');
                
                const displayValue = shouldRemoveDecimals && typeof d.value === 'number' 
                  ? Math.round(d.value).toString() 
                  : d.value;
                
                return `${d.metric}: ${displayValue}\nDate: ${dateStr}`;
              } catch (error) {
                const metricName = d.metric;
                const shouldRemoveDecimals = metricName.includes('% Chats Rep') || 
                                           metricName.includes('Fully handled by bot');
                
                const displayValue = shouldRemoveDecimals && typeof d.value === 'number' 
                  ? Math.round(d.value).toString() 
                  : d.value;
                
                return `${d.metric}: ${displayValue}\nDate: ${d.date}`;
              }
            }
          }),
          
          // Add text labels on points to show values (alternating pattern)
          Plot.text(metricData, {
            x: "date",
            y: "value",
            text: (d, i) => {
              // Show values only for alternating points (every other point)
              if (i % 2 !== 0) {
                return ""; // Don't show value for odd indices
              }
              
              // Remove decimals for specific metrics
              const metricName = d.metric;
              const shouldRemoveDecimals = metricName.includes('% Chats Rep') || 
                                         metricName.includes('Fully handled by bot');
              
              if (shouldRemoveDecimals && typeof d.value === 'number') {
                return Math.round(d.value).toString();
              }
              return d.value;
            },
            fontSize: 10,
            dy: -10,
            fill: "#374151"
          })
        ]
      });
      
      subplotContainer.appendChild(plot);
      mainContainer.appendChild(subplotContainer);
    });

    containerRef.current.appendChild(mainContainer);

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [data, metrics, title]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div ref={containerRef} className="w-full overflow-x-auto"></div>
    </div>
  );
};

// Helper component for creating common chart configurations
export const createChartData = (dashboardData, chartType, show7DMA = false) => {
  switch (chartType) {
    case 'totalChats':
      return {
        data: dashboardData.trendlines.totalChatsData,
        metrics: show7DMA ? [
          { key: 'totalChats7dma', name: 'Total Chats 7DMA', color: '#10b981' }
        ] : [
          { key: 'totalChats', name: 'Total Chats', color: '#34d399' }
        ]
      };
    
    case 'cost':
      return {
        data: dashboardData.trendlines.costData,
        metrics: [
          { key: 'last30DaysCost', name: 'Last 30 Days Cost ($)', color: '#ef4444' },
          { key: 'dailyCost', name: 'Daily Cost ($)', color: '#3b82f6' }
        ]
      };
    
    case 'cvr':
      return {
        data: dashboardData.trendlines.cvrData,
        metrics: show7DMA ? [
          { key: 'cvr7dma', name: '% CVR 7DMA', color: '#dc2626' }
        ] : [
          { key: 'cvr', name: '% CVR', color: '#f97316' }
        ]
      };
    
    case 'repetition':
      return {
        data: dashboardData.trendlines.repetitionData,
        metrics: show7DMA ? [
          { key: 'chatsRep7dma', name: '% Chats Rep 7DMA', color: '#f97316' }
        ] : [
          { key: 'chatsRep', name: '% Chats Rep', color: '#fbbf24' }
        ]
      };
    
    case 'delays':
      return {
        data: dashboardData.trendlines.delayData,
        metrics: show7DMA ? [
          { key: 'avgDelayInit7dma', name: 'Avg Delay Init 7DMA (sec)', color: '#f97316' },
          { key: 'avgDelayNon7dma', name: 'Avg Delay Non 7DMA (sec)', color: '#ea580c' },
          { key: 'init4m7dma', name: 'Init ≥4 min 7DMA', color: '#dc2626' },
          { key: 'nonInit4m7dma', name: 'Non-init ≥4 min 7DMA', color: '#ec4899' }
        ] : [
          { key: 'avgDelayInit', name: 'Avg Delay Init (sec)', color: '#fbbf24' },
          { key: 'avgDelayNon', name: 'Avg Delay Non (sec)', color: '#f97316' },
          { key: 'init4m', name: 'Init ≥4 min', color: '#dc2626' },
          { key: 'nonInit4m', name: 'Non-init ≥4 min', color: '#ec4899' }
        ]
      };
    
    case 'sentiment':
      return {
        data: dashboardData.trendlines.sentimentData,
        metrics: show7DMA ? [
          { key: 'sentiment7dma', name: 'Sentiment 7DMA (/5)', color: '#f97316' }
        ] : [
          { key: 'sentiment', name: 'Sentiment (/5)', color: '#fbbf24' }
        ]
      };
    
    case 'tools':
      return {
        data: dashboardData.trendlines.toolsData,
        metrics: [
          { key: 'wrongTools', name: '% Wrong Tools', color: '#fbbf24' },
          { key: 'toolsMissed', name: '% Tools Missed', color: '#f97316' }
        ]
      };
    
    case 'policy':
      return {
        data: dashboardData.trendlines.policyData,
        metrics: [
          { key: 'ruleBreak', name: '% Rule-break', color: '#fbbf24' },
          { key: 'missing', name: '% Missing', color: '#f97316' },
          { key: 'unclear', name: '% Unclear', color: '#dc2626' },
          { key: 'transfers', name: '% Transfers', color: '#ec4899' }
        ]
      };
    
    case 'botHandled':
      return {
        data: dashboardData.trendlines.botHandledData,
        metrics: show7DMA ? [
          { key: 'botHandled7dma', name: 'Fully handled by bot 7DMA %', color: '#1e40af' }
        ] : [
          { key: 'botHandled', name: 'Fully handled by bot %', color: '#3b82f6' }
        ]
      };
    
    default:
      return { data: [], metrics: [] };
  }
};

export default StackedSubplots; 