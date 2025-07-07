# Google Sheets Integration Setup

This document explains how to configure the Google Sheets integration for the Reports Dashboard.

## Prerequisites

1. **Google Cloud Project**: Create a Google Cloud project and enable the Google Sheets API
2. **API Key**: Generate an API key for the Google Sheets API
3. **Public Sheets**: Your Google Sheets must be publicly accessible (anyone with the link can view)

## Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Google Sheets API Configuration
REACT_APP_GOOGLE_SHEETS_API_KEY=your_google_sheets_api_key_here

# Definitions Sheet (shared across all departments)
REACT_APP_DEFINITIONS_SHEET_ID=your_definitions_spreadsheet_id

# Today's Snapshot Sheets (one per department)
REACT_APP_CC_SALES_SNAPSHOT_SHEET_ID=your_cc_sales_snapshot_sheet_id
REACT_APP_MV_RESOLVERS_SNAPSHOT_SHEET_ID=your_mv_resolvers_snapshot_sheet_id
REACT_APP_DOCTORS_SNAPSHOT_SHEET_ID=your_doctors_snapshot_sheet_id
REACT_APP_AT_FILIPINA_SNAPSHOT_SHEET_ID=your_at_filipina_snapshot_sheet_id
REACT_APP_DELIGHTERS_SNAPSHOT_SHEET_ID=your_delighters_snapshot_sheet_id
REACT_APP_CC_RESOLVERS_SNAPSHOT_SHEET_ID=your_cc_resolvers_snapshot_sheet_id
REACT_APP_MV_SALES_SNAPSHOT_SHEET_ID=your_mv_sales_snapshot_sheet_id
REACT_APP_MAIDS_AT_AFRICAN_SNAPSHOT_SHEET_ID=your_maids_at_african_snapshot_sheet_id
REACT_APP_MAIDS_AT_ETHIOPIAN_SNAPSHOT_SHEET_ID=your_maids_at_ethiopian_snapshot_sheet_id

# Conversion Funnel Sheets (one per department)
REACT_APP_CC_SALES_FUNNEL_SHEET_ID=your_cc_sales_funnel_sheet_id
REACT_APP_MV_RESOLVERS_FUNNEL_SHEET_ID=your_mv_resolvers_funnel_sheet_id
REACT_APP_DOCTORS_FUNNEL_SHEET_ID=your_doctors_funnel_sheet_id
REACT_APP_AT_FILIPINA_FUNNEL_SHEET_ID=your_at_filipina_funnel_sheet_id
REACT_APP_DELIGHTERS_FUNNEL_SHEET_ID=your_delighters_funnel_sheet_id
REACT_APP_CC_RESOLVERS_FUNNEL_SHEET_ID=your_cc_resolvers_funnel_sheet_id
REACT_APP_MV_SALES_FUNNEL_SHEET_ID=your_mv_sales_funnel_sheet_id
REACT_APP_MAIDS_AT_AFRICAN_FUNNEL_SHEET_ID=your_maids_at_african_funnel_sheet_id
REACT_APP_MAIDS_AT_ETHIOPIAN_FUNNEL_SHEET_ID=your_maids_at_ethiopian_funnel_sheet_id

# Loss of Interest Sheets (one per department)
REACT_APP_CC_SALES_LOSS_SHEET_ID=your_cc_sales_loss_sheet_id
REACT_APP_MV_RESOLVERS_LOSS_SHEET_ID=your_mv_resolvers_loss_sheet_id
REACT_APP_DOCTORS_LOSS_SHEET_ID=your_doctors_loss_sheet_id
REACT_APP_AT_FILIPINA_LOSS_SHEET_ID=your_at_filipina_loss_sheet_id
REACT_APP_DELIGHTERS_LOSS_SHEET_ID=your_delighters_loss_sheet_id
REACT_APP_CC_RESOLVERS_LOSS_SHEET_ID=your_cc_resolvers_loss_sheet_id
REACT_APP_MV_SALES_LOSS_SHEET_ID=your_mv_sales_loss_sheet_id
REACT_APP_MAIDS_AT_AFRICAN_LOSS_SHEET_ID=your_maids_at_african_loss_sheet_id
REACT_APP_MAIDS_AT_ETHIOPIAN_LOSS_SHEET_ID=your_maids_at_ethiopian_loss_sheet_id

# Trendlines Sheets (one per department)
REACT_APP_CC_SALES_TRENDLINES_SHEET_ID=your_cc_sales_trendlines_sheet_id
REACT_APP_MV_RESOLVERS_TRENDLINES_SHEET_ID=your_mv_resolvers_trendlines_sheet_id
REACT_APP_DOCTORS_TRENDLINES_SHEET_ID=your_doctors_trendlines_sheet_id
REACT_APP_AT_FILIPINA_TRENDLINES_SHEET_ID=your_at_filipina_trendlines_sheet_id
REACT_APP_DELIGHTERS_TRENDLINES_SHEET_ID=your_delighters_trendlines_sheet_id
REACT_APP_CC_RESOLVERS_TRENDLINES_SHEET_ID=your_cc_resolvers_trendlines_sheet_id
REACT_APP_MV_SALES_TRENDLINES_SHEET_ID=your_mv_sales_trendlines_sheet_id
REACT_APP_MAIDS_AT_AFRICAN_TRENDLINES_SHEET_ID=your_maids_at_african_trendlines_sheet_id
REACT_APP_MAIDS_AT_ETHIOPIAN_TRENDLINES_SHEET_ID=your_maids_at_ethiopian_trendlines_sheet_id
```

## Google Sheets Structure

### 1. Definitions Sheet
- **Single sheet** for all departments
- **Sheet Name**: "Definitions"
- **Columns**: eval, metric, description, formula, action, value

### 2. Today's Snapshot Sheets
- **One spreadsheet per department**
- **Sheet naming**: Each day should be in a separate sheet named with the date in YYYY-MM-DD format (e.g., "2024-01-15")
- **Format**: Key-value pairs (Column A: metric name, Column B: value)

### 3. Conversion Funnel Sheets
- **One spreadsheet per department**
- **Sheet naming**: Each day should be in a separate sheet named with the date in YYYY-MM-DD format
- **Format**: Table with headers in the first row

### 4. Loss of Interest Sheets
- **One spreadsheet per department**
- **Sheet naming**: Each day should be in a separate sheet named with the date in YYYY-MM-DD format
- **Format**: Table with headers in the first row

### 5. Trendlines Sheets
- **One spreadsheet per department**
- **Sheet naming**: Each day should be in a separate sheet named with the date in YYYY-MM-DD format
- **Format**: Multiple tables for different chart types (CVR, Loss of Interest, Repetition, etc.)

## Setup Steps

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one

2. **Enable Google Sheets API**
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

3. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the API key and add it to your `.env` file

4. **Get Sheet IDs**
   - For each Google Sheet, the ID is in the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
   - Copy each sheet ID and add it to your `.env` file

5. **Make Sheets Public**
   - For each sheet, click "Share" > "Anyone with the link" > "Viewer"
   - This allows the API to access the sheets without authentication

## Testing

After setting up the environment variables, you can test the integration by:

1. Starting the development server: `npm start`
2. Opening the dashboard and selecting different departments/dates
3. Checking the browser console for any error messages
4. Verifying that data loads correctly from your sheets

## Troubleshooting

- **403 Forbidden**: Check that your API key is valid and the Google Sheets API is enabled
- **400 Bad Request**: Verify that the sheet IDs are correct
- **No data loading**: Ensure the sheets are public and the sheet names match the expected date format (YYYY-MM-DD)
- **CORS errors**: This shouldn't happen with the Google Sheets API, but if it does, check your API key configuration 