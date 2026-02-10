<div align="center">

<img src="health-guard/HealthGuard/assets/images/logo.png" alt="HealthGuard Vision Logo" width="140" />

# HealthGuard Vision

### 🩺 Diagnostic Préventif par Image

*AI-powered preventive health screening through image analysis*

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-API-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-ML-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)

---

**M1 Academic Project** · University 2025–2026

</div>

---

## 📋 About

**HealthGuard Vision** is a mobile health screening application that uses **artificial intelligence** to analyze photographs of eyes, skin, and nails — detecting early indicators of **diabetes**, **nutritional deficiencies**, and **anemia**.

> ⚠️ **Disclaimer**: This is an AI-assisted screening tool developed for academic purposes. It does **not** provide medical diagnoses. Always consult a qualified healthcare professional.

---

## 🔬 What It Detects

<table>
<tr>
<td align="center" width="33%">

### 👁️ Eye Scan
**Diabetic Retinopathy**

Analyzes retinal images to detect microaneurysms, hemorrhages, and exudates — early signs of diabetes-related eye damage.

</td>
<td align="center" width="33%">

### 🖐️ Skin Scan
**Nutritional Deficiencies**

Examines skin tone, texture, and color patterns to identify possible Vitamin D, B12, and zinc deficiency indicators.

</td>
<td align="center" width="33%">

### 💅 Nail Scan
**Anemia Detection**

Analyzes nail bed color, shape (spoon nails), and ridges to detect potential iron deficiency and anemia signs.

</td>
</tr>
</table>

---

## 🏗️ Project Architecture

```
health-guard/
│
├── 📱 HealthGuard/          ← Mobile App (React Native / Expo)
│   ├── app/                 ← Screens & navigation (expo-router)
│   │   ├── (auth)/          ← Login, Sign Up, Forgot Password
│   │   ├── (tabs)/          ← Home, Camera, History, Profile
│   │   ├── (legal)/         ← Terms of Service, Privacy Policy
│   │   ├── guide.tsx        ← User Guide & FAQ
│   │   └── results.tsx      ← AI Analysis Results
│   ├── contexts/            ← Auth context (JWT)
│   ├── services/            ← API client & token management
│   ├── constants/           ← Colors, API config
│   └── assets/              ← Logo & app icons
│
├── 🖥️ backend/              ← Flask REST API (coming soon)
│   ├── routes/              ← Auth, Analysis endpoints
│   ├── models/              ← Database models
│   └── config/              ← JWT, DB, CORS config
│
└── 🤖 ai-ml/                ← AI/ML Models (coming soon)
    ├── models/              ← TensorFlow / PyTorch models
    ├── training/            ← Training scripts & datasets
    └── preprocessing/       ← Image preprocessing pipelines
```

---

## 📱 Mobile App — Features

### 🔐 Authentication
- Secure login & registration with **JWT tokens**
- Tokens stored in **expo-secure-store** (encrypted)
- Forgot password flow with email reset
- Auth guard — protected routes with automatic redirects

### 🏠 Home Dashboard
- Personalized greeting with health status card
- Quick-access scan cards (Eye, Skin, Nail)
- Daily health tips
- Medical disclaimer

### 📸 Smart Capture
- Camera capture with **expo-image-picker**
- Gallery photo selection
- Scan-type specific tips for optimal photo quality
- Image preview before analysis

### 📊 AI Results
- Color-coded severity levels (Normal / Moderate / High Risk)
- AI confidence score with visual progress bar
- Detailed condition description
- Numbered health recommendations

### 📜 History & Tracking
- Chronological list of all past scans
- Filter by scan type (Eye / Skin / Nail)
- Severity badges and quick result preview
- Tap to view full results

### 👤 Profile & Settings
- User profile with scan statistics
- Links to Privacy Policy, Terms & Guide
- Data export and deletion options
- Secure logout

### 📖 Legal & Guide
- **Terms of Service** — medical disclaimer, liability, data usage
- **Privacy Policy** — HIPAA compliance, encryption, user rights
- **App Guide** — step-by-step usage tutorial + FAQ
- Accessible without authentication

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Mobile** | React Native 0.81 + Expo SDK 54 | Cross-platform app |
| **Navigation** | expo-router 6.0 | File-based routing |
| **Language** | TypeScript 5.9 | Type safety |
| **Auth** | JWT + expo-secure-store | Secure authentication |
| **Camera** | expo-image-picker | Photo capture & gallery |
| **Images** | expo-image | Optimized image rendering |
| **Backend** | Flask (Python) | REST API server |
| **AI/ML** | TensorFlow / TF Lite | Image classification models |
| **Database** | MongoDB | Health data storage |
| **Cloud** | Azure | Deployment & hosting |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20 ([install via nvm](https://github.com/nvm-sh/nvm))
- **Expo Go** app on your phone ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Installation

```bash
# Clone the repository
git clone https://github.com/TimLaum/health-guard.git
cd health-guard

# Install mobile app dependencies
cd HealthGuard
npm install

# Start the development server
npx expo start
```

### Running on Device

1. Scan the **QR code** in the terminal with Expo Go
2. Or press `a` for Android emulator / `i` for iOS simulator / `w` for web

---

## 📁 App Navigation Map

```
┌─────────────────────────────────────────┐
│               Root Layout               │
│            (Auth Provider)              │
├──────────┬──────────┬───────────────────┤
│          │          │                   │
│  (auth)  │  (tabs)  │   Public Routes   │
│          │          │                   │
│ • Login  │ • Home   │ • Terms           │
│ • Signup │ • Scan   │ • Privacy         │
│ • Forgot │ • History│ • Guide (modal)   │
│          │ • Profile│                   │
│          │          │ • Results (modal)  │
└──────────┴──────────┴───────────────────┘
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | User login (returns JWT) |
| `POST` | `/api/auth/register` | User registration |
| `GET` | `/api/auth/profile` | Get user profile |
| `POST` | `/api/analysis/upload` | Upload image for AI analysis |
| `GET` | `/api/analysis/results/:id` | Get analysis results |
| `GET` | `/api/analysis/history` | Get scan history |
| `GET` | `/api/health` | Server health check |

---

## 🎨 Design System

The app uses a **medical-themed color palette** built for trust and clarity:

| Color | Hex | Usage |
|-------|-----|-------|
| 🟦 Primary | `#0891B2` | Brand, buttons, links |
| 🟪 Eye Scan | `#8B5CF6` | Purple — eye analysis |
| 🟧 Skin Scan | `#F97316` | Orange — skin analysis |
| 🩷 Nail Scan | `#EC4899` | Pink — nail analysis |
| 🟩 Success | `#10B981` | Normal results |
| 🟨 Warning | `#F59E0B` | Moderate results |
| 🟥 Danger | `#EF4444` | High risk results |

---

## 👥 Team

| Role | Member | Responsibility |
|------|--------|---------------|
| 📱 **Mobile App** | [@Mohamedsellak](https://github.com/Mohamedsellak) | React Native / Expo frontend |
| 🖥️ **Backend** | TBD | Flask API & database |
| 🤖 **AI/ML** | TBD | Model training & inference |

---

## 📄 License

This project is developed as part of an **M1 academic project** (2025–2026).

---

<div align="center">

**Built with ❤️ for better health awareness**

<img src="HealthGuard/assets/images/logo.png" alt="HealthGuard" width="48" />

*HealthGuard Vision — Diagnostic Préventif par Image*

</div>
