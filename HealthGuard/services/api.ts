/**
 * API Service for HealthGuard Vision
 * Handles all HTTP communication with the Flask backend
 */

import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { Platform } from 'react-native';

const TOKEN_KEY = 'healthguard_jwt_token';

// ─── Token Management ────────────────────────────────────────────────
export async function getToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ─── HTTP Helpers ────────────────────────────────────────────────────
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = await authHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Auth API ────────────────────────────────────────────────────────
export interface LoginResponse {
  token: string;
  user: User;
}

export interface User {
  _id: string;
  email: string;
  first_name: string;
  last_name: string;
  sex: string;
  created_at: string;
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  firstName: string,
  lastName: string,
  sex: string,
  email: string,
  password: string
): Promise<LoginResponse> {
  return request<LoginResponse>(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify({
      first_name: firstName,
      last_name: lastName,
      sex,
      email,
      password,
    }),
  });
}

export async function getProfileApi(): Promise<User> {
  return request<User>(API_ENDPOINTS.PROFILE);
}

// ─── Analysis API ────────────────────────────────────────────────────
export interface AnalysisResult {
  type: 'diabetes' | 'anemia' | 'deficiency';
  probability: number;
  model_version: string;
}

export interface AnalysisRecord {
  _id: string;
  user_id: string;
  image_type: 'eye' | 'skin' | 'nail';
  image_url: string;
  uploaded_at: string;
  result: AnalysisResult;
}

export async function uploadImageForAnalysis(
  imageUri: string,
  imageType: 'eye' | 'skin' | 'nail'
): Promise<AnalysisRecord> {
  const token = await getToken();
  const formData = new FormData();

  const filename = imageUri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const mimeType = match ? `image/${match[1]}` : 'image/jpeg';

  formData.append('image', {
    uri: imageUri,
    name: filename,
    type: mimeType,
  } as any);
  formData.append('image_type', imageType);

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_IMAGE}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

export async function getAnalysisHistory(): Promise<AnalysisRecord[]> {
  return request<AnalysisRecord[]>(API_ENDPOINTS.GET_HISTORY);
}

export async function getAnalysisResult(id: string): Promise<AnalysisRecord> {
  return request<AnalysisRecord>(`${API_ENDPOINTS.GET_RESULTS}/${id}`);
}
