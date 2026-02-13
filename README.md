<div align="center">

<img src="logo.png" alt="HealthGuard Vision Logo" width="140" />

# 🩺 HealthGuard Vision

### Diagnostic Préventif par Image

*Application mobile de dépistage de santé par intelligence artificielle*

<br/>

[![React Native](https://img.shields.io/badge/React_Native-0.81.5-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo_SDK_54-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0.3-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow_Lite-ML-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)](https://www.tensorflow.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

<br/>

**Projet M1** · Année Universitaire 2025–2026

</div>

---

## 📋 À propos

**HealthGuard Vision** est une application mobile de dépistage préventif qui utilise l'**intelligence artificielle** pour analyser des photographies d'yeux, de peau et d'ongles — détectant des indicateurs précoces de **diabète**, **carences nutritionnelles** et **anémie**.

> ⚠️ **Avertissement** : Cet outil est développé dans un cadre académique. Il ne fournit **pas** de diagnostic médical. Consultez toujours un professionnel de santé qualifié.

---

## 🔬 Analyses disponibles

<table>
<tr>
<td align="center" width="33%">

### 👁️ Scan Oculaire
**Rétinopathie Diabétique**

Analyse les images rétiniennes pour détecter micro-anévrismes, hémorragies et exsudats — signes précoces de complications diabétiques.

</td>
<td align="center" width="33%">

### 🖐️ Scan Cutané
**Carences Nutritionnelles**

Examine la teinte, la texture et les patterns colorés de la peau pour identifier des carences possibles en vitamine D, B12 et zinc.

</td>
<td align="center" width="33%">

### 💅 Scan Unguéal
**Détection d'Anémie**

Analyse la couleur du lit unguéal, la forme (ongles en cuillère) et les stries pour détecter une carence en fer et l'anémie.

</td>
</tr>
</table>

---

## 🏗️ Architecture du Projet

```
health-guard/
│
├── 📱 frontend/               ← Application Mobile (React Native / Expo)
│   ├── app/                   ← Écrans & navigation (expo-router)
│   │   ├── (auth)/            ← Login, Inscription, Mot de passe oublié
│   │   ├── (tabs)/            ← Accueil, Capture, Historique, Profil
│   │   ├── (legal)/           ← CGU, Politique de confidentialité
│   │   ├── guide.tsx          ← Guide utilisateur & FAQ
│   │   └── results.tsx        ← Résultats d'analyse IA
│   ├── contexts/              ← Contexte Auth (JWT)
│   ├── services/              ← Client API & gestion des tokens
│   └── constants/             ← Couleurs, configuration API
│
├── 🖥️ backend/                ← API REST Flask
│   ├── app/
│   │   ├── ml_models/         ← Modèles TensorFlow Lite (.tflite)
│   │   ├── routes.py          ← Endpoints API
│   │   ├── services.py        ← Logique métier
│   │   ├── predict.py         ← Prédiction ML
│   │   └── db.py              ← Connexion MongoDB
│   ├── run.py                 ← Point d'entrée serveur
│   └── requirements.txt       ← Dépendances Python
│
├── 📄 rapport/                ← Rapport LaTeX du projet
│
├── 🐳 docker-compose.yml     ← Orchestration des conteneurs
└── 📖 README.md
```

---

## 📱 Fonctionnalités de l'Application

<table>
<tr><td>

### 🔐 Authentification
- Connexion & inscription sécurisées avec **JWT**
- Tokens chiffrés via **expo-secure-store**
- Récupération de mot de passe
- Routes protégées avec redirection automatique

</td><td>

### 📸 Capture Intelligente
- Prise de photo via **expo-image-picker**
- Sélection depuis la galerie
- Conseils spécifiques par type de scan
- Prévisualisation avant analyse

</td></tr>
<tr><td>

### 📊 Résultats IA
- Niveaux de sévérité colorés (Normal / Modéré / Élevé)
- Score de confiance avec barre de progression
- Description détaillée de la condition
- Recommandations de santé personnalisées

</td><td>

### 📜 Historique & Suivi
- Liste chronologique de tous les scans
- Filtrage par type (Œil / Peau / Ongle)
- Badges de sévérité
- Consultation des résultats passés

</td></tr>
<tr><td>

### 👤 Profil & Paramètres
- Statistiques de scans
- Export et suppression des données
- Liens CGU, Confidentialité, Guide
- Déconnexion sécurisée

</td><td>

### 📖 Guide & Légal
- **CGU** — Avertissement médical, responsabilité
- **Politique de confidentialité** — Chiffrement, droits
- **Guide** — Tutoriel pas-à-pas + FAQ
- Accessible sans authentification

</td></tr>
</table>

---

## 🛠️ Stack Technique

| Couche | Technologie | Rôle |
|--------|------------|------|
| **Mobile** | React Native 0.81 + Expo SDK 54 | Application cross-platform |
| **Navigation** | expo-router 6.0 | Routage basé sur le système de fichiers |
| **Langage** | TypeScript 5.9 | Typage statique |
| **Auth** | JWT + expo-secure-store | Authentification sécurisée |
| **Caméra** | expo-image-picker | Capture photo & galerie |
| **Backend** | Flask 3.0.3 (Python) | Serveur API REST |
| **IA / ML** | TensorFlow Lite | Classification d'images (3 modèles) |
| **Base de données** | MongoDB 7 | Stockage des données de santé |
| **DevOps** | Docker Compose | Conteneurisation & orchestration |
| **Animations** | Reanimated 4.1 | Animations performantes (UI thread) |

---

## 🔌 API Endpoints

| Méthode | Route | Description | Auth |
|---------|-------|-------------|:----:|
| `GET` | `/health` | État de santé du serveur | — |
| `POST` | `/signup` | Inscription utilisateur | — |
| `POST` | `/auth` | Connexion (émission JWT) | — |
| `POST` | `/re-auth` | Renouvellement du token | 🔒 |
| `POST` | `/predict` | Analyse d'image ML (eye/skin/nail) | 🔒 |
| `GET` | `/profile` | Consultation du profil | 🔒 |
| `PUT` | `/profile` | Modification du profil | 🔒 |
| `PUT` | `/change-password` | Changement de mot de passe | 🔒 |
| `GET` | `/histories` | Historique des analyses | 🔒 |
| `GET` | `/export-data` | Export des données (JSON) | 🔒 |
| `DELETE` | `/delete-history` | Suppression de l'historique | 🔒 |

---

## 🚀 Démarrage Rapide

### Prérequis

- **Docker** & **Docker Compose** ([installer](https://docs.docker.com/get-docker/))
- **Node.js** ≥ 20 ([installer via nvm](https://github.com/nvm-sh/nvm))
- **Python** ≥ 3.8
- **Expo Go** sur votre téléphone — [Android](https://play.google.com/store/apps/details?id=host.exp.exponent) · [iOS](https://apps.apple.com/app/expo-go/id982107779)

### 🐳 Avec Docker (recommandé)

```bash
# Cloner le dépôt
git clone https://github.com/TimLaum/health-guard.git
cd health-guard

# Lancer tous les services (MongoDB + Backend + Frontend)
docker compose up --build
```

| Service | URL |
|---------|-----|
| Backend API | `http://localhost:5000` |
| Frontend | `http://localhost:8081` |
| MongoDB | `localhost:27017` |

### 🔧 Sans Docker

#### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python run.py
```

#### Frontend

```bash
cd frontend
npm install
npx expo start
```

> Scanner le **QR code** affiché avec Expo Go, ou appuyer sur `a` (Android) / `i` (iOS) / `w` (Web).

---

## 🤖 Modèles ML

Le backend embarque **3 modèles TensorFlow Lite** pré-entraînés :

| Modèle | Fichier | Analyse |
|--------|---------|---------|
| Scan oculaire | `eye_anemia_model.tflite` | Détection d'anémie oculaire |
| Scan cutané | `best_skin_disease_model.tflite` | Classification de maladies de peau |
| Scan unguéal | `nail_anemia_model.tflite` | Détection d'anémie unguéale |

Les classes de sortie sont mappées via `class_mapping.json`.

---

## 🎨 Design System

Palette médicale conçue pour la confiance et la lisibilité :

| Couleur | Hex | Usage |
|---------|-----|-------|
| 🟦 Primary | `#0891B2` | Marque, boutons, liens |
| 🟪 Scan Oculaire | `#8B5CF6` | Violet — analyse yeux |
| 🟧 Scan Cutané | `#F97316` | Orange — analyse peau |
| 🩷 Scan Unguéal | `#EC4899` | Rose — analyse ongles |
| 🟩 Normal | `#10B981` | Résultat normal |
| 🟨 Modéré | `#F59E0B` | Résultat modéré |
| 🟥 Élevé | `#EF4444` | Résultat à risque |

---

## 📁 Navigation de l'Application

```
┌─────────────────────────────────────────┐
│             Root Layout                 │
│           (Auth Provider)               │
├──────────┬──────────┬───────────────────┤
│          │          │                   │
│  (auth)  │  (tabs)  │  Routes Publiques │
│          │          │                   │
│ • Login  │ • Accueil│ • CGU             │
│ • Signup │ • Capture│ • Confidentialité  │
│ • Forgot │ • Histo. │ • Guide (modal)   │
│          │ • Profil │                   │
│          │          │ • Résultats       │
└──────────┴──────────┴───────────────────┘
```

---

## 👥 Équipe

| Rôle | Membre | Responsabilité |
|------|--------|----------------|
| 📱 **Frontend** | [@Mohamedsellak](https://github.com/Mohamedsellak) | Application mobile React Native / Expo |
| 🖥️ **Backend** | [@TimLaum](https://github.com/TimLaum) | API Flask, logique métier & base de données |
| 🤖 **ML / IA** | [@0xCorentin](https://github.com/0xCorentin) | Entraînement & inférence des modèles |
| ⚙️ **DevOps** | — | Docker, CI/CD & déploiement |

---

## 📄 Licence

Projet académique développé dans le cadre du **Master 1** — Année universitaire 2025–2026.

---

<div align="center">

**Construit avec ❤️ pour une meilleure sensibilisation à la santé**

*HealthGuard Vision — Diagnostic Préventif par Image*

</div>
