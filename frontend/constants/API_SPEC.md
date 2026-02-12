# 📝 Documentation de l'API

Ce document décrit les points de terminaison de l'API pour l'authentification des utilisateurs, la gestion des profils et l'analyse d'images médicales.

## 1️⃣ Enregistrer un Utilisateur

**Point de terminaison :** `POST /auth/register`

**Description :** Enregistre un nouveau compte utilisateur.

**Corps de la Requête :**
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "first_name": "John",
  "last_name": "Doe",
  "sex": "male"
}
```

**Réponse :**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "newuser@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "sex": "male",
    "created_at": "2026-02-10T10:30:00Z"
  }
}
```

## 2️⃣ Connexion Utilisateur

**Point de terminaison :** `POST /auth/login`

**Description :** Authentifie un utilisateur existant et retourne un jeton JWT.

**Corps de la Requête :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse :**
```json
{
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "sex": "male"
  }
}
```

## 3️⃣ Obtenir le Profil Utilisateur

**Point de terminaison :** `GET /user/profile`

**Description :** Récupère les informations de profil de l'utilisateur authentifié.

**En-têtes :**
- `Authorization: Bearer {token}`

**Réponse :**
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "sex": "M"|"F",
  "created_at": "2026-02-10T10:30:00Z"
}
```

## 4️⃣ Télécharger une Analyse

**Point de terminaison :** `POST /analysis/upload`

**Description :** Télécharge une image pour une analyse médicale (œil, peau ou ongle).

**En-têtes :**
- `Authorization: Bearer {token}`
- `Content-Type: multipart/form-data`

**Données du Formulaire :**
- `file`: [fichier_image]
- `image_type`: `eye` | `skin` | `nail`

**Réponse :**
```json
{
  "_id": "analysis_id_123",
  "image_type": "skin",
  "image_url": "azure_blob_url",
  "uploaded_at": "2026-02-10T10:30:00Z",
  "result": {
    "type": "diabetes",
    "probability": 0.78
  }
}
```

## 5️⃣ Obtenir une Analyse par ID

**Point de terminaison :** `GET /analysis/results/{id}`

**Description :** Récupère une analyse spécifique par son ID.

**En-têtes :**
- `Authorization: Bearer {token}`

**Paramètres de Chemin :**
- `id`: L'ID de l'analyse (par exemple, `analysis_id_123`)

**Réponse :**
```json
{
  "_id": "analysis_id_123",
  "image_type": "skin",
  "image_url": "azure_blob_url",
  "uploaded_at": "2026-02-10T10:30:00Z",
  "result": {
    "type": "diabetes",
    "probability": 0.78
  }
}
```

## 6️⃣ Obtenir l'Historique des Analyses

**Point de terminaison :** `GET /analysis/history`

**Description :** Récupère l'historique de toutes les analyses pour l'utilisateur authentifié.

**En-têtes :**
- `Authorization: Bearer {token}`

**Réponse :**
```json
{
  "analyses": [
    {
      "_id": "analysis_id_123",
      "image_type": "eye",
      "image_url": "azure_blob_url",
      "uploaded_at": "2026-02-10T10:30:00Z",
      "result": {
        "type": "anemia",
        "probability": 0.82
      }
    },
    {
      "_id": "analysis_id_456",
      "image_type": "skin",
      "image_url": "azure_blob_url",
      "uploaded_at": "2026-02-08T14:10:00Z",
      "result": {
        "type": "deficiency",
        "probability": 0.65
      }
    }
  ]
}
```