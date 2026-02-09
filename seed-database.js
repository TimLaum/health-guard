// Script de peuplement de la base de données MongoDB
// Usage: mongosh < seed-database.js

// Se connecter à la base de données
// use HealthGuardVision
const db = db.getSiblingDB('HealthGuardVision')

// Nettoyer les collections existantes (optionnel)
// db.Patients.drop()
// db.Analyses.drop()
// db.Modeles_ML.drop()
// db.Historique_Utilisateurs.drop()

// ============================================
// INSERTION DES PATIENTS
// ============================================
console.log("Insertion des patients...")
db.Patients.insertMany([
  {
    patient_id: "PAT001",
    nom: "Dupont",
    prenom: "Jean",
    date_naissance: new Date("1985-03-15"),
    sexe: "M",
    email: "jean.dupont@email.com",
    phone: "+33612345678",
    date_creation: new Date("2025-01-10T08:30:00Z")
  },
  {
    patient_id: "PAT002",
    nom: "Martin",
    prenom: "Marie",
    date_naissance: new Date("1990-07-22"),
    sexe: "F",
    email: "marie.martin@email.com",
    phone: "+33687654321",
    date_creation: new Date("2025-01-12T10:15:00Z")
  },
  {
    patient_id: "PAT003",
    nom: "Bernard",
    prenom: "Pierre",
    date_naissance: new Date("1978-11-05"),
    sexe: "M",
    email: "pierre.bernard@email.com",
    phone: "+33698765432",
    date_creation: new Date("2025-01-15T14:45:00Z")
  }
])
console.log("✓ 3 patients insérés")

// ============================================
// CRÉATION DES INDEXES POUR PATIENTS
// ============================================
db.Patients.createIndex({ patient_id: 1 }, { unique: true })
db.Patients.createIndex({ email: 1 }, { unique: true })
console.log("✓ Indexes Patients créés")

// ============================================
// INSERTION DES ANALYSES
// ============================================
console.log("Insertion des analyses...")
db.Analyses.insertMany([
  {
    patient_id: "PAT001",
    image_type: "oeil",
    image_url: "https://healthguard.blob.core.windows.net/images/PAT001/oeil_20250115.jpg",
    date_scan: new Date("2025-01-15T09:30:00Z"),
    diagnostic: {
      diabete: "positif",
      anemie: "negatif",
      carences: ["vitamine D"]
    },
    confidence: {
      diabete: 0.92,
      anemie: 0.88,
      carences: {
        "vitamine D": 0.85,
        "fer": 0.72
      }
    },
    recommandations: [
      "Consulter un endocrinologue",
      "Augmenter l'apport en vitamine D",
      "Faire un test sanguin complet"
    ]
  },
  {
    patient_id: "PAT001",
    image_type: "peau",
    image_url: "https://healthguard.blob.core.windows.net/images/PAT001/peau_20250116.jpg",
    date_scan: new Date("2025-01-16T10:00:00Z"),
    diagnostic: {
      diabete: "negatif",
      anemie: "positif",
      carences: ["fer"]
    },
    confidence: {
      diabete: 0.95,
      anemie: 0.87,
      carences: {
        "vitamine D": 0.65,
        "fer": 0.89
      }
    },
    recommandations: [
      "Corriger la carence en fer",
      "Faire un suivi hématologique",
      "Réévaluer les apports nutritionnels"
    ]
  },
  {
    patient_id: "PAT002",
    image_type: "ongle",
    image_url: "https://healthguard.blob.core.windows.net/images/PAT002/ongle_20250116.jpg",
    date_scan: new Date("2025-01-16T11:30:00Z"),
    diagnostic: {
      diabete: "inconclusive",
      anemie: "negatif",
      carences: []
    },
    confidence: {
      diabete: 0.52,
      anemie: 0.91,
      carences: {
        "vitamine D": 0.71,
        "fer": 0.68
      }
    },
    recommandations: [
      "Ongles sains - pas de signe de carence majeure",
      "Maintenir une alimentation équilibrée",
      "Suivi recommandé dans 6 mois"
    ]
  },
  {
    patient_id: "PAT003",
    image_type: "oeil",
    image_url: "https://healthguard.blob.core.windows.net/images/PAT003/oeil_20250117.jpg",
    date_scan: new Date("2025-01-17T08:15:00Z"),
    diagnostic: {
      diabete: "positif",
      anemie: "positif",
      carences: ["vitamine D", "fer"]
    },
    confidence: {
      diabete: 0.89,
      anemie: 0.84,
      carences: {
        "vitamine D": 0.91,
        "fer": 0.87
      }
    },
    recommandations: [
      "Urgence: Consultation médicale immédiate",
      "Test sanguin complet requis",
      "Suppléments vitaminiques (D + fer)",
      "Gestion du diabète: endocrinologue"
    ]
  }
])
console.log("✓ 4 analyses insérées")

// ============================================
// CRÉATION DES INDEXES POUR ANALYSES
// ============================================
db.Analyses.createIndex({ patient_id: 1 })
db.Analyses.createIndex({ date_scan: -1 })
db.Analyses.createIndex({ image_type: 1 })
console.log("✓ Indexes Analyses créés")

// ============================================
// INSERTION DES MODELES ML
// ============================================
console.log("Insertion des modèles ML...")
db.Modeles_ML.insertMany([
  {
    model_name: "diabete",
    version: "1.0.0",
    date_deploiement: new Date("2025-01-01T00:00:00Z"),
    metrics: {
      accuracy: 0.94,
      precision: 0.92,
      recall: 0.93
    },
    notes: "Modèle initial entraîné sur 5000 images"
  },
  {
    model_name: "diabete",
    version: "1.1.0",
    date_deploiement: new Date("2025-01-10T00:00:00Z"),
    metrics: {
      accuracy: 0.96,
      precision: 0.95,
      recall: 0.95
    },
    notes: "Amélioration: augmentation du dataset, meilleure précision"
  },
  {
    model_name: "anemie",
    version: "1.0.0",
    date_deploiement: new Date("2025-01-02T00:00:00Z"),
    metrics: {
      accuracy: 0.89,
      precision: 0.87,
      recall: 0.88
    },
    notes: "Modèle initial pour détection d'anémie"
  },
  {
    model_name: "carences",
    version: "1.0.0",
    date_deploiement: new Date("2025-01-05T00:00:00Z"),
    metrics: {
      accuracy: 0.85,
      precision: 0.83,
      recall: 0.84
    },
    notes: "Détection des carences vitaminiques (D, fer)"
  }
])
console.log("✓ 4 modèles ML insérés")

// ============================================
// CRÉATION DES INDEXES POUR MODELES_ML
// ============================================
db.Modeles_ML.createIndex({ model_name: 1, version: 1 })
console.log("✓ Indexes Modeles_ML créés")

// ============================================
// INSERTION DE L'HISTORIQUE UTILISATEURS
// ============================================
console.log("Insertion de l'historique utilisateurs...")
db.Historique_Utilisateurs.insertMany([
  {
    patient_id: "PAT001",
    action: "upload",
    timestamp: new Date("2025-01-15T09:25:00Z"),
    details: "Upload d'une image de l'oeil"
  },
  {
    patient_id: "PAT001",
    action: "scan",
    timestamp: new Date("2025-01-15T09:30:00Z"),
    details: "Scan complété - diabète positif détecté"
  },
  {
    patient_id: "PAT001",
    action: "upload",
    timestamp: new Date("2025-01-16T09:55:00Z"),
    details: "Upload d'une image de la peau"
  },
  {
    patient_id: "PAT001",
    action: "scan",
    timestamp: new Date("2025-01-16T10:00:00Z"),
    details: "Scan complété - anémie positive détectée"
  },
  {
    patient_id: "PAT002",
    action: "upload",
    timestamp: new Date("2025-01-16T11:25:00Z"),
    details: "Upload d'une image d'ongle"
  },
  {
    patient_id: "PAT002",
    action: "scan",
    timestamp: new Date("2025-01-16T11:30:00Z"),
    details: "Scan complété - résultats normaux"
  },
  {
    patient_id: "PAT003",
    action: "upload",
    timestamp: new Date("2025-01-17T08:10:00Z"),
    details: "Upload d'une image de l'oeil"
  },
  {
    patient_id: "PAT003",
    action: "scan",
    timestamp: new Date("2025-01-17T08:15:00Z"),
    details: "Scan complété - diagnostics multiples positifs"
  }
])
console.log("✓ 8 entrées historique insérées")

// ============================================
// CRÉATION DES INDEXES POUR HISTORIQUE
// ============================================
db.Historique_Utilisateurs.createIndex({ patient_id: 1 })
db.Historique_Utilisateurs.createIndex({ timestamp: -1 })
db.Historique_Utilisateurs.createIndex({ action: 1 })
console.log("✓ Indexes Historique_Utilisateurs créés")

// ============================================
// AFFICHAGE DES STATISTIQUES
// ============================================
console.log("\n" + "=".repeat(50))
console.log("📊 STATISTIQUES FINALES")
console.log("=".repeat(50))
console.log("Patients: " + db.Patients.countDocuments({}))
console.log("Analyses: " + db.Analyses.countDocuments({}))
console.log("Modèles ML: " + db.Modeles_ML.countDocuments({}))
console.log("Historique: " + db.Historique_Utilisateurs.countDocuments({}))
console.log("=".repeat(50))
console.log("✅ Base de données HealthGuardVision initialisée!")
