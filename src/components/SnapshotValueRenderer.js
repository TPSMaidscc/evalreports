import React from 'react';
import { getDataKey, getMetaQualityIcon, shouldBeItalic } from '../utils/helpers';

const SnapshotValueRenderer = ({ fieldName, dashboardData }) => {
  // Get the actual data key and value
  const dataKey = getDataKey(fieldName);
  const actualValue = dashboardData.snapshot[dataKey];
  
  // Show actual data
  if (fieldName === 'META Quality' || fieldName === 'META Quality for 97145810691' || fieldName === 'META Quality for 97145810641') {
    const displayValue = actualValue || 'N/A';
    return (
      <span className={`text-sm font-medium flex items-center justify-end ${shouldBeItalic(displayValue) ? 'italic' : ''}`}>
        {getMetaQualityIcon(actualValue)}
        {displayValue}
      </span>
    );
  }
  
  // For Total Number of Chats, render normal value (clickability is on the label)
  if (fieldName === 'Total Number of Chats (#)') {
    const displayValue = actualValue || 'N/A';
    return <span className={`text-sm font-medium ${shouldBeItalic(displayValue) ? 'italic' : ''}`}>{displayValue}</span>;
  }
  
  // For Fully handled by bot %, render normal value (clickability is on the label)
  if (fieldName === 'Fully handled by bot %') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Parse the numeric value and round it, add % symbol
    const numericValue = parseFloat(actualValue);
    if (!isNaN(numericValue)) {
      const roundedValue = `${Math.round(numericValue)}%`;
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{roundedValue}</span>;
    }
    
    return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
  }
  
  // For Verbatim messages repeated % (Avg), render in format like "8.41%(Avg. per chat:0.18)"
  if (fieldName === 'Verbatim messages repeated % (Avg)') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Handle different possible formats for the value
    // Check if it's already in the new format "8.41%(Avg. per chat:0.18)"
    if (actualValue.includes('Avg. per chat:')) {
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
    }
    
    // Parse old format "5.67%(19)" and convert to new format
    const oldMatch = actualValue.match(/^(\d+\.?\d*)%\((\d+)\)$/);
    if (oldMatch) {
      const percentage = parseFloat(oldMatch[1]);
      const count = parseFloat(oldMatch[2]);
      // For backwards compatibility, if we have count, estimate avg per chat (this would need real data)
      const roundedValue = `${percentage.toFixed(2)}%(Avg. per chat:${count})`;
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{roundedValue}</span>;
    }
    
    // Parse new format where we expect "percentage%(average)" 
    const newMatch = actualValue.match(/^(\d+\.?\d*)%\(([0-9.]+)\)$/);
    if (newMatch) {
      const percentage = parseFloat(newMatch[1]);
      const avgPerChat = parseFloat(newMatch[2]);
      const formattedValue = `${percentage.toFixed(2)}%(Avg. per chat:${avgPerChat.toFixed(2)})`;
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{formattedValue}</span>;
    }
    
    return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
  }
  
  // Special handling for delay metrics - split time and count info
  if (fieldName === 'Avg Delay - Initial msg (sec)' || fieldName === 'Avg Delay - non-initial msg (sec)') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Split at the opening parenthesis
    const parts = actualValue.split('(');
    if (parts.length === 2) {
      const timePart = parts[0].trim();
      const countPart = '(' + parts[1].trim();
      
      return (
        <div className={`text-sm font-medium text-right ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>
          <div className="font-semibold">{timePart}</div>
          <div className="text-xs text-gray-500 mt-1">{countPart}</div>
        </div>
      );
    }
    
    // Fallback if format doesn't match expected pattern
    return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
  }
  
  // Special handling for percentage fields that need rounding
  if (fieldName === 'Agent intervention %') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Parse the numeric value and round it, add % symbol
    const numericValue = parseFloat(actualValue);
    if (!isNaN(numericValue)) {
      const roundedValue = `${Math.round(numericValue)}%`;
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{roundedValue}</span>;
    }
    
    return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
  }
  
  // Special handling for Chats shadowed % - round and add % sign
  if (fieldName === 'Chats shadowed %') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Parse the numeric value and round it, add % symbol
    const numericValue = parseFloat(actualValue);
    if (!isNaN(numericValue)) {
      const roundedValue = `${Math.round(numericValue)}%`;
      return <span className={`text-sm font-medium ${shouldBeItalic(roundedValue) ? 'italic' : ''}`}>{roundedValue}</span>;
    }
    
    return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
  }
  
  const displayValue = actualValue || 'N/A';
  return <span className={`text-sm font-medium ${shouldBeItalic(displayValue) ? 'italic' : ''}`}>{displayValue}</span>;
};

export default SnapshotValueRenderer; 