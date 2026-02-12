/**
 * API Service for HealthGuard Vision
 * Handles all HTTP communication with the Flask backend
 */

import * as SecureStore from "expo-secure-store";
import { API_BASE_URL, API_ENDPOINTS } from "@/constants/api";
import { Platform } from "react-native";
import { USE_MOCK_API } from "@/constants/api";

const TOKEN_KEY = "healthguard_jwt_token";

// ─── Types matching backend responses ────────────────────────────────

/** User object — matches backend get_user_by_email() fields */
export interface User {
  _id: string;
  email: string;
  firstname: string;
  lastname: string;
  sex: "M" | "F";
  created_at: string;
}

/** POST /auth → { token } */
export interface LoginResponse {
  token: string;
}

/** POST /signup → { message } */
export interface RegisterResponse {
  message: string;
}

/** Single skin prediction inside SkinAnalysisResult.predictions[] */
export interface SkinPrediction {
  disease: string;
  confidence: number;
}

/** POST /predict response when analysis_type === "skin" */
export interface SkinAnalysisResult {
  success: boolean;
  analysis_type: "skin";
  predictions: SkinPrediction[];
  primary_diagnosis: string;
  confidence: number;
}

/** POST /predict response when analysis_type === "eye" | "nail" */
export interface AnemiaAnalysisResult {
  success: boolean;
  analysis_type: "eye" | "nail";
  message: string;
  hb_level: string;
  severity: "severe" | "moderate" | "light" | null;
  status: "anemia" | "normal" | "elevated";
}

/** Union of all possible /predict responses */
export type AnalysisResult = SkinAnalysisResult | AnemiaAnalysisResult;

/** Type guard: is this a skin result? */
export function isSkinResult(r: AnalysisResult): r is SkinAnalysisResult {
  return r.analysis_type === "skin";
}

/** History entry — matches backend get_patient_history() output */
export interface HistoryRecord {
  _id: string;
  patient_id: string;
  type: "eye" | "skin" | "nail";
  message: string;
  hb_level: string;
  created_at: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────
const MOCK_USER: User = {
  _id: "507f1f77bcf86cd799439011",
  email: "test@example.com",
  firstname: "John",
  lastname: "Doe",
  sex: "M",
  created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

const MOCK_HISTORY_RECORDS: HistoryRecord[] = [
  {
    _id: "507f1f77bcf86cd799439012",
    patient_id: MOCK_USER._id,
    type: "eye",
    message:
      "Anémie légère détectée, surveillance et consultation médicale conseillée",
    hb_level: "118.5 g/L",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "507f1f77bcf86cd799439013",
    patient_id: MOCK_USER._id,
    type: "skin",
    message: "Photos de Psoriasis Lichen Plan et Maladies Apparentées",
    hb_level: "",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    _id: "507f1f77bcf86cd799439014",
    patient_id: MOCK_USER._id,
    type: "nail",
    message:
      "Niveau d'hémoglobine normal, continuez à maintenir une alimentation équilibrée",
    hb_level: "142.0 g/L",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Token Management ────────────────────────────────────────────────
export async function getToken(): Promise<string | null> {
  if (Platform.OS === "web") {
    return localStorage.getItem(TOKEN_KEY);
  }
  return await SecureStore.getItemAsync(TOKEN_KEY);
}

export async function setToken(token: string): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.setItem(TOKEN_KEY, token);
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function removeToken(): Promise<void> {
  if (Platform.OS === "web") {
    localStorage.removeItem(TOKEN_KEY);
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

// ─── HTTP Helpers ────────────────────────────────────────────────────
async function authHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = await authHeaders();
  const url = `${API_BASE_URL}${endpoint}`;

  console.log("API Request:", {
    url,
    method: options.method || "GET",
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
      const error = await response
        .json()
        .catch(() => ({ error: "Network error" }));
      console.error("API Error:", error);
      throw new Error(
        error.error || error.message || `HTTP ${response.status}`,
      );
    }

    return response.json();
  } catch (error) {
    console.error("API Request Failed:", {
      url,
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

// ─── Auth API ────────────────────────────────────────────────────────

/** POST /auth — returns { token } only */
export async function loginApi(
  email: string,
  password: string,
): Promise<LoginResponse> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (email === "test@example.com" && password === "password123") {
      return { token: "mock_token_" + Date.now() };
    }
    throw new Error("Invalid credentials");
  }

  return request<LoginResponse>(API_ENDPOINTS.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

/** POST /signup — returns { message } */
export async function registerApi(
  firstname: string,
  lastname: string,
  sex: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { message: "User created successfully" };
  }

  return request<RegisterResponse>(API_ENDPOINTS.REGISTER, {
    method: "POST",
    body: JSON.stringify({ firstname, lastname, sex, email, password }),
  });
}

/** GET /profile — returns User */
export async function getProfileApi(): Promise<User> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return MOCK_USER;
  }

  return request<User>(API_ENDPOINTS.PROFILE);
}

/** POST /re-auth — refreshes token, returns { token } */
export async function reAuthApi(): Promise<LoginResponse> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { token: "mock_token_" + Date.now() };
  }

  return request<LoginResponse>(API_ENDPOINTS.RE_AUTH, {
    method: "POST",
  });
}

// ─── Analysis API ────────────────────────────────────────────────────

/** POST /predict — returns AnalysisResult (SkinAnalysisResult | AnemiaAnalysisResult) */
export async function uploadImageForAnalysis(
  imageUri: string,
  imageType: "eye" | "skin" | "nail",
): Promise<AnalysisResult> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (imageType === "skin") {
      return {
        success: true,
        analysis_type: "skin",
        predictions: [
          { disease: "Psoriasis Lichen Plan", confidence: 6.82 },
          { disease: "Kératoses Séborrhéiques", confidence: 6.8 },
          { disease: "Acné et Rosacée", confidence: 6.65 },
        ],
        primary_diagnosis: "Psoriasis Lichen Plan",
        confidence: 6.82,
      };
    }

    return {
      success: true,
      analysis_type: imageType,
      message:
        "Anémie légère détectée, surveillance et consultation médicale conseillée",
      hb_level: "118.5 g/L",
      severity: "light",
      status: "anemia",
    };
  }

  const token = await getToken();
  const formData = new FormData();

  const filename = imageUri.split("/").pop() || "photo.jpg";
  const match = /\.(\w+)$/.exec(filename);
  const mimeType = match ? `image/${match[1]}` : "image/jpeg";

  formData.append("image", {
    uri: imageUri,
    name: filename,
    type: mimeType,
  } as any);
  formData.append("type", imageType);

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_IMAGE}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ error: "Upload failed" }));
    throw new Error(error.error || error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/** GET /histories — returns HistoryRecord[] */
export async function getAnalysisHistory(): Promise<HistoryRecord[]> {
  if (USE_MOCK_API) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return [...MOCK_HISTORY_RECORDS];
  }

  return request<HistoryRecord[]>(API_ENDPOINTS.GET_HISTORY);
}
