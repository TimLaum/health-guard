/**
 * API Configuration for HealthGuard Vision
 * Points to the Flask backend API
 */

// Change this to your Flask backend URL
const DEV_API_URL = 'http://10.0.2.2:5000/api'; // Android emulator -> localhost
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
