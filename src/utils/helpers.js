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

// Get current date formatted
export const getCurrentDate = (selectedDate) => {
  return formatDisplayDate(selectedDate);
};

// Update URL with department and date parameters
export const updateURL = (department, date) => {
  const url = new URL(window.location);
  url.searchParams.set('department', department);
  url.searchParams.set('date', date);
  window.history.pushState({}, '', url);
}; 