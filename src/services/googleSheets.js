import { calculate7DayMovingAverage } from '../utils/helpers';
import { AT_FILIPINA_SUB_DEPARTMENTS } from '../utils/constants';

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
  },
  ruleBreaking: {
    spreadsheetIds: {
      'CC Resolvers': '19GiEzoFz81sZ1rRYHkvabh_yNvtEndhnjtFDvmKt_bM',
      'MV Resolvers': '1jNZeBGOjz6MUevrbadTBxRUb3OJ8PN1Kh1NHNeotNsM',
      'CC Sales': '1iqVKp4O6Tp4C4_Humy88FAQPlCJgQncS59Foxa1fiSo',
      'MV Sales': '1vLLhy31Mu28aWOXtRoWMwpGHwIvalcReUO4C-zIGm7Q',
      'Delighters': '1Zjvd2tGbs7ibmOv8V62Y6sYlL_INu5IgvVRR-Q5Nnq4',
      'Doctors': '1V2d9vw_VFcAdTlLtkXRTpi4xJupLHQhsMvrTRtKSjgI',
      'AT Filipina': '1ADrFeuqrq9O6quOCcjdkseiWU1H2q5a13_Gxri1mUao',
      'MaidsAT African': '1I4pglnJ9HFEsWXi_IDXc4I8-L55WZgLtn-LXf01IAwU',
      'MaidsAT Ethiopian': '1AkPaP_Z6qtlHYzXCScUmMxuf9Jxm0nXvYYaTJtB7lcQ'
    }
  },
  rawData: {
    // Raw data spreadsheets for Total Number of Chats navigation
    spreadsheetIds: {
      'CC Sales': '1yKUCMoaUF99q886M7HCkMJU0e98q6cymK5cZqx-7O8Q',
      'AT Filipina': '1xb9jRjWF7VJZDiRGA6XNlBUOjo8pm1Du4t6oQf2cdwo',
      'Doctors': '1hRYfWB-Q63Jx_iBH3hniXUHHnuo5OVFQ3ByUE36vrYQ',
      'MV Resolvers': '1PHE5kxqx6ilYrxjqahxctfkUqM1R9Ite_avYouYiayM',
      'CC Resolvers': '17S_OzHycllz78d7YFSbqqMqJ10TdqZsy2aqGGY4gFNU',
      'Delighters': '1Cvw9h5WXPtp0okwiqj5ekUmwtfKXIjt64I6JVPpYK-U',
      'MV Sales': '1BmDM_bt7GGHq9fo_17vOAc79NTeayDciDlyQOkt-5hk',
      'MaidsAT African': '1WiJsu-cv80kscY7zOXo6zLyZY7wvePUXqOA_F_0bBgg',
      'MaidsAT Ethiopian': '1TWtkYyyOuAFOVh5qlEPRyURYVsSPDYX0O4tmZtAh4Tw'
    }
  },
  chatsShadowed: {
    // Chats shadowed spreadsheets for Chats shadowed % navigation
    spreadsheetIds: {
      'CC Sales': '1B1VeT7DdNweiueZYvAUh0JLMjIDsEbd5yriRNE_3z4w',
      'AT Filipina': '1zSq5dp0d0KHE5x0CgBNX4_GxLZB93MHPaHzAj8TPWDw',
      'Doctors': '1JM-s2R6lxDGq4bRDTVbf2u0N27LQh7WjqPgZ-x74yxs',
      'MV Resolvers': '1-08z4aa_pGL5C4FI7VXEId7HdP-l0LAzt4UXATYzHDU',
      'CC Resolvers': '1-iag6sNl3Fn3t8SXPPSPXZa-H7UpSzaIQDfKCSHq_aM',
      'Delighters': '1PbdfUy5fHnj1s50mzCxmjYIv2RfcmKcZZhGIe1gwOnY',
      'MV Sales': '1nqk0rAMg3sf_5KwRX45Ro14ywwkBdAPEY9cEZ5Itins',
      'MaidsAT African': '1SOAYahgMk9Y13YjiUG7Vz3yx8nc5vH0hfwkzLDvR0DQ',
      'MaidsAT Ethiopian': '1m5MXHBFYoVA_2gK0antpJSpnlE45eUH4BX_9CtOoIRs'
    }
  },
  sentimentAnalysis: {
    // Sentiment analysis spreadsheets for Sentiment analysis (/5) navigation
    spreadsheetIds: {
      'CC Sales': '13YEU9kJEX7LFp8KnbY6XXnGIvW5H574qIljy_GN4Yxs',
      'AT Filipina': '1Shz1_H7ifpZIT9jzhxDy4zIA_Qth2n8aiclsUusZgdQ',
      'Doctors': '1JIQCPsMn8fMw1UwcNUSoLjgBtfShbDIxjJUtWOLBIxw',
      'MV Resolvers': '1fkF4xglbJaMOOFr7wdOpvaGmrL5IOJF19NXwOV6YOg0',
      'CC Resolvers': '1qL3qWGNfIJZek6ZDr5g6yauegdt5Y8zDXDNxRroGK84',
      'Delighters': '1FmA1MfDQGQP0BGVJF0aW8d7IPd1L9Hd7RUa98CsUXOM',
      'MV Sales': '1PvWLMDV6hMGtQfcVFyXAjzOPNAo_kaV9D9n0BFpKw9Q',
      'MaidsAT African': '1ygyak-GQINyUMnUf828KLBZX_U0pTvVAOmsSPZdH0dA',
      'MaidsAT Ethiopian': '19ZK3agSB_R8cGbk-0bxITB0DeTN1NetOjFzhxaj90oo'
    }
  },
  unresponsiveChats: {
    // Unresponsive chats spreadsheets for Unresponsive Chats (%) navigation
    spreadsheetIds: {
      'MaidsAT Ethiopian': '1QALECmsK4y8Rem-SzcNus0xekmNT1Q9m2VB44ftnSrA',
      'AT Filipina': '1_2DzCsk87B6Vlki6HEfRpMuT_EbPDbQUdDx_LVTZm0E',
      'MaidsAT African': '1NwutpT36E-lWnH1PDAqIoVLTzroKsKWvZ5WWdh8bUTE',
      'MV Resolvers': '1PHE5kxqx6ilYrxjqahxctfkUqM1R9Ite_avYouYiayM'
    }
  },
  transferIntervention: {
    // Transfer and intervention analysis spreadsheet for MV Resolvers
    spreadsheetIds: {
      'MV Resolvers': '1hJUaSX75lgtKY8tnqzWVXF7MXUBGhlltTiHBu_xSM10'
    }
  }
};

// Transfer and intervention analysis spreadsheet ID
const TRANSFER_INTERVENTION_SPREADSHEET_ID = '1hJUaSX75lgtKY8tnqzWVXF7MXUBGhlltTiHBu_xSM10';

// Function to get sheet ID for a specific date tab in transfer intervention spreadsheet
export const getSheetIdForDateTab = async (dateTabName) => {
  try {
    console.log('getSheetIdForDateTab called with:', dateTabName);
    console.log('API Key available:', !!GOOGLE_SHEETS_API_KEY);
    console.log('Spreadsheet ID:', TRANSFER_INTERVENTION_SPREADSHEET_ID);
    
    const url = `${GOOGLE_SHEETS_BASE_URL}/${TRANSFER_INTERVENTION_SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    console.log('Fetching from URL:', url.replace(GOOGLE_SHEETS_API_KEY, 'API_KEY_HIDDEN'));
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
  
    
    // Find the sheet with the matching name
    const targetSheet = data.sheets.find(sheet => 
      sheet.properties.title === dateTabName
    );
    
    if (targetSheet) {
      return targetSheet.properties.sheetId;
    } else {
      console.warn(`Sheet "${dateTabName}" not found. Available sheets:`, data.sheets?.map(s => s.properties.title) || []);
      return null;
    }
  } catch (error) {
    console.error('Error fetching sheet information:', error);
    return null;
  }
};

// Utility function to format date for sheet name with fallbacks
const formatDateForSheetName = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
};

// Helper function to get the correct spreadsheet ID for AT Filipina sub-departments
const getSpreadsheetId = (sheetType, department, subDepartment = 'All') => {
  if (department === 'AT Filipina' && subDepartment !== 'All') {
    const subDeptConfig = AT_FILIPINA_SUB_DEPARTMENTS[subDepartment];
    if (subDeptConfig) {
      // Map sheetType to the correct property in AT_FILIPINA_SUB_DEPARTMENTS
      const configKey = sheetType === 'rawData' ? 'raw' : sheetType;
      return subDeptConfig[configKey] || SHEET_CONFIG[sheetType].spreadsheetIds[department];
    }
  }
  return SHEET_CONFIG[sheetType].spreadsheetIds[department];
};

// Try multiple date formats for sheet names
const tryMultipleDateFormats = (dateString) => {
  const date = new Date(dateString);
  
  return [
    // YYYY-MM-DD (ISO format)
    date.toISOString().split('T')[0],
    // MM/DD/YYYY (US format)
    `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`,
    // DD/MM/YYYY (UK format)
    `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`,
    // DD-MM-YYYY (Alternative format)
    `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`,
    // MM-DD-YYYY (Alternative US format)
    `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}-${date.getFullYear()}`
  ];
};


// Generic function to fetch data from Google Sheets with retry logic
const fetchSheetData = async (spreadsheetId, range, retries = 3) => {
  if (!GOOGLE_SHEETS_API_KEY) {
    throw new Error('Google Sheets API key not configured');
  }
  
  if (!spreadsheetId) {
    throw new Error('Spreadsheet ID not provided');
  }

  // Properly encode the range to handle special characters like % in sheet names
  const encodedRange = encodeURIComponent(range);
  const url = `${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}/values/${encodedRange}?key=${GOOGLE_SHEETS_API_KEY}`;
  
  console.log(`🔍 fetchSheetData Debug:`);
  console.log(`  - Spreadsheet ID: ${spreadsheetId}`);
  console.log(`  - Range: ${range}`);
  console.log(`  - Encoded Range: ${encodedRange}`);
  console.log(`  - URL: ${url.replace(GOOGLE_SHEETS_API_KEY, 'API_KEY_HIDDEN')}`);
  
  // Use CORS proxy to avoid CORS issues
  const corsProxies = [
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
    `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
    url // Fallback to direct URL in case proxies fail
  ];
  
  console.log(`Attempting to fetch: ${url.replace(GOOGLE_SHEETS_API_KEY, 'API_KEY_HIDDEN')}`);
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    // Try different CORS proxies on each retry
    const currentProxyUrl = corsProxies[attempt % corsProxies.length];
    const isAllOrigins = currentProxyUrl.includes('allorigins.win');
    const proxyType = currentProxyUrl.includes('corsproxy.io') ? 'CORSProxy' : 
                      currentProxyUrl.includes('allorigins.win') ? 'AllOrigins' : 'Direct';
    
    console.log(`Attempt ${attempt + 1}: Using ${proxyType} proxy`);
    
    try {
      const response = await fetch(currentProxyUrl);
      
      console.log(`  - Response status: ${response.status}`);
      console.log(`  - Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.status === 429) {
        // Rate limited - wait before retrying
        if (attempt < retries) {
          const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
          console.log(`Rate limited, waiting ${waitTime}ms before retry ${attempt + 1}/${retries}`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        } else {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
      }
      
      if (response.status === 400) {
        console.error(`400 Bad Request for URL: ${url.replace(GOOGLE_SHEETS_API_KEY, 'API_KEY_HIDDEN')}`);
        console.error(`Spreadsheet ID: ${spreadsheetId}`);
        console.error(`Range: ${range}`);
        throw new Error(`Bad Request: Invalid spreadsheet ID or sheet name/range. Check if sheet '${range.split('!')[0]}' exists.`);
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      let data = await response.json();
      
      console.log(`  - Raw response data:`, data);
      
      // Handle different proxy response formats
      if (isAllOrigins && data.contents) {
        // AllOrigins wraps the response in a 'contents' field
        data = JSON.parse(data.contents);
        console.log(`  - Parsed AllOrigins data:`, data);
      }
      
      const result = data.values || [];
      console.log(`  - Final result:`, result);
      console.log(`  - Result length: ${result.length}`);
      
      return result;
    } catch (error) {
      // Don't retry on 400 errors - they're usually permanent issues
      if (error.message.includes('Bad Request') || error.message.includes('400')) {
        throw error;
      }
      
      if (attempt === retries) {
        console.error('Error fetching sheet data after retries:', error);
        throw error;
      }
      
      // For non-rate-limit errors, also retry with backoff
      if (attempt < retries) {
        const waitTime = Math.pow(2, attempt) * 500; // Shorter backoff for other errors
        console.log(`Error occurred, waiting ${waitTime}ms before retry ${attempt + 1}/${retries}:`, error.message);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
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

// Fetch today's snapshot data from Data sheet
export const fetchTodaysSnapshot = async (department, date, subDepartment = 'All') => {
  try {
    const spreadsheetId = getSpreadsheetId('snapshot', department, subDepartment);
    
    // Fetch data from the "Data" sheet
    const data = await fetchSheetData(spreadsheetId, 'Data!A:BG');
    
    if (data.length === 0) return {};
    
    // Get header row and data rows
    const headers = data[0];
    const dataRows = data.slice(1);
    
    // Find the row with the matching date
    const targetDate = formatDateForSheetName(date);
    const targetRow = dataRows.find(row => row[0] === targetDate);
    
    if (!targetRow) return {};
    
    // Convert row to object using headers
    const snapshot = {};
    headers.forEach((header, index) => {
      if (header && targetRow[index] !== undefined) {
        snapshot[header] = targetRow[index];
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
    
    console.log(`Fetching conversion funnel for ${department} on ${date}`);
    console.log(`Spreadsheet ID: ${spreadsheetId}`);
    
    if (!spreadsheetId) {
      console.warn(`No spreadsheet ID configured for department: ${department}`);
      return [];
    }
    
    // Try multiple date formats
    const dateFormats = tryMultipleDateFormats(date);
    console.log(`Trying date formats:`, dateFormats);
    
    let data = null;
    let successfulSheetName = null;
    
    for (const sheetName of dateFormats) {
      try {
        console.log(`Trying sheet name: ${sheetName}`);
        data = await fetchSheetData(spreadsheetId, `${sheetName}!A:BP`);
        successfulSheetName = sheetName;
        console.log(`Successfully found data with sheet name: ${sheetName}`);
        break;
      } catch (error) {
        if (error.message.includes('Bad Request')) {
          console.log(`Sheet '${sheetName}' not found, trying next format...`);
          continue;
        } else {
          // If it's not a 400 error, throw it
          throw error;
        }
      }
    }
    
    if (!data) {
      console.warn(`No sheet found for ${department} on ${date}. Tried formats:`, dateFormats);
      return [];
    }
    
    if (data.length === 0) return [];
    
    // Special handling for CC Sales and MV Sales - complex table structure
    if (department === 'CC Sales' || department === 'MV Sales') {
      console.log(`${department} raw funnel data from Google Sheets:`, data);
      
      if (data.length === 0) return [];
      
      // Find the main table start - look for the summary table header
      let tableStart = -1;
      let headerRowStart = -1;
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const firstCell = row[0] || '';
        
        // Look for the summary table header
        if (firstCell.includes('Summary Table')) {
          tableStart = i;
          console.log(`Found ${department} Summary Table at row ${i}`);
          break;
        }
      }
      
      if (tableStart === -1) {
        console.warn(`${department} Summary Table not found`);
        return [];
      }
      
      // Find the actual header row (should contain "Applicant Stage")
      for (let i = tableStart + 1; i < data.length; i++) {
        const row = data[i];
        const firstCell = row[0] || '';
        
        if (firstCell.includes('Applicant Stage')) {
          headerRowStart = i;
          console.log(`Found header row at ${i}`);
          break;
        }
      }
      
      if (headerRowStart === -1) {
        console.warn('Header row with "Applicant Stage" not found');
        // Show more context about what we found
        console.log('Data around table start:');
        for (let i = Math.max(0, tableStart - 2); i < Math.min(data.length, tableStart + 10); i++) {
          console.log(`Row ${i}:`, data[i]);
        }
        return [];
      }
      
      // Extract headers from the complex multi-row header structure
      const headerRow1 = data[headerRowStart] || [];
      const headerRow2 = data[headerRowStart + 1] || [];
      
      console.log('Header row 1:', headerRow1);
      console.log('Header row 2:', headerRow2);
      
      // Show context around headers
      console.log('Context around headers:');
      for (let i = Math.max(0, headerRowStart - 1); i < Math.min(data.length, headerRowStart + 5); i++) {
        console.log(`Row ${i}:`, data[i]);
      }
      
      // Process the data rows after headers
      const dataRows = [];
      for (let i = headerRowStart + 2; i < data.length; i++) {
        const row = data[i];
        
        // Stop if we hit an empty row (but be more lenient about what constitutes empty)
        if (!row || row.length === 0 || (!row[0] && !row[1])) {
          console.log(`Stopped at empty row ${i}:`, row);
          break;
        }
        
        // Also stop if we hit a row that looks like a new section (starts with capital letters and has very few filled cells)
        const filledCells = row.filter(cell => cell && cell.toString().trim() !== '').length;
        if (filledCells <= 2 && row[0] && row[0].toString().length > 20) {
          console.log(`Stopped at potential section header at row ${i}:`, row);
          break;
        }
        
        dataRows.push(row);
        console.log(`Added data row ${i}:`, row);
      }
      
      console.log(`Found ${dataRows.length} data rows for ${department}`);
      console.log('All data rows:', dataRows);
      
      // If we have very few rows, let's be more aggressive in finding data
      if (dataRows.length < 5) {
        console.log('Too few rows found, trying alternative approach...');
        const alternativeRows = [];
        
        // Look for any row that has data in the first few columns after the headers
        for (let i = headerRowStart + 2; i < Math.min(headerRowStart + 50, data.length); i++) {
          const row = data[i];
          if (row && (row[0] || row[1]) && row[0] !== '') {
            alternativeRows.push(row);
            console.log(`Alternative approach - found row ${i}:`, row);
          }
        }
        
        if (alternativeRows.length > dataRows.length) {
          console.log(`Using alternative approach with ${alternativeRows.length} rows instead of ${dataRows.length}`);
          dataRows.length = 0; // Clear the array
          dataRows.push(...alternativeRows);
        }
      }
      
      // Return the raw structure for the component to handle the complex table layout
      return {
        type: 'salesFunnel',
        department: department,
        tableStart: tableStart,
        headerRow1: headerRow1,
        headerRow2: headerRow2,
        dataRows: dataRows,
        rawData: data
      };
    }
    
    // Special handling for AT Filipina - headers are in row 2, not row 1
    if (department === 'AT Filipina') {
      console.log('AT Filipina raw data from Google Sheets:', data);
      
      if (data.length < 2) return [];
      
      // Use the first occurrence of headers as the template
      const headers = data[1]; // Headers from first section
      console.log('AT Filipina headers:', headers);
      
      // Find section headers in the entire data array
      let outsideUAESectionStart = -1;
      let philippinesSectionStart = -1;
      
      console.log('AT Filipina - searching through', data.length, 'rows for section headers');
      
      for (let i = 0; i < data.length; i++) {
        const row = data[i];
        const firstCell = row[0] || '';
        
        console.log(`Row ${i}: "${firstCell}"`);
        
        if (firstCell.includes('Outside UAE')) {
          outsideUAESectionStart = i;
          console.log(`Found Outside UAE section at row ${i}`);
        } else if (firstCell.includes('Philippines')) {
          philippinesSectionStart = i;
          console.log(`Found Philippines section at row ${i}`);
        }
      }
      
      console.log('Final - Outside UAE section starts at index:', outsideUAESectionStart);
      console.log('Final - Philippines section starts at index:', philippinesSectionStart);
      
      // Extract data rows for each section
      let outsideUAERows = [];
      let philippinesRows = [];
      
      if (outsideUAESectionStart !== -1 && philippinesSectionStart !== -1) {
        // Outside UAE data: skip the section header and column header rows
        const outsideUAEDataStart = outsideUAESectionStart + 2; // Skip section header + column header
        const outsideUAEDataEnd = philippinesSectionStart;
        outsideUAERows = data.slice(outsideUAEDataStart, outsideUAEDataEnd);
        
        // Philippines data: skip the section header and column header rows  
        const philippinesDataStart = philippinesSectionStart + 2; // Skip section header + column header
        philippinesRows = data.slice(philippinesDataStart);
        
        console.log(`Outside UAE data rows ${outsideUAEDataStart} to ${outsideUAEDataEnd}:`, outsideUAERows);
        console.log(`Philippines data rows from ${philippinesDataStart}:`, philippinesRows);
      } else {
        console.log('Could not find both section headers - no data extracted');
      }
      
      console.log('Outside UAE rows:', outsideUAERows);
      console.log('Philippines rows:', philippinesRows);
      
      // Convert to objects - no filtering needed since we extracted clean data ranges
      const outsideUAEData = outsideUAERows
        .filter(row => row[0] && row[0].trim() !== '') // Only filter empty rows
        .map(row => {
          const obj = {};
          headers.forEach((header, headerIndex) => {
            obj[header] = row[headerIndex] || '';
          });
          return obj;
        });
      
      const philippinesData = philippinesRows
        .filter(row => row[0] && row[0].trim() !== '') // Only filter empty rows
        .map(row => {
          const obj = {};
          headers.forEach((header, headerIndex) => {
            obj[header] = row[headerIndex] || '';
          });
          return obj;
        });
      
      console.log('Final Outside UAE data:', outsideUAEData);
      console.log('Final Philippines data:', philippinesData);
      
      // Return sections separately for AT Filipina
      const result = {
        outsideUAE: outsideUAEData,
        philippines: philippinesData
      };
      
      console.log('AT Filipina final processed result:', result);
      return result;
    }
    
    // For other departments, use the original logic
    return convertToObjects(data);
  } catch (error) {
    console.error('Error fetching conversion funnel:', error);
    console.error('Department:', department);
    console.error('Date:', date);
    return [];
  }
};

// Fetch loss of interest data
export const fetchLossOfInterest = async (department, date) => {
  try {
    console.log(`🔍 fetchLossOfInterest called for department: ${department}, date: ${date}`);
    
    const spreadsheetId = SHEET_CONFIG.lossOfInterest.spreadsheetIds[department];
    const sheetName = formatDateForSheetName(date);
    
    console.log(`  - spreadsheetId: ${spreadsheetId}`);
    console.log(`  - sheetName: ${sheetName}`);
    
    // Fetch header rows (first 4 lines)
    const headerData = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A1:M4`
    );
    
    console.log(`  - headerData fetched:`, headerData);
    
    // Read from row 5 onwards (A5:M) to get the data rows
    const data = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A5:M`
    );
    
    console.log(`  - data rows fetched:`, data);
    
    if (data.length === 0) return { headers: headerData || [], data: [] };
    
    // Map the data to column letters (A, B, C, etc.)
    const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const dataObjects = convertToObjects(data, columnHeaders);
    
    const result = {
      headers: headerData || [],
      data: dataObjects
    };
    
    console.log(`  - returning result:`, result);
    return result;
  } catch (error) {
    console.error('Error fetching loss of interest:', error);
    return { headers: [], data: [] };
  }
};

// Helper function to parse time format (HH:MM) to seconds
const parseTimeToSeconds = (timeStr) => {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  
  // Extract time part before parentheses if they exist
  const timePart = timeStr.split('(')[0].trim();
  
  const timeParts = timePart.split(':');
  if (timeParts.length === 2) {
    const minutes = parseInt(timeParts[0]) || 0;
    const seconds = parseInt(timeParts[1]) || 0;
    return minutes * 60 + seconds;
  }
  return 0;
};

// Helper function to parse count from parentheses format "(3 msg > 4 Min)"
const parseCountFromParentheses = (str) => {
  if (!str || typeof str !== 'string') return 0;
  
  const match = str.match(/\((\d+)\s*msg/);
  return match ? parseInt(match[1]) || 0 : 0;
};

// Helper function to parse percentage string to number
const parsePercentage = (str) => {
  if (!str || typeof str !== 'string') return 0;
  const num = parseFloat(str.replace('%', ''));
  return isNaN(num) ? 0 : num;
};

// Helper function to parse repetition format "3.67%(9)" to get percentage
const parseRepetitionPercentage = (str) => {
  if (!str || typeof str !== 'string') return 0;
  const match = str.match(/^(\d+\.?\d*)%/);
  return match ? parseFloat(match[1]) : 0;
};

// Helper function to get date range (30 days back)
const getDateRange = (endDate, days = 30) => {
  const dates = [];
  const currentDate = new Date(endDate);
  
  for (let i = 0; i < days; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates.reverse(); // Return chronological order
};

// Helper function to get date range from a specific start date
const getDateRangeFromStart = (startDate, endDate) => {
  const dates = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const currentDate = new Date(start);
  while (currentDate <= end) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};

// Fetch trendlines data from snapshot Data sheet
export const fetchTrendlines = async (department, date, subDepartment = 'All') => {
  try {
    const spreadsheetId = getSpreadsheetId('snapshot', department, subDepartment);
    if (!spreadsheetId) {
      throw new Error(`No spreadsheet ID found for department: ${department}`);
    }
    
    // Fetch data from the "Data" sheet
    const data = await fetchSheetData(spreadsheetId, 'Data!A:BG');
    
    if (data.length === 0) {
      return {
        cvrData: [],
        lossOfInterestData: [],
        repetitionData: [],
        delayData: [],
        sentimentData: [],
        toolsData: [],
        policyData: [],
        costData: [],
        botHandledData: []
      };
    }
    
    // Get header row and data rows
    const headers = data[0];
    const dataRows = data.slice(1);
    
    // Get target date ranges for different metrics
    const defaultTargetDates = getDateRange(date, 30); // Last 30 days for all metrics
    const defaultTargetDateSet = new Set(defaultTargetDates);
    
    const trendlines = {
      totalChatsData: [],
      cvrData: [],
      lossOfInterestData: [],
      repetitionData: [],
      delayData: [],
      sentimentData: [],
      toolsData: [],
      policyData: [],
      costData: [],
      botHandledData: []
    };
    
    // Process each row
    for (const row of dataRows) {
      if (row.length === 0 || !row[0]) continue;
      
      const rowDate = row[0]; // Assuming first column is Date
      
      // Convert row to object using headers
      const rowObj = {};
      headers.forEach((header, index) => {
        rowObj[header] = row[index] || '';
      });
      
      // Total Number of Chats Data - chats supposed to be handled by bot (last 30 days)
      const totalChats = parseInt(rowObj['Total Number of Chats']) || 0;
      if (totalChats > 0 && defaultTargetDateSet.has(rowDate)) {
        trendlines.totalChatsData.push({
          date: rowDate,
          totalChats: totalChats,
          totalChats7dma: '' // Will be calculated later
        });
      }
      
      // CVR Data - only include points with actual CVR data (last 30 days)
      const cvr = parsePercentage(rowObj['7DR-3DW']);
      if (cvr > 0 && defaultTargetDateSet.has(rowDate)) {
        trendlines.cvrData.push({
          date: rowDate,
          cvr: cvr,
          cvr7dma: '' // Keep empty as requested
        });
      }
      
      // Loss of Interest Data (disabled but keeping structure) - last 30 days
      const lossOfInterest = parsePercentage(rowObj['Loss of interest']);
      if (lossOfInterest > 0 && defaultTargetDateSet.has(rowDate)) {
        trendlines.lossOfInterestData.push({
          date: rowDate,
          lossInterest: lossOfInterest,
          lossPricing: '', // Keep empty
          loss7dma: '' // Keep empty
        });
      }
      
      // Repetition Data - Parse "3.67%(9)" format (last 30 days)
      const repetitionRaw = rowObj['Repetition %'];
      const repetition = parseRepetitionPercentage(repetitionRaw);
      if (repetition > 0 && defaultTargetDateSet.has(rowDate)) {
        trendlines.repetitionData.push({
          date: rowDate,
          chatsRep: repetition,
          chatsRep7dma: '' // Keep empty as requested
        });
      }
      
      // Delay Data - Parse "00:32 (0 msg > 4 Min)" format (last 30 days)
      const initialDelayRaw = rowObj['Avg Delay - Initial msg'];
      const nonInitialDelayRaw = rowObj['Avg Delay - non-initial msg'];
      
      const avgDelayInit = parseTimeToSeconds(initialDelayRaw);
      const avgDelayNon = parseTimeToSeconds(nonInitialDelayRaw);
      const init4m = parseCountFromParentheses(initialDelayRaw);
      const nonInit4m = parseCountFromParentheses(nonInitialDelayRaw);
      
      if ((avgDelayInit > 0 || avgDelayNon > 0 || init4m >= 0 || nonInit4m >= 0) && defaultTargetDateSet.has(rowDate)) {
        trendlines.delayData.push({
          date: rowDate,
          avgDelayInit: avgDelayInit,
          avgDelayNon: avgDelayNon,
          init4m: init4m,
          nonInit4m: nonInit4m
        });
      }
      
      // Sentiment Data - Use "Sentiment Analysis" directly (last 30 days)
      const sentiment = parseFloat(rowObj['Sentiment Analysis']) || 0;
      if (sentiment > 0 && defaultTargetDateSet.has(rowDate)) {
        trendlines.sentimentData.push({
          date: rowDate,
          frustrated: '', // Keep empty
          sentiment: sentiment,
          sentiment7dma: '' // Keep empty
        });
      }
      
      // Tools Data (disabled but keeping structure) - last 30 days
      const wrongTools = parsePercentage(rowObj['Wrong tool called']);
      const toolsMissed = parsePercentage(rowObj['Missed to be called']);
      
      if ((wrongTools > 0 || toolsMissed > 0) && defaultTargetDateSet.has(rowDate)) {
        trendlines.toolsData.push({
          date: rowDate,
          wrongTools: wrongTools,
          toolsMissed: toolsMissed
        });
      }
      
      // Policy Data (disabled but keeping structure) - last 30 days
      const ruleBreak = parsePercentage(rowObj['Rule Breaking']);
      const missing = parsePercentage(rowObj['Missing policy']);
      const unclear = parsePercentage(rowObj['Unclear policy']);
      const escalations = parsePercentage(rowObj['Transfers due to escalations']);
      const knownFlows = parsePercentage(rowObj['Transfers due to known flows']);
      
      if ((ruleBreak > 0 || missing > 0 || unclear > 0 || escalations > 0 || knownFlows > 0) && defaultTargetDateSet.has(rowDate)) {
        trendlines.policyData.push({
          date: rowDate,
          ruleBreak: ruleBreak,
          missing: missing,
          unclear: unclear,
          transfers: escalations + knownFlows // Combine both transfer types
        });
      }
      
      // Cost Data - Parse "$32 (Last 30 days: $1,670)" format (last 30 days)
      const costRaw = rowObj['Cost'];
      if (costRaw && costRaw.trim() !== '' && costRaw !== 'N/A' && defaultTargetDateSet.has(rowDate)) {
        const parseCostData = (costString, department) => {
          if (!costString) return { dailyCost: 0, last30DaysCost: null };
          
          // Remove $ signs and clean up
          const cleanCost = costString.replace(/\$/g, '').trim();
          
          // Check if it contains last 30 days data
          // Handle AT Filipina format: "For all MaidsAT chatbots: $52 (Last 30 days: $1652)"
          if (department === 'AT Filipina') {
            const atFilipinaMatch = cleanCost.match(/For all MaidsAT chatbots:\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*\(Last 30 days:\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\)/);
            if (atFilipinaMatch) {
              const dailyCost = parseFloat(atFilipinaMatch[1].replace(/,/g, '')) || 0;
              const last30DaysCost = parseFloat(atFilipinaMatch[2].replace(/,/g, '')) || 0;
              return { dailyCost, last30DaysCost };
            }
          }
          
          // Handle standard format: "$32 (Last 30 days: $1,670)"
          const standardMatch = cleanCost.match(/^(\d+(?:,\d{3})*(?:\.\d{2})?)\s*\(Last 30 days:\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\)$/);
          
          if (standardMatch) {
            // Format: "$32 (Last 30 days: $1,670)"
            const dailyCost = parseFloat(standardMatch[1].replace(/,/g, '')) || 0;
            const last30DaysCost = parseFloat(standardMatch[2].replace(/,/g, '')) || 0;
            return { dailyCost, last30DaysCost };
          }
          
          // Handle simple format: "$52" (no last 30 days data)
          const simpleMatch = cleanCost.match(/^(\d+(?:,\d{3})*(?:\.\d{2})?)$/);
          if (simpleMatch) {
            const dailyCost = parseFloat(simpleMatch[1].replace(/,/g, '')) || 0;
            return { dailyCost, last30DaysCost: null };
          }
          
          // Default fallback
          return { dailyCost: 0, last30DaysCost: null };
        };
        
        // Bot Handled Data - Parse "Handling %" field (last 30 days)
        const botHandledPercentage = parsePercentage(rowObj['Handling %']);
        
        if (botHandledPercentage > 0 && defaultTargetDateSet.has(rowDate)) {
          trendlines.botHandledData.push({
            date: rowDate,
            botHandled: botHandledPercentage
          });
        }
        
        const costData = parseCostData(costRaw, department);
        
        if (costData.dailyCost > 0 || costData.last30DaysCost > 0) {
          trendlines.costData.push({
            date: rowDate,
            dailyCost: costData.dailyCost,
            last30DaysCost: costData.last30DaysCost
          });
        }
      }
    }
    
    // Calculate 7-day moving averages for relevant metrics
    const processedTrendlines = {
      ...trendlines,
      totalChatsData: calculate7DayMovingAverage(trendlines.totalChatsData, 'totalChats'),
      cvrData: calculate7DayMovingAverage(trendlines.cvrData, 'cvr'),
      repetitionData: calculate7DayMovingAverage(trendlines.repetitionData, 'chatsRep'),
      sentimentData: calculate7DayMovingAverage(trendlines.sentimentData, 'sentiment'),
      botHandledData: calculate7DayMovingAverage(trendlines.botHandledData, 'botHandled'),
      delayData: trendlines.delayData.map(item => ({
        ...item,
        avgDelayInit7dma: null, // Will be calculated separately for each delay metric
        avgDelayNon7dma: null,
        init4m7dma: null, // Will be calculated for 4-min count metrics
        nonInit4m7dma: null
      }))
    };
    
    // Calculate 7DMA for all delay metrics separately
    processedTrendlines.delayData = calculate7DayMovingAverage(processedTrendlines.delayData, 'avgDelayInit');
    processedTrendlines.delayData = calculate7DayMovingAverage(processedTrendlines.delayData, 'avgDelayNon');
    processedTrendlines.delayData = calculate7DayMovingAverage(processedTrendlines.delayData, 'init4m');
    processedTrendlines.delayData = calculate7DayMovingAverage(processedTrendlines.delayData, 'nonInit4m');
    
    return processedTrendlines;
  } catch (error) {
    console.error('Error fetching trendlines:', error);
    return {
      totalChatsData: [],
      cvrData: [],
      lossOfInterestData: [],
      repetitionData: [],
      delayData: [],
      sentimentData: [],
      toolsData: [],
      policyData: [],
      costData: [],
      botHandledData: []
    };
  }
};

// Fetch rule breaking data
export const fetchRuleBreaking = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.ruleBreaking.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      console.warn(`No rule breaking spreadsheet ID found for department: ${department}`);
      return {
        overallViolations: [],
        ruleBreakdown: []
      };
    }
    
    const sheetName = formatDateForSheetName(date);
    const data = await fetchSheetData(spreadsheetId, `${sheetName}!A:BG`);
    
    if (data.length === 0) {
      return {
        overallViolations: [],
        ruleBreakdown: []
      };
    }
    
    // Find where the two tables are separated
    let overallViolationsStart = -1;
    let ruleBreakdownStart = -1;
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      if (row[0] === 'Chat-bot' || row[0] === 'Chatbot') {
        overallViolationsStart = i;
      } else if (row[0] === 'Rule Title') {
        ruleBreakdownStart = i;
        break;
      }
    }
    
    const result = {
      overallViolations: [],
      ruleBreakdown: []
    };
    
    // Process overall violations table
    if (overallViolationsStart !== -1) {
      const overallHeaders = data[overallViolationsStart];
      
      for (let i = overallViolationsStart + 1; i < data.length; i++) {
        const row = data[i];
        
        // Stop if we hit an empty row or the start of the next table
        if (!row[0] || row[0] === 'Rule Title') break;
        
        const violation = {};
        overallHeaders.forEach((header, index) => {
          violation[header] = row[index] || '';
        });
        
        result.overallViolations.push(violation);
      }
    }
    
    // Process rule breakdown table
    if (ruleBreakdownStart !== -1) {
      const ruleHeaders = data[ruleBreakdownStart];
      
      for (let i = ruleBreakdownStart + 1; i < data.length; i++) {
        const row = data[i];
        
        // Stop if we hit an empty row
        if (!row[0]) break;
        
        const rule = {};
        ruleHeaders.forEach((header, index) => {
          rule[header] = row[index] || '';
        });
        
        result.ruleBreakdown.push(rule);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error fetching rule breaking data:', error);
    return {
      overallViolations: [],
      ruleBreakdown: []
    };
  }
};

// Fetch transfer and intervention analysis data for MV Resolvers
export const fetchTransferIntervention = async (department, date) => {
  try {
    // Only fetch for MV Resolvers
    if (department !== 'MV Resolvers') {
      return [];
    }

    const spreadsheetId = SHEET_CONFIG.transferIntervention.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      console.warn(`No transfer intervention spreadsheet ID found for department: ${department}`);
      return [];
    }
    
    const sheetName = formatDateForSheetName(date);
    console.log(`Fetching transfer intervention data for sheet: ${sheetName}`);
    
    // Expand range to include more columns (updated to include additional columns)
    const data = await fetchSheetData(spreadsheetId, `${sheetName}!A:BG`);
    
    if (data.length === 0) {
      console.warn('No data found in transfer intervention sheet');
      return [];
    }
    
    console.log(`Transfer intervention raw data (first 10 rows):`, data.slice(0, 10));
    
    // Look for header row with "Category" - search all columns, not just first column
    let headerRow = -1;
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j] && row[j].toString().toLowerCase().includes('category')) {
          headerRow = i;
          console.log(`Found header row at index ${i}:`, row);
          break;
        }
      }
      if (headerRow !== -1) break;
    }
    
    if (headerRow === -1) {
      console.warn('Header row with "Category" not found in transfer intervention data');
      console.log('All data rows:', data);
      return [];
    }
    
    const headers = data[headerRow];
    console.log('Headers found:', headers);
    const result = [];
    
    // Process data rows after the header
    for (let i = headerRow + 1; i < data.length; i++) {
      const row = data[i];
      
      // Stop if we hit an empty row or reach the end
      if (!row[0] || row[0].toString().trim() === '') {
        console.log(`Stopped at empty row ${i}`);
        break;
      }
      
      const item = {};
      headers.forEach((header, index) => {
        if (header && header.toString().trim() !== '') {
          item[header] = row[index] || '';
        }
      });
      
      // Only add non-empty items
      if (Object.keys(item).length > 0) {
        result.push(item);
      }
    }
    
    console.log(`Found ${result.length} transfer intervention items:`, result);
    return result;
  } catch (error) {
    console.error('Error fetching transfer intervention data:', error);
    return [];
  }
};

// Function to navigate to transfer/intervention raw data sheet for MV Resolvers
export const navigateToTransferInterventionRawSheet = async (department, date) => {
  try {
    // Only works for MV Resolvers
    if (department !== 'MV Resolvers') {
      alert(`Transfer/intervention raw data navigation only available for MV Resolvers`);
      return;
    }

    const spreadsheetId = '1hJUaSX75lgtKY8tnqzWVXF7MXUBGhlltTiHBu_xSM10';
    const baseSheetName = formatDateForSheetName(date);
    const sheetName = `${baseSheetName}-RAW`;
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for transfer/intervention raw:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening transfer/intervention raw URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The transfer/intervention raw sheet for date ${date} ("${sheetName}") does not exist in the spreadsheet.`);
      } else {
        console.error('Error checking transfer/intervention raw sheet existence:', error);
        alert('Error checking if the transfer/intervention raw sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to transfer/intervention raw sheet:', error);
    alert('Error navigating to transfer/intervention raw sheet. Please try again.');
  }
};

// Function to get sheet GID by name
const getSheetGidByName = async (spreadsheetId, sheetName) => {
  try {
    const url = `${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}?key=${GOOGLE_SHEETS_API_KEY}`;
    
    // Use CORS proxy
    const corsProxies = [
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      url
    ];
    
    for (const proxyUrl of corsProxies) {
      try {
        const response = await fetch(proxyUrl);
        if (!response.ok) continue;
        
        let data = await response.json();
        
        // Handle AllOrigins proxy response format
        if (proxyUrl.includes('allorigins.win') && data.contents) {
          data = JSON.parse(data.contents);
        }
        
        // Find the sheet with matching name
        const sheet = data.sheets?.find(s => s.properties?.title === sheetName);
        if (sheet) {
          return sheet.properties.sheetId;
        }
        
        break; // If we got a response, don't try other proxies
      } catch (error) {
        console.log('Proxy failed, trying next...');
        continue;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting sheet GID:', error);
    return null;
  }
};

// Function to navigate to raw data sheet for Total Number of Chats
export const navigateToRawDataSheet = async (department, date, subDepartment = 'All') => {
  try {
    const spreadsheetId = getSpreadsheetId('rawData', department, subDepartment);
    
    if (!spreadsheetId) {
      alert(`No raw data spreadsheet configured for department: ${department}`);
      return;
    }
    
    const baseSheetName = formatDateForSheetName(date);
    
    // Try multiple variations of the sheet name (with and without trailing space)
    const sheetNameVariations = [
      baseSheetName,           // YYYY-MM-DD
      `${baseSheetName} `      // YYYY-MM-DD (with trailing space)
    ];
    
    console.log('Trying raw data sheet name variations:', sheetNameVariations);
    
    let foundSheetName = null;
    let gid = null;
    
    // Try each variation until one works
    for (const sheetName of sheetNameVariations) {
      try {
        console.log(`Trying raw data sheet name: "${sheetName}"`);
        await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
        
        // Get the sheet GID for proper navigation
        console.log('Getting sheet GID for raw data:', sheetName);
        gid = await getSheetGidByName(spreadsheetId, sheetName);
        foundSheetName = sheetName;
        console.log(`Successfully found raw data sheet: "${sheetName}"`);
        break;
      } catch (error) {
        if (error.message.includes('Bad Request')) {
          console.log(`Raw data sheet "${sheetName}" not found, trying next variation...`);
          continue;
        } else {
          console.error('Error checking raw data sheet existence:', error);
          // Continue trying other variations
          continue;
        }
      }
    }
    
    if (foundSheetName) {
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening raw data URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', foundSheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${foundSheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } else {
      alert(`The sheet for date ${date} does not exist in the ${department} raw data spreadsheet.\n\nTried variations: ${sheetNameVariations.map(name => `"${name}"`).join(', ')}`);
    }
  } catch (error) {
    console.error('Error navigating to raw data sheet:', error);
    alert('Error navigating to raw data sheet. Please try again.');
  }
};

// Function to navigate to 80% similarity sheet 
export const navigateTo80SimilaritySheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.rawData.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No raw data spreadsheet configured for department: ${department}`);
      return;
    }
    
    const baseSheetName = formatDateForSheetName(date);
    
    // Try multiple variations of the sheet name (with and without trailing space before "80%similarity")
    const sheetNameVariations = [
      `${baseSheetName} 80%similarity`,     // YYYY-MM-DD 80%similarity
      `${baseSheetName}  80%similarity`     // YYYY-MM-DD  80%similarity (with extra space)
    ];
    
    console.log('Trying 80% similarity sheet name variations:', sheetNameVariations);
    
    let foundSheetName = null;
    let gid = null;
    
    // Try each variation until one works
    for (const sheetName of sheetNameVariations) {
      try {
        console.log(`Trying 80% similarity sheet name: "${sheetName}"`);
        await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
        
        // Get the sheet GID for proper navigation
        console.log('Getting sheet GID for 80% similarity:', sheetName);
        gid = await getSheetGidByName(spreadsheetId, sheetName);
        foundSheetName = sheetName;
        console.log(`Successfully found 80% similarity sheet: "${sheetName}"`);
        break;
      } catch (error) {
        if (error.message.includes('Bad Request')) {
          console.log(`80% similarity sheet "${sheetName}" not found, trying next variation...`);
          continue;
        } else {
          console.error('Error checking 80% similarity sheet existence:', error);
          // Continue trying other variations
          continue;
        }
      }
    }
    
    if (foundSheetName) {
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening 80% similarity URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', foundSheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${foundSheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } else {
      alert(`The 80% similarity sheet for date ${date} does not exist in the ${department} raw data spreadsheet.\n\nTried variations: ${sheetNameVariations.map(name => `"${name}"`).join(', ')}`);
    }
  } catch (error) {
    console.error('Error navigating to 80% similarity sheet:', error);
    alert('Error navigating to 80% similarity sheet. Please try again.');
  }
};

// Function to navigate to bot handled sheet
export const navigateToBotHandledSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.rawData.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No raw data spreadsheet configured for department: ${department}`);
      return;
    }
    
    const sheetName = `${formatDateForSheetName(date)} bot handled`;
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for bot handled:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening bot handled URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet "${sheetName}" does not exist in the ${department} raw data spreadsheet.`);
      } else {
        console.error('Error checking bot handled sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to bot handled sheet:', error);
    alert('Error navigating to bot handled sheet. Please try again.');
  }
};

// Function to navigate to repetition sheet
export const navigateToRepetitionSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.rawData.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No raw data spreadsheet configured for department: ${department}`);
      return;
    }
    
    // Try multiple variations of the sheet name
    const dateFormats = tryMultipleDateFormats(date);
    const sheetNameVariations = [];
    
    // For each date format, try both "Repetition" (capital) and "repetition" (lowercase)
    for (const dateFormat of dateFormats) {
      sheetNameVariations.push(`${dateFormat} Repetition`);
      sheetNameVariations.push(`${dateFormat} repetition`);
    }
    
    console.log('Trying repetition sheet name variations:', sheetNameVariations);
    
    let foundSheetName = null;
    let gid = null;
    
    // Try each variation until one works
    for (const sheetName of sheetNameVariations) {
      try {
        console.log(`Trying repetition sheet name: ${sheetName}`);
        await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
        
        // Get the sheet GID for proper navigation
        console.log('Getting sheet GID for repetition:', sheetName);
        gid = await getSheetGidByName(spreadsheetId, sheetName);
        foundSheetName = sheetName;
        console.log(`Successfully found repetition sheet: ${sheetName}`);
        break;
      } catch (error) {
        if (error.message.includes('Bad Request')) {
          console.log(`Repetition sheet '${sheetName}' not found, trying next variation...`);
          continue;
        } else {
          console.error('Error checking repetition sheet existence:', error);
          // Continue trying other variations
          continue;
        }
      }
    }
    
    if (foundSheetName) {
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening repetition URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', foundSheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${foundSheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } else {
      // None of the variations worked - open spreadsheet and ask user to find manually
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
      console.log('No repetition sheet variations found, opening basic URL:', sheetUrl);
      const opened = window.open(sheetUrl, '_blank');
      
      if (opened) {
        setTimeout(() => {
          alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab for date ${date} with "repetition" or "Repetition" in the name at the bottom and click on it.\n\nTried variations:\n${sheetNameVariations.slice(0, 4).join('\n')}`);
        }, 1500);
      }
    }
  } catch (error) {
    console.error('Error navigating to repetition sheet:', error);
    alert('Error navigating to repetition sheet. Please try again.');
  }
};

// Function to navigate to chats shadowed sheet
export const navigateToShadowedSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.chatsShadowed.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No chats shadowed spreadsheet configured for department: ${department}`);
      return;
    }
    
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for chats shadowed:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening chats shadowed URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the ${department} chats shadowed spreadsheet.`);
      } else {
        console.error('Error checking chats shadowed sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to chats shadowed sheet:', error);
    alert('Error navigating to chats shadowed sheet. Please try again.');
  }
};

// Function to navigate to raw data sheet with shadowing tab
export const navigateToShadowingRawDataSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.rawData.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No raw data spreadsheet configured for department: ${department}`);
      return;
    }
    
    const sheetName = `${formatDateForSheetName(date)} Shadowing`;
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for shadowing:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening shadowing raw data URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet "${sheetName}" does not exist in the ${department} raw data spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to shadowing raw data sheet:', error);
    alert('Error opening shadowing raw data sheet. Please try again.');
  }
};

// Function to navigate to sentiment analysis sheet
export const navigateToSentimentSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.sentimentAnalysis.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No sentiment analysis spreadsheet configured for department: ${department}`);
      return;
    }
    
    // Use YYYY-MM-DD format for all departments
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for sentiment analysis:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening sentiment analysis URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet "${sheetName}" does not exist in the ${department} sentiment analysis spreadsheet.`);
      } else {
        console.error('Error checking sentiment analysis sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to sentiment analysis sheet:', error);
    alert('Error navigating to sentiment analysis sheet. Please try again.');
  }
};

// Function to navigate to unresponsive chats sheet
export const navigateToUnresponsiveChatsSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.unresponsiveChats.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No unresponsive chats spreadsheet configured for department: ${department}`);
      return;
    }
    
    const sheetName = `${formatDateForSheetName(date)} unresponsive`;
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for unresponsive chats:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening unresponsive chats URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet "${sheetName}" does not exist in the ${department} unresponsive chats spreadsheet.`);
      } else {
        console.error('Error checking unresponsive chats sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to unresponsive chats sheet:', error);
    alert('Error navigating to unresponsive chats sheet. Please try again.');
  }
};

// Function to navigate to FTR (First Time Resolution) sheet for MV Resolvers
export const navigateToFTRSheet = async (department, date) => {
  try {
    // Only works for MV Resolvers
    if (department !== 'MV Resolvers') {
      alert(`FTR data navigation only available for MV Resolvers`);
      return;
    }

    const spreadsheetId = '1_20GZcWM5jLCNYkE8v2_CLxi7vTUvR3IRakWKcWZmfA';
    const sheetName = formatDateForSheetName(date); // This should be in YYYY-MM-DD format
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for FTR:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening FTR URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1000);
        } else {
          alert('❌ Unable to open the spreadsheet. Please check your popup blocker settings.');
        }
      }
    } catch (sheetError) {
      console.warn(`Sheet "${sheetName}" not found in FTR spreadsheet, opening spreadsheet root:`, sheetError);
      
      // Open the main spreadsheet if specific sheet is not found
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
      const opened = window.open(sheetUrl, '_blank');
      
      if (opened) {
        alert(`⚠️ Sheet "${sheetName}" not found.\n\n✅ Main spreadsheet opened. Please look for the correct date sheet manually.`);
      } else {
        alert('❌ Unable to open the spreadsheet. Please check your popup blocker settings.');
      }
    }
  } catch (error) {
    console.error('Error navigating to FTR sheet:', error);
    alert('❌ Error opening FTR sheet. Please try again or contact support.');
  }
};

// Function to navigate to False Promises sheet for MV Resolvers
export const navigateToFalsePromisesSheet = async (department, date) => {
  try {
    // Only works for MV Resolvers
    if (department !== 'MV Resolvers') {
      alert(`False Promises data navigation only available for MV Resolvers`);
      return;
    }

    const spreadsheetId = '12DXUaXOffHVVTj3ErFLmwWnCAEk1e-ljeA6OWACOen4';
    const sheetName = formatDateForSheetName(date); // This should be in YYYY-MM-DD format
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for False Promises:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening False Promises URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1000);
        } else {
          alert('❌ Unable to open the spreadsheet. Please check your popup blocker settings.');
        }
      }
    } catch (sheetError) {
      console.warn(`Sheet "${sheetName}" not found in False Promises spreadsheet, opening spreadsheet root:`, sheetError);
      
      // Open the main spreadsheet if specific sheet is not found
      const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
      const opened = window.open(sheetUrl, '_blank');
      
      if (opened) {
        alert(`⚠️ Sheet "${sheetName}" not found.\n\n✅ Main spreadsheet opened. Please look for the correct date sheet manually.`);
      } else {
        alert('❌ Unable to open the spreadsheet. Please check your popup blocker settings.');
      }
    }
  } catch (error) {
    console.error('Error navigating to False Promises sheet:', error);
    alert('❌ Error opening False Promises sheet. Please try again or contact support.');
  }
};

// Main function to fetch all dashboard data
export const fetchDashboardData = async (department, date, config = {}) => {
  try {
    const subDepartment = config.atFilipinaSubDept || 'All';
    console.log(`Fetching dashboard data for ${department} (${subDepartment}) on ${date}`);
    
    // Add a small delay to prevent rapid successive calls
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Define which sections to fetch based on configuration
    const fetchTasks = [
      fetchDefinitions(),
      fetchTodaysSnapshot(department, date, subDepartment),
      fetchTrendlines(department, date, subDepartment),
      fetchRuleBreaking(department, date),
      fetchTransferIntervention(department, date)
    ];
    
    // Only fetch policy escalation data for MV Resolvers
    if (department === 'MV Resolvers') {
      fetchTasks.push(fetchPolicyToEscalation(department, date));
    }
    
    // Only fetch conversion funnel for specific departments
    const shouldFetchFunnel = config.conversionFunnel?.enabledDepartments?.includes(department);
    console.log(`Department: ${department}, Should fetch funnel: ${shouldFetchFunnel}`);
    console.log('Enabled departments:', config.conversionFunnel?.enabledDepartments);
    if (shouldFetchFunnel) {
      console.log(`Adding funnel fetch task for ${department}`);
      fetchTasks.push(fetchConversionFunnel(department, date));
    }
    
    // Only fetch loss of interest if it's enabled and department is allowed
    const shouldFetchLossOfInterest = config.lossOfInterestTable?.enabled === true && 
      (!config.lossOfInterestTable?.allowedDepartments || config.lossOfInterestTable.allowedDepartments.includes(department));
    
    console.log(`🔍 fetchDashboardData - Loss of Interest check:`);
    console.log(`  - department: ${department}`);
    console.log(`  - config.lossOfInterestTable?.enabled: ${config.lossOfInterestTable?.enabled}`);
    console.log(`  - config.lossOfInterestTable?.allowedDepartments:`, config.lossOfInterestTable?.allowedDepartments);
    console.log(`  - shouldFetchLossOfInterest: ${shouldFetchLossOfInterest}`);
    
    if (shouldFetchLossOfInterest) {
      console.log(`  - Adding fetchLossOfInterest task for ${department}`);
      fetchTasks.push(fetchLossOfInterest(department, date));
    } else {
      console.log(`  - Skipping fetchLossOfInterest for ${department}`);
    }
    
    // Fetch AT Filipina Loss of Interest data specifically for AT Filipina department
    let atFilipinaLossOfInterest = { status: 'fulfilled', value: [] };
    if (department === 'AT Filipina') {
      console.log(`🔍 AT Filipina department detected - adding Loss of Interest fetch task`);
      console.log(`📅 Date being used: ${date}`);
      fetchTasks.push(fetchATFilipinaLossOfInterest(date));
    } else {
      console.log(`ℹ️ Department ${department} is not AT Filipina - skipping Loss of Interest fetch`);
    }
    
    const results = await Promise.allSettled(fetchTasks);
    
    // Map results back to expected structure
    let resultIndex = 0;
    const definitions = results[resultIndex++];
    const snapshot = results[resultIndex++];
    const trendlines = results[resultIndex++];
    const ruleBreaking = results[resultIndex++];
    const transferIntervention = results[resultIndex++];
    
    // Handle policy escalation data for MV Resolvers
    const policyEscalation = (department === 'MV Resolvers') ? results[resultIndex++] : { status: 'fulfilled', value: [] };
    
    const funnel = shouldFetchFunnel ? results[resultIndex++] : { status: 'fulfilled', value: [] };
    const lossOfInterest = shouldFetchLossOfInterest ? results[resultIndex++] : { status: 'fulfilled', value: { headers: [], data: [] } };
    
    // Handle AT Filipina Loss of Interest data
    if (department === 'AT Filipina') {
      atFilipinaLossOfInterest = results[resultIndex++];
    }

    // Process results and handle any failures
    const result = {
      definitions: definitions.status === 'fulfilled' ? definitions.value : [],
      snapshot: snapshot.status === 'fulfilled' ? snapshot.value : {},
      funnel: funnel.status === 'fulfilled' ? funnel.value : [],
      lossOfInterest: lossOfInterest.status === 'fulfilled' ? lossOfInterest.value : { headers: [], data: [] },
      atFilipinaLossOfInterest: atFilipinaLossOfInterest.status === 'fulfilled' ? atFilipinaLossOfInterest.value : [],
      trendlines: trendlines.status === 'fulfilled' ? trendlines.value : {
        totalChatsData: [],
        cvrData: [],
        lossOfInterestData: [],
        repetitionData: [],
        delayData: [],
        sentimentData: [],
        toolsData: [],
        policyData: [],
        costData: []
      },
      ruleBreaking: ruleBreaking.status === 'fulfilled' ? ruleBreaking.value : {
        overallViolations: [],
        ruleBreakdown: []
      },
      transferIntervention: transferIntervention.status === 'fulfilled' ? transferIntervention.value : [],
      policyEscalation: policyEscalation.status === 'fulfilled' ? policyEscalation.value : []
    };
    
    console.log(`🔍 fetchDashboardData - Final result structure:`);
    console.log(`  - lossOfInterest:`, result.lossOfInterest);
    console.log(`  - lossOfInterest.headers:`, result.lossOfInterest.headers);
    console.log(`  - lossOfInterest.data:`, result.lossOfInterest.data);

    // Log any failures
    if (definitions.status === 'rejected') console.warn('Failed to fetch definitions:', definitions.reason);
    if (snapshot.status === 'rejected') console.warn('Failed to fetch snapshot:', snapshot.reason);
    if (funnel.status === 'rejected') console.warn('Failed to fetch funnel:', funnel.reason);
    if (lossOfInterest.status === 'rejected') console.warn('Failed to fetch loss of interest:', lossOfInterest.reason);
    if (trendlines.status === 'rejected') console.warn('Failed to fetch trendlines:', trendlines.reason);
    if (ruleBreaking.status === 'rejected') console.warn('Failed to fetch rule breaking:', ruleBreaking.reason);
    if (transferIntervention.status === 'rejected') console.warn('Failed to fetch transfer intervention:', transferIntervention.reason);
    if (policyEscalation.status === 'rejected') console.warn('Failed to fetch policy escalation:', policyEscalation.reason);
    if (atFilipinaLossOfInterest.status === 'rejected') console.warn('Failed to fetch AT Filipina loss of interest:', atFilipinaLossOfInterest.reason);

    console.log(`📊 AT Filipina Loss of Interest fetch result:`, atFilipinaLossOfInterest);
    if (department === 'AT Filipina') {
      console.log(`📊 AT Filipina Loss of Interest data:`, atFilipinaLossOfInterest.value);
      console.log(`📊 AT Filipina Loss of Interest status:`, atFilipinaLossOfInterest.status);
    }

    return result;
  } catch (error) {
    console.error('Error in fetchDashboardData:', error);
    throw error;
  }
};

// Navigation functions for MV Resolvers specific metrics

// Function to navigate to Policy to cause escalation sheet
export const navigateToPolicyEscalationSheet = async (department, date) => {
  try {
    const spreadsheetId = '1Fv6IzSYEAoLQhfPlFMPUb8mwNP9B723lUDv9dJHODSs';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Policy to cause escalation:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Policy to cause escalation URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Policy to cause escalation spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Policy to cause escalation sheet:', error);
    alert('Error opening Policy to cause escalation sheet. Please try again.');
  }
};

// Function to navigate to Clarification Requestedsheet
export const navigateToClarityScoreSheet = async (department, date) => {
  try {
    const spreadsheetId = '1AUN7_sJkFZXxhz63HM6FngRh-z3S6S5r4_D8hssAUHU';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Clarity Score:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Clarification RequestedURL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Clarification Requestedspreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Clarification Requestedsheet:', error);
    alert('Error opening Clarification Requestedsheet. Please try again.');
  }
};

// Function to navigate to Clients Suspecting AI sheet
export const navigateToClientsSuspectingAISheet = async (department, date) => {
  try {
    const spreadsheetId = '188ELCtuoKiYFYuOu8Y41hOGWPexVM03TSSAw8nOSd0Y';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Clients Suspecting AI:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Clients Suspecting AI URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Clients Suspecting AI spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Clients Suspecting AI sheet:', error);
    alert('Error opening Clients Suspecting AI sheet. Please try again.');
  }
};

// Function to navigate to Clients Questioning Legalties sheet
export const navigateToClientsQuestioningLegaltiesSheet = async (department, date) => {
  try {
    const spreadsheetId = '1KIn8ZHk1-AxN9JPq1Iy0-bhRNIG3130Uti6EWyC_djQ';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Clients Questioning Legalties:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Clients Questioning Legalties URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Clients Questioning Legalties spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Clients Questioning Legalties sheet:', error);
    alert('Error opening Clients Questioning Legalties sheet. Please try again.');
  }
};

// Function to navigate to Call Request sheet
export const navigateToCallRequestSheet = async (department, date) => {
  try {
    const spreadsheetId = '1uer1eNI-RhqY6jnkdpNkhUecISMNNQLGAlGaeVCWmiA';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Call Request:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Call Request URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Call Request spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Call Request sheet:', error);
    alert('Error opening Call Request sheet. Please try again.');
  }
};

// Function to navigate to Rebuttal Result sheet
export const navigateToRebuttalResultSheet = async (department, date) => {
  try {
    const spreadsheetId = '1uer1eNI-RhqY6jnkdpNkhUecISMNNQLGAlGaeVCWmiA';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Rebuttal Result:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Rebuttal Result URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Rebuttal Result spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Rebuttal Result sheet:', error);
    alert('Error opening Rebuttal Result sheet. Please try again.');
  }
};

// Function to navigate to Threatening Case Identifier sheet
export const navigateToThreateningCaseIdentifierSheet = async (department, date) => {
  try {
    const spreadsheetId = '1ulcfC7Z748YQbX-gH3kBCHxKfcz88ZJPevR28mSgBug';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Threatening Case Identifier:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Threatening Case Identifier URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Threatening Case Identifier spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Threatening Case Identifier sheet:', error);
    alert('Error opening Threatening Case Identifier sheet. Please try again.');
  }
};

// Function to navigate to Medical mis-prescriptions sheet
export const navigateToMedicalMisPrescriptionsSheet = async (department, date) => {
  try {
    const spreadsheetId = '18m4ct5UZ0OBdFRfJfsSJXkjLZOY9JCK5eqqcM333z4E';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Medical mis-prescriptions:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Medical mis-prescriptions URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Medical mis-prescriptions spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Medical mis-prescriptions sheet:', error);
    alert('Error opening Medical mis-prescriptions sheet. Please try again.');
  }
};

// Function to navigate to Unnecessary clinic recommendations sheet
export const navigateToUnnecessaryClinicRecommendationsSheet = async (department, date) => {
  try {
    const spreadsheetId = '1dZw0qyFCX3L2XuG-GTdNOO2bR73BB198lfJ-zvf1OSI';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Unnecessary Clinic Recommendations:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Unnecessary Clinic Recommendations URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Unnecessary Clinic Recommendations spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Unnecessary Clinic Recommendations sheet:', error);
    alert('Error opening Unnecessary Clinic Recommendations sheet. Please try again.');
  }
};

// Function to fetch Policy to Cause Escalation data
export const fetchPolicyToEscalation = async (department, date) => {
  try {
    const spreadsheetId = '1Fv6IzSYEAoLQhfPlFMPUb8mwNP9B723lUDv9dJHODSs';
    const sheetName = `${date}-summary`;
    const range = `${sheetName}!A:C`; // Columns A, B, C for Policy, Count, Percentage
    
    console.log(`Fetching Policy to Cause Escalation data for ${department} on ${date} from sheet: ${sheetName}`);
    
    const data = await fetchSheetData(spreadsheetId, range);
    
    if (!data || data.length === 0) {
      console.log('No Policy to Cause Escalation data found');
      return [];
    }
    
    // Skip the header row and convert to objects
    const headers = data[0];
    const rows = data.slice(1);
    
    const policyData = rows.map(row => ({
      policy: row[0] || '',
      count: row[1] || '0',
      percentage: row[2] || '0%'
    })).filter(item => item.policy.trim() !== ''); // Filter out empty rows
    
    console.log('Policy to Cause Escalation data processed:', policyData);
    return policyData;
    
  } catch (error) {
    console.error('Error fetching Policy to Cause Escalation data:', error);
    return [];
  }
};

// Function to navigate to Policy to cause escalation sheet for Doctors
export const navigateToDoctorsPolicyEscalationSheet = async (department, date) => {
  try {
    const spreadsheetId = '1JbZOR18qYmFah-ByM0227clI0_22wfmHwymYR6zwWAE';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Doctors Policy to cause escalation:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Doctors Policy to cause escalation URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Doctors Policy to cause escalation spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Doctors Policy to cause escalation sheet:', error);
    alert('Error opening Doctors Policy to cause escalation sheet. Please try again.');
  }
};

// Function to navigate to Clarification Requestedsheet for Doctors
export const navigateToDoctorsClarityScoreSheet = async (department, date) => {
  try {
    const spreadsheetId = '1OZuuxlXi7c0OjWhwLbjxkHh34mZSqYXTBC-Rbo5wVAg';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Doctors Clarity Score:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Doctors Clarification RequestedURL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Doctors Clarification Requestedspreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Doctors Clarification Requestedsheet:', error);
    alert('Error opening Doctors Clarification Requestedsheet. Please try again.');
  }
};

// Function to navigate to Clients Suspecting AI sheet for Doctors
export const navigateToDoctorsClientsSuspectingAISheet = async (department, date) => {
  try {
    const spreadsheetId = '1RyTaeFvZ9JttxFTl3T0d07Bzs9455-fG7Gh19fgP_L0';
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for Doctors Clients Suspecting AI:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening Doctors Clients Suspecting AI URL with GID:', sheetUrl);
        console.log('Sheet GID:', gid);
        console.log('Sheet name:', sheetName);
        console.log('Department:', department);
        
        window.open(sheetUrl, '_blank');
      } else {
        // Fallback to basic URL if GID not found
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;
        console.log('GID not found, opening basic URL:', sheetUrl);
        const opened = window.open(sheetUrl, '_blank');
        
        if (opened) {
          setTimeout(() => {
            alert(`✅ Spreadsheet opened!\n\n📋 Please look for the sheet tab named "${sheetName}" at the bottom and click on it.`);
          }, 1500);
        }
      }
    } catch (error) {
      if (error.message.includes('Bad Request')) {
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the Doctors Clients Suspecting AI spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to Doctors Clients Suspecting AI sheet:', error);
    alert('Error opening Doctors Clients Suspecting AI sheet. Please try again.');
  }
};

// Function to fetch Loss of Interest data for AT Filipina
export const fetchATFilipinaLossOfInterest = async (date) => {
  try {
    const spreadsheetId = '1GJXyFqiM1gn-jbWVEVI3TfIrFU3Ld8BQOPQFb-gMDaE';
    const sheetName = `${formatDateForSheetName(date)}-summary`;
    
    console.log(`=== AT FILIPINA LOSS OF INTEREST DEBUG ===`);
    console.log(`Date parameter received: ${date}`);
    console.log(`Formatted date: ${formatDateForSheetName(date)}`);
    console.log(`Target sheet name: ${sheetName}`);
    console.log(`Spreadsheet ID: ${spreadsheetId}`);
    console.log(`Google Sheets API Key available: ${!!GOOGLE_SHEETS_API_KEY}`);
    
    // First, let's check what sheets are available in this spreadsheet
    try {
      console.log(`Checking available sheets in spreadsheet...`);
      const spreadsheetInfo = await fetch(`${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}?key=${GOOGLE_SHEETS_API_KEY}`);
      
      if (!spreadsheetInfo.ok) {
        console.error(`Failed to fetch spreadsheet info: ${spreadsheetInfo.status} ${spreadsheetInfo.statusText}`);
        console.error(`Response headers:`, Object.fromEntries(spreadsheetInfo.headers.entries()));
        return [];
      }
      
      const spreadsheetData = await spreadsheetInfo.json();
      console.log(`Spreadsheet metadata:`, spreadsheetData);
      
      if (spreadsheetData.sheets) {
        console.log(`Available sheets in spreadsheet:`);
        spreadsheetData.sheets.forEach((sheet, index) => {
          console.log(`  ${index + 1}. "${sheet.properties.title}" (ID: ${sheet.properties.sheetId})`);
        });
        
        // Check if our target sheet exists
        const targetSheet = spreadsheetData.sheets.find(sheet => sheet.properties.title === sheetName);
        if (targetSheet) {
          console.log(`✅ Target sheet "${sheetName}" found!`);
        } else {
          console.log(`❌ Target sheet "${sheetName}" NOT found!`);
          console.log(`Available sheet names:`, spreadsheetData.sheets.map(s => s.properties.title));
          
          // Try to find similar sheet names
          const similarSheets = spreadsheetData.sheets.filter(sheet => 
            sheet.properties.title.includes(formatDateForSheetName(date)) ||
            sheet.properties.title.includes(date)
          );
          if (similarSheets.length > 0) {
            console.log(`🔍 Found similar sheets:`, similarSheets.map(s => s.properties.title));
          }
        }
      } else {
        console.log(`No sheets information found in spreadsheet metadata`);
      }
    } catch (metadataError) {
      console.error(`Error fetching spreadsheet metadata:`, metadataError);
    }
    
    console.log(`Attempting to fetch data from sheet: ${sheetName}`);
    
    // Try different approaches to fetch data
    let data = null;
    let fetchError = null;
    
    // Approach 1: Try the exact sheet name
    try {
      console.log(`🔄 Attempt 1: Fetching from exact sheet name "${sheetName}"`);
      data = await fetchSheetData(spreadsheetId, `${sheetName}!A:Z`);
      console.log(`✅ Success with exact sheet name`);
    } catch (error) {
      console.log(`❌ Failed with exact sheet name:`, error.message);
      fetchError = error;
      
      // Approach 2: Try without the summary suffix
      try {
        const alternativeSheetName = formatDateForSheetName(date);
        console.log(`🔄 Attempt 2: Fetching from alternative sheet name "${alternativeSheetName}"`);
        data = await fetchSheetData(spreadsheetId, `${alternativeSheetName}!A:Z`);
        console.log(`✅ Success with alternative sheet name`);
      } catch (error2) {
        console.log(`❌ Failed with alternative sheet name:`, error2.message);
        
        // Approach 3: Try with different date formats
        try {
          const dateObj = new Date(date);
          const alternativeFormats = [
            `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}-summary`,
            `${dateObj.getDate()}/${dateObj.getMonth() + 1}/${dateObj.getFullYear()}-summary`,
            `${dateObj.getMonth() + 1}/${dateObj.getDate()}/${dateObj.getFullYear()}-summary`
          ];
          
          console.log(`🔄 Attempt 3: Trying alternative date formats:`, alternativeFormats);
          
          for (const altFormat of alternativeFormats) {
            try {
              console.log(`  Trying format: "${altFormat}"`);
              data = await fetchSheetData(spreadsheetId, `${altFormat}!A:Z`);
              console.log(`✅ Success with format "${altFormat}"`);
              break;
            } catch (formatError) {
              console.log(`  ❌ Failed with format "${altFormat}":`, formatError.message);
            }
          }
        } catch (error3) {
          console.log(`❌ All alternative approaches failed`);
        }
      }
    }
    
    if (!data) {
      console.log(`❌ Could not fetch data from any sheet variation`);
      console.log(`Last fetch error:`, fetchError);
      return [];
    }
    
    console.log(`Raw data received:`, data);
    console.log(`Data length: ${data ? data.length : 'undefined'}`);
    
    if (!data || data.length === 0) {
      console.log('No AT Filipina Loss of Interest data found');
      return [];
    }
    
    // Skip the header row and convert to objects
    const headers = data[0];
    const rows = data.slice(1);
    
    console.log(`Headers:`, headers);
    console.log(`Data rows:`, rows);
    console.log(`Number of data rows: ${rows.length}`);
    
    // Check if headers are valid
    if (!headers || headers.length === 0) {
      console.log(`❌ No valid headers found in first row`);
      return [];
    }
    
    const lossOfInterestData = rows.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
      });
      return obj;
    }).filter(item => {
      // Filter out completely empty rows
      return Object.values(item).some(value => value && value.toString().trim() !== '');
    });
    
    console.log('AT Filipina Loss of Interest data processed:', lossOfInterestData);
    console.log(`Final processed data length: ${lossOfInterestData.length}`);
    console.log(`=== END DEBUG ===`);
    
    return lossOfInterestData;
    
  } catch (error) {
    console.error('Error fetching AT Filipina Loss of Interest data:', error);
    console.error('Full error details:', {
      message: error.message,
      stack: error.stack,
      date: date,
      spreadsheetId: '1GJXyFqiM1gn-jbWVEVI3TfIrFU3Ld8BQOPQFb-gMDaE'
    });
    return [];
  }
};

// Fetch LLM Cost Analysis data
export const fetchLLMCostData = async (date) => {
  try {
    const spreadsheetId = '1RPJL0yKqCH2LxT2fqJ-LJzJCcHRsbrnD0ryy0jgqN6w';
    const sheetName = `aggregate ${date}`;

    console.log(`Fetching LLM cost data for sheet: ${sheetName}`);

    // Fetch data from the sheet (extended range to include columns up to BH for detailed chatbot data)
    const data = await fetchSheetData(spreadsheetId, `${sheetName}!A:BH`);

    if (data.length === 0) {
      throw new Error('No data found in the sheet');
    }

    console.log(`LLM cost raw data (first 10 rows):`, data.slice(0, 10));

    // Helper function to check if value is valid (not empty, not "-", not null)
    const isValidValue = (value) => {
      return value && value !== '-' && value.toString().trim() !== '';
    };

    // Helper function to parse currency values
    const parseCurrencyValue = (value) => {
      if (!value) return 0;
      // Remove currency symbols, commas, and convert to number
      const cleanValue = value.toString().replace(/[$,]/g, '');
      return parseFloat(cleanValue) || 0;
    };

    // Parse Total Cost data (columns A, B, C starting from row 3, headers in row 2)
    const totalCostData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[0])) {
        const actualCost = isValidValue(row[1]) ? parseCurrencyValue(row[1]) : null;
        const forecastedCost = isValidValue(row[2]) ? parseCurrencyValue(row[2]) : null;

        // Only add if at least one cost value is valid
        if (actualCost !== null || forecastedCost !== null) {
          totalCostData.push({
            date: row[0],
            actualCost: actualCost,
            forecastedCost: forecastedCost
          });
        }
      }
    }

    // Parse Model data (columns E, F, G starting from row 3, headers in row 2)
    const modelData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[4]) && isValidValue(row[5]) && isValidValue(row[6])) {
        modelData.push({
          model: row[4],
          cost: parseCurrencyValue(row[5]),
          percentage: parseFloat(row[6]) || 0
        });
      }
    }

    // Parse Category data (columns H, I, J starting from row 3, headers in row 2)
    const categoryData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[7]) && isValidValue(row[8]) && isValidValue(row[9])) {
        categoryData.push({
          category: row[7],
          cost: parseCurrencyValue(row[8]),
          percentage: parseFloat(row[9]) || 0
        });
      }
    }

    // Parse Detailed Model data (columns M, N, O, P, Q starting from row 3, headers in row 2)
    // Headers: Date, OpenAI, Anthropic, Gemini, Other Models
    const detailedModelData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[12])) { // Column M (index 12) - Date
        detailedModelData.push({
          date: row[12],
          openai: isValidValue(row[13]) ? parseCurrencyValue(row[13]) : null, // Column N
          anthropic: isValidValue(row[14]) ? parseCurrencyValue(row[14]) : null, // Column O
          gemini: isValidValue(row[15]) ? parseCurrencyValue(row[15]) : null, // Column P
          otherModels: isValidValue(row[16]) ? parseCurrencyValue(row[16]) : null // Column Q
        });
      }
    }

    // Parse Detailed Category data (columns U, V, W, X, Y, Z, AA, AB, AC, AD, AE, AF, AG starting from row 3, headers in row 2)
    // Headers: Date, CC Resolvers, MV Resolvers, MV Sales, CC Sales, Delighters, Doctors, Maids At, Other Chatbots, Developers, ERP, Analytics, Testing
    const detailedCategoryData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[20])) { // Column U (index 20) - Date
        detailedCategoryData.push({
          date: row[20],
          ccResolvers: isValidValue(row[21]) ? parseCurrencyValue(row[21]) : null, // Column V
          mvResolvers: isValidValue(row[22]) ? parseCurrencyValue(row[22]) : null, // Column W
          mvSales: isValidValue(row[23]) ? parseCurrencyValue(row[23]) : null, // Column X
          ccSales: isValidValue(row[24]) ? parseCurrencyValue(row[24]) : null, // Column Y
          delighters: isValidValue(row[25]) ? parseCurrencyValue(row[25]) : null, // Column Z
          doctors: isValidValue(row[26]) ? parseCurrencyValue(row[26]) : null, // Column AA (index 26)
          maidsAt: isValidValue(row[27]) ? parseCurrencyValue(row[27]) : null, // Column AB (index 27)
          otherChatbots: isValidValue(row[28]) ? parseCurrencyValue(row[28]) : null, // Column AC (index 28)
          developers: isValidValue(row[29]) ? parseCurrencyValue(row[29]) : null, // Column AD (index 29)
          erp: isValidValue(row[30]) ? parseCurrencyValue(row[30]) : null, // Column AE (index 30)
          analytics: isValidValue(row[31]) ? parseCurrencyValue(row[31]) : null, // Column AF (index 31)
          testing: isValidValue(row[32]) ? parseCurrencyValue(row[32]) : null // Column AG (index 32)
        });
      }
    }

    // Parse Detailed Chatbot data from multiple column ranges

    // Sales data (columns AK, AL, AM starting from row 3, headers in row 2)
    // Headers: Date, CC Sales, MV Sales
    const salesData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[36])) { // Column AK (index 36) - Date
        salesData.push({
          date: row[36],
          ccSales: isValidValue(row[37]) ? parseCurrencyValue(row[37]) : null, // Column AL
          mvSales: isValidValue(row[38]) ? parseCurrencyValue(row[38]) : null  // Column AM
        });
      }
    }

    // Resolvers data (columns AR, AS, AT starting from row 3, headers in row 2)
    // Headers: Date, CC Resolvers, MV Resolvers
    const resolversData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[43])) { // Column AR (index 43) - Date
        resolversData.push({
          date: row[43],
          ccResolvers: isValidValue(row[44]) ? parseCurrencyValue(row[44]) : null, // Column AS
          mvResolvers: isValidValue(row[45]) ? parseCurrencyValue(row[45]) : null  // Column AT
        });
      }
    }

    // Medical data (columns AY, AZ, BA starting from row 3, headers in row 2)
    // Headers: Date, Doctors, Maids At
    const medicalData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[50])) { // Column AY (index 50) - Date
        medicalData.push({
          date: row[50],
          doctors: isValidValue(row[51]) ? parseCurrencyValue(row[51]) : null, // Column AZ
          maidsAt: isValidValue(row[52]) ? parseCurrencyValue(row[52]) : null  // Column BA
        });
      }
    }

    // Other chatbots data (columns BF, BG, BH starting from row 3, headers in row 2)
    // Headers: Date, Delighters, Other Chatbots
    const otherChatbotsData = [];
    for (let i = 2; i < data.length; i++) {
      const row = data[i];
      if (isValidValue(row[57])) { // Column BF (index 57) - Date
        otherChatbotsData.push({
          date: row[57],
          delighters: isValidValue(row[58]) ? parseCurrencyValue(row[58]) : null, // Column BG
          otherChatbots: isValidValue(row[59]) ? parseCurrencyValue(row[59]) : null // Column BH
        });
      }
    }

    const detailedChatbotData = {
      sales: salesData,
      resolvers: resolversData,
      medical: medicalData,
      otherChatbots: otherChatbotsData
    };

    console.log('Parsed LLM cost data:', {
      totalCost: totalCostData,
      modelData: modelData,
      categoryData: categoryData,
      detailedModelData: detailedModelData,
      detailedCategoryData: detailedCategoryData,
      detailedChatbotData: detailedChatbotData
    });

    return {
      totalCost: totalCostData,
      modelData: modelData,
      categoryData: categoryData,
      detailedModelData: detailedModelData,
      detailedCategoryData: detailedCategoryData,
      detailedChatbotData: detailedChatbotData
    };

  } catch (error) {
    console.error('Error fetching LLM cost data:', error);
    throw error;
  }
};

// Fetch LLM Cost Summary data from Page 2 tab
export const fetchLLMCostSummary = async (date) => {
  try {
    const spreadsheetId = '1RPJL0yKqCH2LxT2fqJ-LJzJCcHRsbrnD0ryy0jgqN6w';
    const sheetName = `Page 2 ${date}`;

    console.log(`Fetching LLM cost summary for sheet: ${sheetName}`);

    // Fetch specific cells containing the summary data
    const ranges = [
      `${sheetName}!F7`,  // Total Cost For Today
      `${sheetName}!B10`, // Total Cost For This Month
      `${sheetName}!J10`, // Total Cost For Last 30 Days
      `${sheetName}!B13`, // Total Cost For Last Month
      `${sheetName}!J13`  // Forecasted Cost For This Month
    ];

    // Fetch all ranges in a single batch request
    const batchData = await Promise.all(
      ranges.map(range => fetchSheetData(spreadsheetId, range))
    );

    // Helper function to parse cost value with percentage
    const parseCostWithPercentage = (value) => {
      if (!value || value === '-') {
        return { cost: 0, percentage: null, trend: null };
      }

      const valueStr = value.toString().trim();

      // Check if value contains percentage
      const percentageMatch = valueStr.match(/\(([+-]?\d+\.?\d*)%\)/);
      let percentage = null;
      let trend = null;
      let costStr = valueStr;

      if (percentageMatch) {
        percentage = parseFloat(percentageMatch[1]);
        trend = percentage >= 0 ? 'increase' : 'decrease';
        // Remove percentage part to get cost
        costStr = valueStr.replace(/\s*\([+-]?\d+\.?\d*%\)/, '').trim();
      }

      // Parse cost value (remove $ and commas)
      const cost = parseFloat(costStr.replace(/[$,]/g, '')) || 0;

      return { cost, percentage, trend };
    };

    // Extract and parse the values
    const summaryData = {
      totalCostToday: parseCostWithPercentage(batchData[0][0]?.[0]),
      totalCostThisMonth: parseCostWithPercentage(batchData[1][0]?.[0]),
      totalCostLast30Days: parseCostWithPercentage(batchData[2][0]?.[0]),
      totalCostLastMonth: parseCostWithPercentage(batchData[3][0]?.[0]),
      forecastedCostThisMonth: parseCostWithPercentage(batchData[4][0]?.[0])
    };

    console.log('Parsed LLM cost summary:', summaryData);

    return summaryData;
  } catch (error) {
    console.error('Error fetching LLM cost summary:', error);
    return {
      totalCostToday: { cost: 0, percentage: null, trend: null },
      totalCostThisMonth: { cost: 0, percentage: null, trend: null },
      totalCostLast30Days: { cost: 0, percentage: null, trend: null },
      totalCostLastMonth: { cost: 0, percentage: null, trend: null },
      forecastedCostThisMonth: { cost: 0, percentage: null, trend: null }
    };
  }
};

// Fetch LLM Cost table data from Page 3 tab
export const fetchLLMCostTable = async (date) => {
  try {
    const spreadsheetId = '1RPJL0yKqCH2LxT2fqJ-LJzJCcHRsbrnD0ryy0jgqN6w';
    const sheetName = `Page 3 ${date}`;

    console.log(`Fetching LLM cost table for sheet: ${sheetName}`);

    // Fetch data from the sheet starting from row 3 (headers) and row 4 (data)
    const data = await fetchSheetData(spreadsheetId, `${sheetName}!A3:O`);

    if (!data || data.length < 2) {
      console.log('No LLM cost table data found');
      return { headers: [], rows: [] };
    }

    // Helper function to parse currency values
    const parseCurrencyValue = (value) => {
      if (!value || value === '-') return 0;
      const cleanValue = value.toString().replace(/[$,]/g, '');
      return parseFloat(cleanValue) || 0;
    };

    // Extract headers from row 3 (index 0)
    const headers = data[0] || [];

    // Extract and parse data rows starting from row 4 (index 1)
    const rows = [];
    let currentProvider = '';

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (row && (row[0] || row[1])) { // Check if Provider or Model exists
        // If there's a provider name, update current provider
        if (row[0] && row[0].trim() !== '') {
          currentProvider = row[0].trim();
        }

        const parsedRow = {
          provider: row[0] || '', // Keep original provider value (empty for grouped rows)
          currentProvider: currentProvider, // Track the current provider group
          model: row[1] || '',
          ccResolvers: row[2] || '',
          mvResolvers: row[3] || '',
          mvSales: row[4] || '',
          ccSales: row[5] || '',
          delighters: row[6] || '',
          doctors: row[7] || '',
          maidsAt: row[8] || '',
          otherChatbots: row[9] || '',
          devs: row[10] || '',
          erpUsage: row[11] || '',
          analytics: row[12] || '',
          testing: row[13] || '',
          total: row[14] || '',
          isTotal: row[0] === 'Total' || row[1] === 'Total',
          isPrompts: row[0] === 'Prompts Input Tokens' || row[1] === 'Prompts Input Tokens'
        };

        // Debug logging for special rows
        if (parsedRow.isTotal || parsedRow.isPrompts || row[1] === 'Total' || row[1] === 'Prompts Input Tokens') {
          console.log(`🔍 Parsing special row:`, {
            rowIndex: i,
            provider: row[0],
            model: row[1],
            isTotal: parsedRow.isTotal,
            isPrompts: parsedRow.isPrompts,
            fullRow: row
          });
        }
        rows.push(parsedRow);
      }
    }

    // Force the last two rows to have the correct labels
    if (rows.length >= 2) {
      const lastTwoRows = rows.slice(-2);

      // Second-to-last row: Force to be "Total"
      if (lastTwoRows[0]) {
        lastTwoRows[0].provider = 'Total';
        lastTwoRows[0].model = 'Total';
        lastTwoRows[0].isTotal = true;
        lastTwoRows[0].isPrompts = false;
        console.log('🔧 Forced second-to-last row to be Total:', lastTwoRows[0]);
      }

      // Last row: Force to be "Prompts Input Tokens"
      if (lastTwoRows[1]) {
        lastTwoRows[1].provider = 'Prompts Input Tokens';
        lastTwoRows[1].model = 'Prompts Input Tokens';
        lastTwoRows[1].isTotal = false;
        lastTwoRows[1].isPrompts = true;
        console.log('🔧 Forced last row to be Prompts Input Tokens:', lastTwoRows[1]);
      }
    }

    console.log('📊 Parsed LLM cost table:', { headers, rows });

    return { headers, rows };
  } catch (error) {
    console.error('Error fetching LLM cost table:', error);
    return { headers: [], rows: [] };
  }
};

export default {
  fetchSheetData,
  fetchLLMCostData,
  fetchLLMCostSummary,
  fetchLLMCostTable
};