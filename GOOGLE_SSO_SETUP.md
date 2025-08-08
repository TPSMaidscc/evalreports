# Google SSO Setup Guide for Maids.cc Dashboard

## Overview
This guide will help you set up Google Single Sign-On (SSO) for the Reports Dashboard with domain restriction to `@maids.cc` email addresses only.

## Quick Toggle
**Authentication is currently DISABLED by default.** To enable/disable authentication:

### Enable Authentication:
1. Open `src/utils/constants.js`
2. Change: `export const AUTH_ENABLED = true;`
3. Follow the setup steps below

### Disable Authentication:
1. Open `src/utils/constants.js`
2. Change: `export const AUTH_ENABLED = false;`
3. No further setup needed - dashboard works without authentication

## Prerequisites
- Google Cloud Console access
- Admin access to the web application
- Domain ownership verification for maids.cc (if needed)

## Step 1: Google Cloud Console Setup

### 1. Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name your project (e.g., "Maids Dashboard SSO")

### 2. Enable Required APIs
1. Go to **APIs & Services** > **Library**
2. Search for and enable:
   - **Google Identity Services API**
   - **Google+ API** (if available)

### 3. Configure OAuth Consent Screen
1. Go to **APIs & Services** > **OAuth consent screen**
2. Choose **Internal** (if using Google Workspace) or **External**
3. Fill in required information:
   - **App name**: `Maids Dashboard`
   - **User support email**: Your admin email
   - **App logo**: Upload company logo (optional)
   - **Authorized domains**: Add `maids.cc`
   - **Developer contact email**: Your admin email
4. Add scopes:
   - `email`
   - `profile`
   - `openid`
5. Save and continue

### 4. Create OAuth 2.0 Credentials
1. Go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth 2.0 Client IDs**
3. Select **Web application**
4. Configure settings:
   - **Name**: `Maids Dashboard Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000` (for development)
     - `https://yourdomain.com` (for production)
5. Click **Create**
6. **Copy the Client ID** - you'll need this for the .env file

## Step 2: Environment Configuration

### Add to your .env file:
```
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

Replace `your_google_client_id_here` with the actual Client ID from Step 1.4.

## Step 3: Domain Verification (Production Only)

For production deployment:

1. Go to **Google Search Console**
2. Add and verify ownership of your domain
3. This ensures the OAuth consent screen works properly

## Step 4: Testing

### Development Testing
1. Start your development server: `npm start`
2. Visit `http://localhost:3000`
3. You should see the Google Sign-In page
4. Test with a `@maids.cc` email address
5. Test with a non-maids.cc email to confirm domain restriction

### Expected Behavior
- ✅ **@maids.cc emails**: Should sign in successfully
- ❌ **Other domains**: Should show "Access restricted to @maids.cc email addresses only"

## Step 5: Production Deployment

### Before Deploying:
1. Update OAuth credentials with production URLs
2. Ensure HTTPS is enabled on your domain
3. Update environment variables with production Client ID
4. Test thoroughly in production environment

### Security Features Implemented:
- ✅ **Domain restriction**: Only @maids.cc emails allowed
- ✅ **JWT token validation**: Secure token handling
- ✅ **Session management**: Secure localStorage storage
- ✅ **Auto logout**: Clears session on sign out
- ✅ **Token refresh**: Handles expired sessions

## Troubleshooting

### Common Issues:

1. **"Invalid OAuth client" error**
   - Check that your domain is added to authorized origins
   - Verify the Client ID is correct

2. **"Access blocked" error**
   - Ensure OAuth consent screen is configured
   - Check that the user's email domain is exactly `maids.cc`

3. **Sign-in popup blocked**
   - Allow popups for your domain
   - Check browser popup blocker settings

4. **"Developer hasn't verified this app"**
   - Complete OAuth consent screen verification
   - Submit for Google verification if needed

### Support
- Check browser console for detailed error messages
- Verify network requests in Developer Tools
- Ensure JavaScript is enabled

## Security Notes

- Tokens are stored in localStorage and cleared on logout
- Domain validation happens both client-side and in token verification
- Sessions automatically expire when tokens become invalid
- No sensitive data is stored in client-side storage

## Features

### User Experience:
- **Seamless login**: One-click Google sign-in
- **Profile display**: Shows user name and picture in header
- **Easy logout**: Click profile menu > Sign out
- **Session persistence**: Stays logged in across browser sessions
- **Security feedback**: Clear error messages for unauthorized access

### Admin Features:
- **Domain enforcement**: Automatic restriction to maids.cc
- **User identification**: Full name and email tracking
- **Secure sessions**: Proper token management
- **Easy deployment**: Environment-based configuration 