const GOOGLE_SHEETS_API_KEY = process.env.REACT_APP_GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEETS_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Configuration for different sheet types
const SHEET_CONFIG = {
  definitions: {
    spreadsheetId: process.env.REACT_APP_DEFINITIONS_SHEET_ID,
    sheetName: 'Definitions'
  },
  snapshot: {
    // Will be populated with department-specific sheet IDs
    spreadsheetIds: {
      'CC Sales': process.env.REACT_APP_CC_SALES_SNAPSHOT_SHEET_ID,
      'MV Resolvers': process.env.REACT_APP_MV_RESOLVERS_SNAPSHOT_SHEET_ID,
      'Doctors': process.env.REACT_APP_DOCTORS_SNAPSHOT_SHEET_ID,
      'AT Filipina': process.env.REACT_APP_AT_FILIPINA_SNAPSHOT_SHEET_ID,
      'Delighters': process.env.REACT_APP_DELIGHTERS_SNAPSHOT_SHEET_ID,
      'CC Resolvers': process.env.REACT_APP_CC_RESOLVERS_SNAPSHOT_SHEET_ID,
      'MV Sales': process.env.REACT_APP_MV_SALES_SNAPSHOT_SHEET_ID,
      'MaidsAT African': process.env.REACT_APP_MAIDS_AT_AFRICAN_SNAPSHOT_SHEET_ID,
      'MaidsAT Ethiopian': process.env.REACT_APP_MAIDS_AT_ETHIOPIAN_SNAPSHOT_SHEET_ID
    }
  },
  funnel: {
    spreadsheetIds: {
      'CC Sales': process.env.REACT_APP_CC_SALES_FUNNEL_SHEET_ID,
      'MV Resolvers': process.env.REACT_APP_MV_RESOLVERS_FUNNEL_SHEET_ID,
      'Doctors': process.env.REACT_APP_DOCTORS_FUNNEL_SHEET_ID,
      'AT Filipina': process.env.REACT_APP_AT_FILIPINA_FUNNEL_SHEET_ID,
      'Delighters': process.env.REACT_APP_DELIGHTERS_FUNNEL_SHEET_ID,
      'CC Resolvers': process.env.REACT_APP_CC_RESOLVERS_FUNNEL_SHEET_ID,
      'MV Sales': process.env.REACT_APP_MV_SALES_FUNNEL_SHEET_ID,
      'MaidsAT African': process.env.REACT_APP_MAIDS_AT_AFRICAN_FUNNEL_SHEET_ID,
      'MaidsAT Ethiopian': process.env.REACT_APP_MAIDS_AT_ETHIOPIAN_FUNNEL_SHEET_ID
    }
  },
  lossOfInterest: {
    spreadsheetIds: {
      'CC Sales': process.env.REACT_APP_CC_SALES_LOSS_SHEET_ID,
      'MV Resolvers': process.env.REACT_APP_MV_RESOLVERS_LOSS_SHEET_ID,
      'Doctors': process.env.REACT_APP_DOCTORS_LOSS_SHEET_ID,
      'AT Filipina': process.env.REACT_APP_AT_FILIPINA_LOSS_SHEET_ID,
      'Delighters': process.env.REACT_APP_DELIGHTERS_LOSS_SHEET_ID,
      'CC Resolvers': process.env.REACT_APP_CC_RESOLVERS_LOSS_SHEET_ID,
      'MV Sales': process.env.REACT_APP_MV_SALES_LOSS_SHEET_ID,
      'MaidsAT African': process.env.REACT_APP_MAIDS_AT_AFRICAN_LOSS_SHEET_ID,
      'MaidsAT Ethiopian': process.env.REACT_APP_MAIDS_AT_ETHIOPIAN_LOSS_SHEET_ID
    }
  },
  trendlines: {
    spreadsheetIds: {
      'CC Sales': process.env.REACT_APP_CC_SALES_TRENDLINES_SHEET_ID,
      'MV Resolvers': process.env.REACT_APP_MV_RESOLVERS_TRENDLINES_SHEET_ID,
      'Doctors': process.env.REACT_APP_DOCTORS_TRENDLINES_SHEET_ID,
      'AT Filipina': process.env.REACT_APP_AT_FILIPINA_TRENDLINES_SHEET_ID,
      'Delighters': process.env.REACT_APP_DELIGHTERS_TRENDLINES_SHEET_ID,
      'CC Resolvers': process.env.REACT_APP_CC_RESOLVERS_TRENDLINES_SHEET_ID,
      'MV Sales': process.env.REACT_APP_MV_SALES_TRENDLINES_SHEET_ID,
      'MaidsAT African': process.env.REACT_APP_MAIDS_AT_AFRICAN_TRENDLINES_SHEET_ID,
      'MaidsAT Ethiopian': process.env.REACT_APP_MAIDS_AT_ETHIOPIAN_TRENDLINES_SHEET_ID
    }
  }
};

// Utility function to format date for sheet name
const formatDateForSheetName = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

// Generic function to fetch data from Google Sheets
const fetchSheetData = async (spreadsheetId, range) => {
  if (!GOOGLE_SHEETS_API_KEY) {
    throw new Error('Google Sheets API key not configured');
  }
  
  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID not provided');
  }

  const url = `${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.values || [];
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
};

// Convert array of arrays to array of objects
const convertToObjects = (data, headers) => {
  if (!data || data.length === 0) return [];
  
  const headerRow = headers || data[0];
  const dataRows = headers ? data : data.slice(1);
  
  return dataRows.map(row => {
    const obj = {};
    headerRow.forEach((header, index) => {
      obj[header] = row[index] || '';
    });
    return obj;
  });
};

// Fetch definitions data
export const fetchDefinitions = async () => {
  try {
    const data = await fetchSheetData(
      SHEET_CONFIG.definitions.spreadsheetId,
      `${SHEET_CONFIG.definitions.sheetName}!A:F`
    );
    
    if (data.length === 0) return [];
    
    const headers = ['eval', 'metric', 'description', 'formula', 'action', 'value'];
    return convertToObjects(data, headers);
  } catch (error) {
    console.error('Error fetching definitions:', error);
    return [];
  }
};

// Fetch today's snapshot data
export const fetchTodaysSnapshot = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.snapshot.spreadsheetIds[department];
    const sheetName = formatDateForSheetName(date);
    
    const data = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A:Z`
    );
    
    if (data.length === 0) return {};
    
      // Convert the key-value pairs to an object
  const snapshot = {};
  // Skip the first row if it contains headers
  const dataRows = data.length > 0 && (data[0][0] === 'A (Metric Name)' || data[0][0] === 'Metric Name') 
    ? data.slice(1) 
    : data;
    
  dataRows.forEach(row => {
    if (row.length >= 2) {
      snapshot[row[0]] = row[1];
    }
  });
    
    return snapshot;
  } catch (error) {
    console.error('Error fetching today\'s snapshot:', error);
    return {};
  }
};

// Fetch conversion funnel data
export const fetchConversionFunnel = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.funnel.spreadsheetIds[department];
    const sheetName = formatDateForSheetName(date);
    
    const data = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A:P`
    );
    
    if (data.length === 0) return [];
    
    return convertToObjects(data);
  } catch (error) {
    console.error('Error fetching conversion funnel:', error);
    return [];
  }
};

// Fetch loss of interest data
export const fetchLossOfInterest = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.lossOfInterest.spreadsheetIds[department];
    const sheetName = formatDateForSheetName(date);
    
    const data = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A:M`
    );
    
    if (data.length === 0) return [];
    
    return convertToObjects(data);
  } catch (error) {
    console.error('Error fetching loss of interest:', error);
    return [];
  }
};

// Fetch trendlines data
export const fetchTrendlines = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.trendlines.spreadsheetIds[department];
    const sheetName = formatDateForSheetName(date);
    
    const data = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A:Z`
    );
    
    if (data.length === 0) return {};
    
    // Parse multiple tables from the sheet
    const trendlines = {
      cvrData: [],
      lossOfInterestData: [],
      repetitionData: [],
      delayData: [],
      sentimentData: [],
      toolsData: [],
      policyData: []
    };
    
    // Find and parse each table section
    let currentIndex = 0;
    
    while (currentIndex < data.length) {
      const row = data[currentIndex];
      
      // Skip empty rows
      if (!row || row.length === 0 || !row[0]) {
        currentIndex++;
        continue;
      }
      
      // Identify table type by headers
      const firstCell = row[0].toLowerCase();
      
      if (firstCell === 'date' && row.includes('chats') && row.includes('cvr')) {
        // CVR Data table
        trendlines.cvrData = parseTableSection(data, currentIndex, ['date', 'chats', 'cvr', 'cvr7dma']);
      } else if (firstCell === 'date' && row.includes('lossInterest')) {
        // Loss of Interest Data table
        trendlines.lossOfInterestData = parseTableSection(data, currentIndex, ['date', 'lossInterest', 'lossPricing', 'loss7dma']);
      } else if (firstCell === 'date' && row.includes('chatsRep')) {
        // Repetition Data table
        trendlines.repetitionData = parseTableSection(data, currentIndex, ['date', 'chatsRep', 'chatsRep7dma']);
      } else if (firstCell === 'date' && row.includes('avgDelayInit')) {
        // Delay Data table
        trendlines.delayData = parseTableSection(data, currentIndex, ['date', 'avgDelayInit', 'avgDelayNon', 'init4m', 'nonInit4m']);
      } else if (firstCell === 'date' && row.includes('frustrated')) {
        // Sentiment Data table
        trendlines.sentimentData = parseTableSection(data, currentIndex, ['date', 'frustrated', 'sentiment', 'sentiment7dma']);
      } else if (firstCell === 'date' && row.includes('wrongTools')) {
        // Tools Data table
        trendlines.toolsData = parseTableSection(data, currentIndex, ['date', 'wrongTools', 'toolsMissed']);
      } else if (firstCell === 'date' && row.includes('ruleBreak')) {
        // Policy Data table
        trendlines.policyData = parseTableSection(data, currentIndex, ['date', 'ruleBreak', 'missing', 'unclear', 'transfers']);
      }
      
      currentIndex++;
    }
    
    return trendlines;
  } catch (error) {
    console.error('Error fetching trendlines:', error);
    return {
      cvrData: [],
      lossOfInterestData: [],
      repetitionData: [],
      delayData: [],
      sentimentData: [],
      toolsData: [],
      policyData: []
    };
  }
};

// Helper function to parse a table section
const parseTableSection = (data, startIndex, expectedHeaders) => {
  const headerRow = data[startIndex];
  if (!headerRow) return [];
  
  const result = [];
  let currentIndex = startIndex + 1;
  
  // Parse data rows until we hit an empty row or end of data
  while (currentIndex < data.length) {
    const row = data[currentIndex];
    
    // Stop if we hit an empty row or row with no data
    if (!row || row.length === 0 || !row[0]) {
      break;
    }
    
    // Create object from row data
    const rowObj = {};
    headerRow.forEach((header, index) => {
      if (header && row[index] !== undefined) {
        // Convert numbers where appropriate
        const value = row[index];
        if (header === 'date') {
          rowObj[header] = value;
        } else if (!isNaN(value) && value !== '') {
          rowObj[header] = parseFloat(value);
        } else {
          rowObj[header] = value;
        }
      }
    });
    
    if (Object.keys(rowObj).length > 0) {
      result.push(rowObj);
    }
    
    currentIndex++;
  }
  
  return result;
};

// Fetch all dashboard data
export const fetchDashboardData = async (department, date) => {
  try {
    const [
      definitions,
      snapshot,
      funnel,
      lossOfInterest,
      trendlines
    ] = await Promise.all([
      fetchDefinitions(),
      fetchTodaysSnapshot(department, date),
      fetchConversionFunnel(department, date),
      fetchLossOfInterest(department, date),
      fetchTrendlines(department, date)
    ]);
    
    return {
      definitions,
      snapshot,
      funnel,
      lossOfInterest,
      trendlines
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
}; 