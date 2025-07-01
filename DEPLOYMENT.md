# 🚀 Vercel Deployment Guide

## Prerequisites
- Vercel account
- OpenWeatherMap API key

## Deployment Steps

### 1. Environment Variables Setup
Before deploying, you need to set up your environment variables in Vercel:

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variable:
   - **Name**: `VITE_WEATHER_API_KEY`
   - **Value**: Your OpenWeatherMap API key
   - **Environment**: Production, Preview, Development

### 2. Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect the configuration and deploy

### 3. Verify Deployment
After deployment, your app will be available at:
- **Production**: `https://your-project-name.vercel.app`
- **API Endpoints**: 
  - `https://your-project-name.vercel.app/api/weather`
  - `https://your-project-name.vercel.app/api/forecast`
  - `https://your-project-name.vercel.app/api/health`

## Architecture Overview

### Frontend (Static Build)
- Built with Vite
- Served as static files
- React SPA with client-side routing

### Backend (Serverless Functions)
- `/api/weather` - Current weather data
- `/api/forecast` - Weather forecast data  
- `/api/health` - Health check endpoint

### Environment Variables
- `VITE_WEATHER_API_KEY` - OpenWeatherMap API key

## Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Ensure `VITE_WEATHER_API_KEY` is set in Vercel environment variables
   - Check that the API key is valid and has proper permissions

2. **CORS Errors**
   - The API functions include CORS headers
   - If you're still getting CORS errors, check the request origin

3. **Build Failures**
   - Ensure all dependencies are in `package.json`
   - Check that the build command works locally: `npm run build`

4. **Function Timeouts**
   - API functions are configured with 10-second timeout
   - If you need longer timeouts, adjust the `maxDuration` in `vercel.json`

### Local Development
For local development, you can still use the original setup:
```bash
# Terminal 1: Frontend
npm run dev

# Terminal 2: Backend (optional for local dev)
npm run server
```

## Performance Optimization

1. **Bundle Size**: The build shows some large chunks. Consider:
   - Code splitting with dynamic imports
   - Lazy loading components
   - Optimizing dependencies

2. **Caching**: The app includes:
   - Client-side caching for weather data
   - Service worker for offline functionality
   - Vercel's edge caching for static assets

## Security Notes

- API keys are stored as environment variables
- CORS is properly configured
- Input validation is implemented
- Error handling prevents information leakage 