/**
 * API Configuration for HealthGuard Vision
 * Points to the Flask backend API
 */

// Change this to your Flask backend URL
// For iOS Simulator: use 127.0.0.1 (maps to host machine localhost)
// For Physical iOS Device: use your machine IP (e.g., 192.168.21.211)
const DEV_API_URL = 'http://127.0.0.1:5000/api'; // iOS simulator -> localhost
const PROD_API_URL = 'https://your-azure-api.azurecontainer.io/api';

const isDev = __DEV__;

export const API_BASE_URL = isDev ? DEV_API_URL : PROD_API_URL;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  PROFILE: '/auth/profile',

  // Analysis
  UPLOAD_IMAGE: '/analysis/upload',
  GET_RESULTS: '/analysis/results',
  GET_HISTORY: '/analysis/history',

  // Health
  HEALTH_CHECK: '/health',
};
