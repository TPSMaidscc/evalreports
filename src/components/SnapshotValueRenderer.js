import React from 'react';
import { getDataKey, getMetaQualityIcon, shouldBeItalic } from '../utils/helpers';

const SnapshotValueRenderer = ({ fieldName, dashboardData, selectedDepartment }) => {
  // Special handling for African, Ethiopian, and Filipina departments
  const isNoShadowingDepartment = ['MaidsAT African', 'MaidsAT Ethiopian', 'AT Filipina'].includes(selectedDepartment);
  
  if (isNoShadowingDepartment) {
    if (fieldName === 'Chats shadowed %') {
      return <span className="text-sm font-medium">No shadowing</span>;
    }
    if (fieldName === 'Reported issue (#)') {
      return <span className="text-sm font-medium">0 (No chats shadowed)</span>;
    }
    if (fieldName === 'Issues pending to be solved (#)') {
      return <span className="text-sm font-medium">0</span>;
    }
  }
  
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
  
  // For Chats supposed to be handled by bot (#), render normal value (clickability is on the label)
  if (fieldName === 'Chats supposed to be handled by bot (#)') {
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
  
  // For Identical messages repeated % (Avg), render in format like "8.41%(Avg. per chat:0.18)"
  if (fieldName === 'Identical messages repeated % (Avg)') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Handle different possible formats for the value
    // Check if it's already in the new format "8.41%(Avg. per chat:0.18)" and reformat it
    if (actualValue.includes('Avg. per chat:')) {
      // Parse the existing format and convert to new format
      const match = actualValue.match(/^(\d+(?:\.\d+)?)%\s*\(Avg\. per chat:\s*([0-9.]+)\)$/);
      if (match) {
        const percentage = parseFloat(match[1]);
        const avgPerChat = parseFloat(match[2]);
        const formattedValue = `${percentage.toFixed(1)}% (Avg. per chat:${avgPerChat.toFixed(1)})`;
        return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{formattedValue}</span>;
      }
      // Fallback to original value if parsing fails
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
    }
    
    // Parse old format "5.67%(19)" and convert to new format
    const oldMatch = actualValue.match(/^(\d+\.?\d*)%\((\d+)\)$/);
    if (oldMatch) {
      const percentage = parseFloat(oldMatch[1]);
      const count = parseFloat(oldMatch[2]);
      
      // For backwards compatibility, if we have count, estimate avg per chat (this would need real data)
      const roundedValue = `${percentage.toFixed(1)}% (Avg. per chat:${count.toFixed(1)})`;
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{roundedValue}</span>;
    }
    
    // Parse new format where we expect "percentage%(average)" - handles decimals properly
    const newMatch = actualValue.match(/^(\d+(?:\.\d+)?)%\s*\(([0-9.]+)\)$/);
    if (newMatch) {
      const percentage = parseFloat(newMatch[1]);
      const avgPerChat = parseFloat(newMatch[2]);
      const formattedValue = `${percentage.toFixed(1)}% (Avg. per chat: ${avgPerChat.toFixed(1)})`;
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{formattedValue}</span>;
    }
    
    return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
  }
  
  // For 80% Message similarity % or 50% Message similarity %, render in format like "4.62%(Avg. per chat:1.91)"
  if (fieldName === '80% Message similarity %' || fieldName === '50% Message similarity %') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Handle different possible formats for the value
    // Check if it's already in the new format "4.62%(Avg. per chat:1.91)" and reformat it
    if (actualValue.includes('Avg. per chat:')) {
      // Parse the existing format and convert to new format
      const match = actualValue.match(/^(\d+(?:\.\d+)?)%\s*\(Avg\. per chat:\s*([0-9.]+)\)$/);
      if (match) {
        const percentage = parseFloat(match[1]);
        const avgPerChat = parseFloat(match[2]);
        const formattedValue = `${percentage.toFixed(1)}% (Avg. per chat: ${avgPerChat.toFixed(1)})`;
        return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{formattedValue}</span>;
      }
      // Fallback to original value if parsing fails
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
    }
    
    // Parse old format "4.62%(1.91)" and convert to new format
    const oldMatch = actualValue.match(/^(\d+(?:\.\d+)?)%\s*\((\d+(?:\.\d+)?)\)$/);
    if (oldMatch) {
      const percentage = parseFloat(oldMatch[1]);
      const count = parseFloat(oldMatch[2]);
      // For backwards compatibility, if we have count, estimate avg per chat
      const roundedValue = `${percentage.toFixed(1)}% (Avg. per chat: ${count.toFixed(1)})`;
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{roundedValue}</span>;
    }
    
    // Parse new format where we expect "percentage%(average)" - handles decimals like "1.23% (1.269)"
    const newMatch = actualValue.match(/^(\d+(?:\.\d+)?)%\s*\(([0-9.]+)\)$/);
    if (newMatch) {
      const percentage = parseFloat(newMatch[1]);
      const avgPerChat = parseFloat(newMatch[2]);
      const formattedValue = `${percentage.toFixed(1)}% (Avg. per chat:${avgPerChat.toFixed(1)})`;
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

  // Special handling for Reported issue (#) - convert decimal to integer
  if (fieldName === 'Reported issue (#)') {
    if (!actualValue || actualValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    // Handle format like "20.0 (6.45% of chats)" and convert to "20 (6.45% of chats)"
    const match = actualValue.match(/^(\d+(?:\.\d+)?)\s*(\(.+\))$/);
    if (match) {
      const numericValue = parseFloat(match[1]);
      const parenthesesPart = match[2];
      if (!isNaN(numericValue)) {
        const integerValue = Math.round(numericValue);
        const formattedValue = `${integerValue} ${parenthesesPart}`;
        return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{formattedValue}</span>;
      }
    }
    
    // If it's just a number, convert to integer
    const numericValue = parseFloat(actualValue);
    if (!isNaN(numericValue)) {
      const integerValue = Math.round(numericValue);
      return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{integerValue}</span>;
    }
    
    return <span className={`text-sm font-medium ${shouldBeItalic(actualValue) ? 'italic' : ''}`}>{actualValue}</span>;
  }
  
  // Special handling for Call Request % - combine with Rebuttal Result %
  if (fieldName === 'Call Request %') {
    const callRequestValue = actualValue || 'N/A';
    const rebuttalResultKey = getDataKey('Rebuttal Result %');
    const rebuttalResultValue = dashboardData.snapshot[rebuttalResultKey] || 'N/A';
    
    if (callRequestValue === 'N/A' && rebuttalResultValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    const formattedValue = `${callRequestValue} (${rebuttalResultValue} Unretained)`;
    return <span className={`text-sm font-medium ${shouldBeItalic(callRequestValue) || shouldBeItalic(rebuttalResultValue) ? 'italic' : ''}`}>{formattedValue}</span>;
  }

  // Special handling for Clients Questioning Legalties % - combine with Escalation Outcome
  if (fieldName === 'Clients Questioning Legalties %') {
    const clientQuestioningValue = actualValue || 'N/A';
    const escalationOutcomeKey = getDataKey('Escalation Outcome');
    const escalationOutcomeValue = dashboardData.snapshot[escalationOutcomeKey] || 'N/A';
    
    if (clientQuestioningValue === 'N/A' && escalationOutcomeValue === 'N/A') {
      return <span className="text-sm font-medium italic">N/A</span>;
    }
    
    const formattedValue = `${clientQuestioningValue} (${escalationOutcomeValue} Escalated)`;
    return <span className={`text-sm font-medium ${shouldBeItalic(clientQuestioningValue) || shouldBeItalic(escalationOutcomeValue) ? 'italic' : ''}`}>{formattedValue}</span>;
  }
  
  const displayValue = actualValue || 'N/A';
  return <span className={`text-sm font-medium ${shouldBeItalic(displayValue) ? 'italic' : ''}`}>{displayValue}</span>;
};

export default SnapshotValueRenderer; 