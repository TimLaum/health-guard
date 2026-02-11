/**
 * API Configuration for HealthGuard Vision
 * Points to the Flask backend API
 */

// Change this to your Flask backend URL
// For iOS Simulator: use 127.0.0.1 (maps to host machine localhost)
// For Physical iOS Device: use your machine IP (e.g., 192.168.21.211)
const DEV_API_URL = 'http://192.168.21.211:8000/api'; // Use local network IP
const PROD_API_URL = 'https://your-azure-api.azurecontainer.io/api';


export const API_BASE_URL = 'http://localhost:5000'; // or your actual API URL
export const USE_MOCK_API = true; // Set to false to use real API

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/user/profile',

  // Analysis
  UPLOAD_IMAGE: '/analysis/upload',
  GET_HISTORY: '/analysis/history',
  GET_RESULTS: '/analysis/results',

  // Health
  HEALTH_CHECK: '/health',
};
