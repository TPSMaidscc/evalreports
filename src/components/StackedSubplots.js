import React, { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';

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
    
    // Create the plot with faceting (fy = vertical facets, shared x-axis)
    const plot = Plot.plot({
      width: plotWidth,
      height: 300, // Dynamic height based on number of metrics with data
      marginLeft: 110, // Reduced since no left-side titles
      marginRight: 0,
      marginTop: 20, // Reduced since no internal title
      marginBottom: 60,
      
      // Configure the shared x-axis
      x: {
        type: "time",
        label: "Date",
        grid: false
      },
      
      // Configure facet layout
      fy: {
        label: null, // Remove facet labels since we'll use plot titles
        domain: metricsWithData.map(m => m.name),
        padding: 0.1
      },
      
      // Configure individual y-axes for each subplot
      y: {
        label: null, // Hide y-axis label
        grid: false,
        nice: true,
        axis: null // Hide y-axis ticks and values
      },
      
      marks: [
        // Add frame around each subplot
        Plot.frame({stroke: "#e5e7eb"}),
        
        // Create line charts for each metric with points showing values
        Plot.line(filteredFacetData, {
          x: "date",
          y: "value",
          fy: "metric",
          stroke: "color",
          strokeWidth: 2
        }),
        
        // Add points to show exact values
        Plot.dot(filteredFacetData, {
          x: "date",
          y: "value",
          fy: "metric",
          fill: "color",
          r: 3,
          tip: true, // Enable tooltips showing exact values
          title: d => {
            try {
              const dateStr = d.date instanceof Date ? d.date.toLocaleDateString() : new Date(d.date).toLocaleDateString();
              return `${d.metric}: ${d.value}\nDate: ${dateStr}`;
            } catch (error) {
              return `${d.metric}: ${d.value}\nDate: ${d.date}`;
            }
          }
        }),
        
        // Add text labels on points to show values
        Plot.text(filteredFacetData, {
          x: "date",
          y: "value",
          fy: "metric",
          text: d => d.value,
          fontSize: 10,
          dy: -10,
          fill: "#374151"
        })
      ]
    });

    containerRef.current.appendChild(plot);

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
export const createChartData = (dashboardData, chartType) => {
  switch (chartType) {
    case 'cost':
      return {
        data: dashboardData.trendlines.costData,
        metrics: [
          { key: 'last30DaysCost', name: 'Last 30 Days Cost ($)', color: '#ef4444' },
          { key: 'dailyCost', name: 'Daily Cost ($)', color: '#3b82f6' }
        ]
      };
    
    case 'repetition':
      return {
        data: dashboardData.trendlines.repetitionData,
        metrics: [
          { key: 'chatsRep', name: '% Chats Rep', color: '#fbbf24' },
          { key: 'chatsRep7dma', name: '% Chats Rep 7DMA', color: '#f97316' }
        ]
      };
    
    case 'delays':
      return {
        data: dashboardData.trendlines.delayData,
        metrics: [
          { key: 'avgDelayInit', name: 'Avg Delay Init (sec)', color: '#fbbf24' },
          { key: 'avgDelayNon', name: 'Avg Delay Non (sec)', color: '#f97316' },
          { key: 'init4m', name: 'Init ≥4 min', color: '#dc2626' },
          { key: 'nonInit4m', name: 'Non-init ≥4 min', color: '#ec4899' }
        ]
      };
    
    case 'sentiment':
      return {
        data: dashboardData.trendlines.sentimentData,
        metrics: [
          { key: 'sentiment', name: 'Sentiment (/5)', color: '#fbbf24' },
          { key: 'sentiment7dma', name: 'Sentiment 7DMA', color: '#f97316' }
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
    
    default:
      return { data: [], metrics: [] };
  }
};

export default StackedSubplots; 