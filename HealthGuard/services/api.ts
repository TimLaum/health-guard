/**
 * API Service for HealthGuard Vision
 * Handles all HTTP communication with the Flask backend
 */

import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api';
import { Platform } from 'react-native';
import {USE_MOCK_API} from '@/constants/api';



const TOKEN_KEY = 'healthguard_jwt_token';

// ─── Mock Data ────────────────────────────────────────────────────────
const MOCK_USER: User = {
  _id: '507f1f77bcf86cd799439011',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  sex: 'M',
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

const MOCK_ANALYSIS_RECORDS: AnalysisRecord[] = [
  {
    _id: '507f1f77bcf86cd799439012',
    user_id: MOCK_USER._id,
    image_type: 'eye',
    image_url: 'https://placehold.net/4.png',
    uploaded_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    result: {
      type: 'diabetes',
      probability: 0.82,
      model_version: '1.2.0',
    },
  },
  {
    _id: '507f1f77bcf86cd799439013',
    user_id: MOCK_USER._id,
    image_type: 'skin',
    image_url: 'https://placehold.net/4.png',
    uploaded_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    result: {
      type: 'anemia',
      probability: 0.45,
      model_version: '1.2.0',
    },
  },
  {
    _id: '507f1f77bcf86cd799439014',
    user_id: MOCK_USER._id,
    image_type: 'nail',
    image_url: 'https://placehold.net/4.png',
    uploaded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    result: {
      type: 'deficiency',
      probability: 0.62,
      model_version: '1.2.0',
    },
  },
  {
    _id: '507f1f77bcf86cd799439015',
    user_id: MOCK_USER._id,
    image_type: 'eye',
    image_url: 'https://placehold.net/4.png',
    uploaded_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    result: {
      type: 'diabetes',
      probability: 0.25,
      model_version: '1.1.5',
    },
  },
];

// Store for newly created records during this session
let sessionRecords: AnalysisRecord[] = [];

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
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('API Request:', {
    url,
    method: options.method || 'GET',
    baseUrl: API_BASE_URL,
  });
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Network error' }));
      console.error('API Error:', error);
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API Request Failed:', {
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
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
  if (USE_MOCK_API) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    if (email === 'test@example.com' && password === 'password123') {
      const mockUser: User = {
        _id: '1',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        sex: 'M',
        created_at: new Date().toISOString(),
      };
      return {
        token: 'mock_token_' + Date.now(),
        user: mockUser,
      };
    }
    throw new Error('Invalid credentials');
  }
  
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
  if (USE_MOCK_API) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser: User = {
      _id: '507f1f77bcf86cd799439016',
      email,
      first_name: firstName,
      last_name: lastName,
      sex,
      created_at: new Date().toISOString(),
    };
    return {
      token: 'mock_token_' + Date.now(),
      user: mockUser,
    };
  }
  
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
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_USER;
  }
  
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
  if (USE_MOCK_API) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const resultTypes: Array<'diabetes' | 'anemia' | 'deficiency'> = ['diabetes', 'anemia', 'deficiency'];
    const randomType = resultTypes[Math.floor(Math.random() * resultTypes.length)];
    
    const mockRecord: AnalysisRecord = {
      _id: `507f1f77bcf86cd799439${Date.now().toString().slice(-3)}`,
      user_id: MOCK_USER._id,
      image_type: imageType,
      image_url: imageUri,
      uploaded_at: new Date().toISOString(),
      result: {
        type: randomType,
        probability: Math.random() * 0.6 + 0.2, // Random between 0.2 and 0.8
        model_version: '1.2.0',
      },
    };
    
    // Store in session records so it can be retrieved later
    sessionRecords.push(mockRecord);
    
    return mockRecord;
  }

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
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 600));
    // Return both predefined and session records
    return [...MOCK_ANALYSIS_RECORDS, ...sessionRecords];
  }
  
  return request<AnalysisRecord[]>(API_ENDPOINTS.GET_HISTORY);
}

export async function getAnalysisResult(id: string): Promise<AnalysisRecord> {
  if (USE_MOCK_API) {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Search in both predefined and session records
    const record = MOCK_ANALYSIS_RECORDS.find(r => r._id === id) || 
                   sessionRecords.find(r => r._id === id);
    if (!record) {
      throw new Error('Analysis record not found');
    }
    return record;
  }
  
  return request<AnalysisRecord>(`${API_ENDPOINTS.GET_RESULTS}/${id}`);
}
