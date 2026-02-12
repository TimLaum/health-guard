/**
 * API Configuration for HealthGuard Vision
 * Points to the Flask backend API
 */

// Change this to your Flask backend URL
// For iOS Simulator: use 127.0.0.1 (maps to host machine localhost)
// For Physical iOS Device: use your machine IP (e.g., 192.168.21.211)
const DEV_API_URL = "http://192.168.21.96:5000"; // Use local network IP
const PROD_API_URL = "https://your-azure-api.azurecontainer.io/api";

export const API_BASE_URL = DEV_API_URL; // or your actual API URL
export const USE_MOCK_API = false; // Set to false to use real API

export const API_ENDPOINTS = {
  // Auth
  LOGIN: "/auth",
  REGISTER: "/signup",
  PROFILE: "/profile",
  RE_AUTH: "/re-auth",

  // Analysis
  UPLOAD_IMAGE: "/predict",
  GET_HISTORY: "/histories",

  // Profile management
  CHANGE_PASSWORD: "/change-password",
  EXPORT_DATA: "/export-data",
  DELETE_HISTORY: "/delete-history",

  // Health
  HEALTH_CHECK: "/health",
};
