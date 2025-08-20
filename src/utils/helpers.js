import React from 'react';
import { dataKeyMapping } from './constants';

// Get yesterday's date as default
export const getYesterdayDate = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0]; // Return YYYY-MM-DD format
};

// Helper function to get META Quality icon color
export const getMetaQualityIcon = (qualityText) => {
  if (!qualityText) return null;
  
  const text = qualityText.toLowerCase();
  let colorClass = '';
  
  if (text.includes('high')) {
    colorClass = 'bg-green-500';
  } else if (text.includes('mid') || text.includes('medium')) {
    colorClass = 'bg-orange-500';
  } else if (text.includes('low')) {
    colorClass = 'bg-red-500';
  } else {
    return null;
  }
  
  return (
    <span className={`inline-block w-3 h-3 rounded-full ${colorClass} mr-2`}></span>
  );
};

// Helper function to map display names to data keys
export const getDataKey = (displayName) => {
  return dataKeyMapping[displayName] || displayName;
};

// Helper function to check if value should be italic
export const shouldBeItalic = (value) => {
  if (!value || typeof value !== 'string') return false;
  return value.includes('Pending') || value.includes('N/A');
};

// Format date for display
export const formatDisplayDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  });
};

// Get current date or format provided date
export const getCurrentDate = (dateString = null) => {
  if (dateString) {
    // If a date string is provided, format it for display
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  }
  // If no date provided, return today's date in YYYY-MM-DD format
  return new Date().toISOString().split('T')[0];
};

// Calculate 7-day moving average for a dataset
export const calculate7DayMovingAverage = (data, valueKey) => {
  if (!data || data.length === 0) return data;
  
  // Sort data by date to ensure proper order
  const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  return sortedData.map((item, index) => {
    // For the first 6 points, we don't have enough data for a full 7-day average
    if (index < 6) {
      return {
        ...item,
        [`${valueKey}7dma`]: null
      };
    }
    
    // Calculate average of current point and previous 6 points (7 total)
    const window = sortedData.slice(index - 6, index + 1);
    const validValues = window
      .map(d => d[valueKey])
      .filter(val => val !== null && val !== undefined && !isNaN(val));
    
    if (validValues.length === 0) {
      return {
        ...item,
        [`${valueKey}7dma`]: null
      };
    }
    
    const average = validValues.reduce((sum, val) => sum + parseFloat(val), 0) / validValues.length;
    
    return {
      ...item,
      [`${valueKey}7dma`]: Math.round(average * 100) / 100 // Round to 2 decimal places
    };
  });
};

// Update URL with department and date parameters
export const updateURL = (department, date) => {
  const url = new URL(window.location);
  url.searchParams.set('department', department);
  url.searchParams.set('date', date);
  window.history.pushState({}, '', url);
}; 

// Helper function to determine if date is before AT Filipina split
// Helper function to get the appropriate departments list based on date
export const getDepartmentsForDate = (dateString) => {
  const allDepartments = [
    'LLM Cost Analysis',
    'All Chatbots Summary',
    'MV Resolvers',
    'Doctors',
    'AT Filipina',
    'CC Sales',
    'Delighters',
    'CC Resolvers',
    'MV Sales',
    'MaidsAT African',
    'MaidsAT Ethiopian'
  ];
  
  return allDepartments;
};

// Helper function to map department for data fetching (handles legacy mapping)
export const mapDepartmentForDataFetch = (selectedDepartment, dateString) => {
  return selectedDepartment;
};

// Helper function to get current date in YYYY-MM-DD format
export const getCurrentDateFormatted = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get tab name with current date and RAW format
export const getCurrentDateRawTabName = () => {
  const currentDate = getCurrentDateFormatted();
  return `${currentDate}-RAW`;
};

// Helper function to get tab name with selected date and RAW format
export const getSelectedDateRawTabName = (selectedDate) => {
  if (!selectedDate) {
    // Fallback to current date if no selected date provided
    return getCurrentDateRawTabName();
  }
  
  // Parse the selected date and format it
  const date = new Date(selectedDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;
  
  return `${formattedDate}-RAW`;
}; 