# HealthGuard Vision — Diagnostic Préventif par Image

M1 university project for preventive health diagnostics via AI-powered image analysis.

## Project Structure

```
├── HealthGuard/     # Mobile app (React Native / Expo)
├── backend/         # Flask API server (coming soon)
└── ai-ml/           # AI/ML models (coming soon)
```

## HealthGuard Mobile App

The mobile application allows users to scan their **eyes**, **skin**, and **nails** to detect potential health indicators:

| Scan Type | Detects |
|-----------|---------|
| 👁️ Eye Scan | Diabetic retinopathy indicators |
| 🖐️ Skin Scan | Vitamin D & nutritional deficiencies |
| 💅 Nail Scan | Iron deficiency / anemia signs |

### Tech Stack
- **Framework**: React Native with Expo SDK 54
- **Routing**: expo-router (file-based)
- **Auth**: JWT with expo-secure-store
- **Language**: TypeScript

### Getting Started

```bash
cd HealthGuard
npm install
npx expo start
```

> Requires Node.js ≥ 20

## Team

- **Mobile App**: @Mohamedsellak
- **Backend**: (TBD)
- **AI/ML**: (TBD)
