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
      'MaidsAT African': '1NwutpT36E-lWnH1PDAqIoVLTzroKsKWvZ5WWdh8bUTE'
    }
  }
};

// Utility function to format date for sheet name with fallbacks
const formatDateForSheetName = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD format
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

  const url = `${GOOGLE_SHEETS_BASE_URL}/${spreadsheetId}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;
  
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
      
      // Handle different proxy response formats
      if (isAllOrigins && data.contents) {
        // AllOrigins wraps the response in a 'contents' field
        data = JSON.parse(data.contents);
      }
      
      return data.values || [];
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
export const fetchTodaysSnapshot = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.snapshot.spreadsheetIds[department];
    
    // Fetch data from the "Data" sheet
    const data = await fetchSheetData(spreadsheetId, 'Data!A:AZ');
    
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
        data = await fetchSheetData(spreadsheetId, `${sheetName}!A:P`);
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
    const spreadsheetId = SHEET_CONFIG.lossOfInterest.spreadsheetIds[department];
    const sheetName = formatDateForSheetName(date);
    
    // Fetch header rows (first 4 lines)
    const headerData = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A1:M4`
    );
    
    // Read from row 5 onwards (A5:M) to get the data rows
    const data = await fetchSheetData(
      spreadsheetId,
      `${sheetName}!A5:M`
    );
    
    if (data.length === 0) return { headers: headerData || [], data: [] };
    
    // Map the data to column letters (A, B, C, etc.)
    const columnHeaders = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
    const dataObjects = convertToObjects(data, columnHeaders);
    
    return {
      headers: headerData || [],
      data: dataObjects
    };
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

// Fetch trendlines data from snapshot Data sheet
export const fetchTrendlines = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.snapshot.spreadsheetIds[department];
    if (!spreadsheetId) {
      throw new Error(`No spreadsheet ID found for department: ${department}`);
    }
    
    // Fetch data from the "Data" sheet
    const data = await fetchSheetData(spreadsheetId, 'Data!A:AZ');
    
    if (data.length === 0) {
      return {
        cvrData: [],
        lossOfInterestData: [],
        repetitionData: [],
        delayData: [],
        sentimentData: [],
        toolsData: [],
        policyData: [],
        costData: []
      };
    }
    
    // Get header row and data rows
    const headers = data[0];
    const dataRows = data.slice(1);
    
    // Get target date range (30 days back)
    const targetDates = getDateRange(date, 30);
    const targetDateSet = new Set(targetDates);
    
    const trendlines = {
      cvrData: [],
      lossOfInterestData: [],
      repetitionData: [],
      delayData: [],
      sentimentData: [],
      toolsData: [],
      policyData: [],
      costData: []
    };
    
    // Process each row
    for (const row of dataRows) {
      if (row.length === 0 || !row[0]) continue;
      
      const rowDate = row[0]; // Assuming first column is Date
      
      // Only process rows within our target date range
      if (!targetDateSet.has(rowDate)) continue;
      
      // Convert row to object using headers
      const rowObj = {};
      headers.forEach((header, index) => {
        rowObj[header] = row[index] || '';
      });
      
      // CVR Data (disabled but keeping structure)
      const cvr = parsePercentage(rowObj['7DR-3DW']);
      const totalChats = parseInt(rowObj['Total Number of Chats']) || 0;
      if (cvr > 0 || totalChats > 0) {
        trendlines.cvrData.push({
          date: rowDate,
          chats: totalChats,
          cvr: cvr,
          cvr7dma: '' // Keep empty as requested
        });
      }
      
      // Loss of Interest Data (disabled but keeping structure)
      const lossOfInterest = parsePercentage(rowObj['Loss of interest']);
      if (lossOfInterest > 0) {
        trendlines.lossOfInterestData.push({
          date: rowDate,
          lossInterest: lossOfInterest,
          lossPricing: '', // Keep empty
          loss7dma: '' // Keep empty
        });
      }
      
      // Repetition Data - Parse "3.67%(9)" format
      const repetitionRaw = rowObj['Repetition %'];
      const repetition = parseRepetitionPercentage(repetitionRaw);
      if (repetition > 0) {
        trendlines.repetitionData.push({
          date: rowDate,
          chatsRep: repetition,
          chatsRep7dma: '' // Keep empty as requested
        });
      }
      
      // Delay Data - Parse "00:32 (0 msg > 4 Min)" format
      const initialDelayRaw = rowObj['Avg Delay - Initial msg'];
      const nonInitialDelayRaw = rowObj['Avg Delay - non-initial msg'];
      
      const avgDelayInit = parseTimeToSeconds(initialDelayRaw);
      const avgDelayNon = parseTimeToSeconds(nonInitialDelayRaw);
      const init4m = parseCountFromParentheses(initialDelayRaw);
      const nonInit4m = parseCountFromParentheses(nonInitialDelayRaw);
      
      if (avgDelayInit > 0 || avgDelayNon > 0 || init4m >= 0 || nonInit4m >= 0) {
        trendlines.delayData.push({
          date: rowDate,
          avgDelayInit: avgDelayInit,
          avgDelayNon: avgDelayNon,
          init4m: init4m,
          nonInit4m: nonInit4m
        });
      }
      
      // Sentiment Data - Use "Sentiment Analysis" directly
      const sentiment = parseFloat(rowObj['Sentiment Analysis']) || 0;
      if (sentiment > 0) {
        trendlines.sentimentData.push({
          date: rowDate,
          frustrated: '', // Keep empty
          sentiment: sentiment,
          sentiment7dma: '' // Keep empty
        });
      }
      
      // Tools Data (disabled but keeping structure)
      const wrongTools = parsePercentage(rowObj['Wrong tool called']);
      const toolsMissed = parsePercentage(rowObj['Missed to be called']);
      
      if (wrongTools > 0 || toolsMissed > 0) {
        trendlines.toolsData.push({
          date: rowDate,
          wrongTools: wrongTools,
          toolsMissed: toolsMissed
        });
      }
      
      // Policy Data (disabled but keeping structure)
      const ruleBreak = parsePercentage(rowObj['Rule Breaking']);
      const missing = parsePercentage(rowObj['Missing policy']);
      const unclear = parsePercentage(rowObj['Unclear policy']);
      const escalations = parsePercentage(rowObj['Transfers due to escalations']);
      const knownFlows = parsePercentage(rowObj['Transfers due to known flows']);
      
      if (ruleBreak > 0 || missing > 0 || unclear > 0 || escalations > 0 || knownFlows > 0) {
        trendlines.policyData.push({
          date: rowDate,
          ruleBreak: ruleBreak,
          missing: missing,
          unclear: unclear,
          transfers: escalations + knownFlows // Combine both transfer types
        });
      }
      
      // Cost Data - Parse "$32 (Last 30 days: $1,670)" format
      const costRaw = rowObj['Cost'];
      if (costRaw && costRaw.trim() !== '' && costRaw !== 'N/A') {
        const parseCostData = (costString) => {
          if (!costString) return { dailyCost: 0, last30DaysCost: null };
          
          // Remove $ signs and clean up
          const cleanCost = costString.replace(/\$/g, '').trim();
          
          // Check if it contains last 30 days data
          const match = cleanCost.match(/^(\d+(?:,\d{3})*(?:\.\d{2})?)\s*\(Last 30 days:\s*(\d+(?:,\d{3})*(?:\.\d{2})?)\)$/);
          
          if (match) {
            // Format: "$32 (Last 30 days: $1,670)"
            const dailyCost = parseFloat(match[1].replace(/,/g, '')) || 0;
            const last30DaysCost = parseFloat(match[2].replace(/,/g, '')) || 0;
            return { dailyCost, last30DaysCost };
          } else {
            // Format: "$32" (no last 30 days data)
            const dailyCost = parseFloat(cleanCost.replace(/,/g, '')) || 0;
            return { dailyCost, last30DaysCost: null };
          }
        };
        
        const costData = parseCostData(costRaw);
        
        if (costData.dailyCost > 0 || costData.last30DaysCost > 0) {
          trendlines.costData.push({
            date: rowDate,
            dailyCost: costData.dailyCost,
            last30DaysCost: costData.last30DaysCost
          });
        }
      }
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
      policyData: [],
      costData: []
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
    const data = await fetchSheetData(spreadsheetId, `${sheetName}!A:G`);
    
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
export const navigateToRawDataSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.rawData.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No raw data spreadsheet configured for department: ${department}`);
      return;
    }
    
    const sheetName = formatDateForSheetName(date);
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening URL with GID:', sheetUrl);
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
        alert(`The sheet for date ${date} (${sheetName}) does not exist in the ${department} raw data spreadsheet.`);
      } else {
        console.error('Error checking sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
      }
    }
  } catch (error) {
    console.error('Error navigating to raw data sheet:', error);
    alert('Error navigating to raw data sheet. Please try again.');
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
    
    const sheetName = `${formatDateForSheetName(date)} repetition`;
    
    // Check if the sheet exists by trying to fetch a small amount of data
    try {
      await fetchSheetData(spreadsheetId, `${sheetName}!A1:A1`);
      
      // Get the sheet GID for proper navigation
      console.log('Getting sheet GID for repetition:', sheetName);
      const gid = await getSheetGidByName(spreadsheetId, sheetName);
      
      if (gid !== null) {
        // Use the correct URL format with GID
        const sheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit?gid=${gid}#gid=${gid}`;
        console.log('Opening repetition URL with GID:', sheetUrl);
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
        console.error('Error checking repetition sheet existence:', error);
        alert('Error checking if the sheet exists. Please try again.');
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

// Function to navigate to sentiment analysis sheet
export const navigateToSentimentSheet = async (department, date) => {
  try {
    const spreadsheetId = SHEET_CONFIG.sentimentAnalysis.spreadsheetIds[department];
    
    if (!spreadsheetId) {
      alert(`No sentiment analysis spreadsheet configured for department: ${department}`);
      return;
    }
    
    // Map department names to sheet names for sentiment analysis
    const getDepartmentSheetName = (dept) => {
      const mapping = {
        'CC Sales': 'CC Sales',
        'MV Sales': 'MV Sales',
        'CC Resolvers': 'CC Resolvers',
        'MV Resolvers': 'MV Resolvers',
        'Delighters': 'Delighters',
        'Doctors': 'Doctors',
        'AT Filipina': 'Filipina',
        'MaidsAT African': 'African',
        'MaidsAT Ethiopian': 'Ethiopian'
      };
      return mapping[dept] || dept;
    };
    
    const departmentName = getDepartmentSheetName(department);
    const formattedDate = formatDateForSheetName(date);
    const sheetName = `${departmentName} ${formattedDate}`;
    
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
    
    const sheetName = formatDateForSheetName(date);
    
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

// Main function to fetch all dashboard data
export const fetchDashboardData = async (department, date, config = {}) => {
  try {
    console.log(`Fetching dashboard data for ${department} on ${date}`);
    
    // Add a small delay to prevent rapid successive calls
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Define which sections to fetch based on configuration
    const fetchTasks = [
      fetchDefinitions(),
      fetchTodaysSnapshot(department, date),
      fetchTrendlines(department, date),
      fetchRuleBreaking(department, date)
    ];
    
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
    if (shouldFetchLossOfInterest) {
      fetchTasks.push(fetchLossOfInterest(department, date));
    }
    
    const results = await Promise.allSettled(fetchTasks);
    
    // Map results back to expected structure
    let resultIndex = 0;
    const definitions = results[resultIndex++];
    const snapshot = results[resultIndex++];
    const trendlines = results[resultIndex++];
    const ruleBreaking = results[resultIndex++];
    
    const funnel = shouldFetchFunnel ? results[resultIndex++] : { status: 'fulfilled', value: [] };
    const lossOfInterest = shouldFetchLossOfInterest ? results[resultIndex++] : { status: 'fulfilled', value: { headers: [], data: [] } };

    // Process results and handle any failures
    const result = {
      definitions: definitions.status === 'fulfilled' ? definitions.value : [],
      snapshot: snapshot.status === 'fulfilled' ? snapshot.value : {},
      funnel: funnel.status === 'fulfilled' ? funnel.value : [],
      lossOfInterest: lossOfInterest.status === 'fulfilled' ? lossOfInterest.value : { headers: [], data: [] },
      trendlines: trendlines.status === 'fulfilled' ? trendlines.value : {
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
      }
    };

    // Log any failures
    if (definitions.status === 'rejected') console.warn('Failed to fetch definitions:', definitions.reason);
    if (snapshot.status === 'rejected') console.warn('Failed to fetch snapshot:', snapshot.reason);
    if (funnel.status === 'rejected') console.warn('Failed to fetch funnel:', funnel.reason);
    if (lossOfInterest.status === 'rejected') console.warn('Failed to fetch loss of interest:', lossOfInterest.reason);
    if (trendlines.status === 'rejected') console.warn('Failed to fetch trendlines:', trendlines.reason);
    if (ruleBreaking.status === 'rejected') console.warn('Failed to fetch rule breaking:', ruleBreaking.reason);

    return result;
  } catch (error) {
    console.error('Error in fetchDashboardData:', error);
    throw error;
  }
}; 