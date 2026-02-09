// Migration script for new database schema
// Converts to: users, history (instead of Patients, Historique_Utilisateurs)

use('HealthGuardVision');

console.log("🔄 Starting migration to new schema...\n")

// ============================================
// 1. CREATE USERS COLLECTION
// ============================================
console.log("[1/3] Creating users collection...")

db.createCollection("users")

// Insert users from existing patients data
const patients = db.Patients.find().toArray()

const users = patients.map(patient => ({
  email: patient.email,
  password_hash: "$2b$10$exampleHashedPasswordHere", // Placeholder - should be real bcrypt
  first_name: patient.prenom,
  last_name: patient.nom,
  sex: patient.sexe === "M" ? "man" : "woman",
  patient_id: patient.patient_id, // Reference to old patient data
  phone: patient.phone,
  created_at: patient.date_creation
}))

db.users.insertMany(users)
console.log(`✓ ${users.length} users created`)

// Create indexes for users
db.users.createIndex({ email: 1 }, { unique: true })
console.log("✓ User indexes created")

// ============================================
// 2. CREATE HISTORY COLLECTION
// ============================================
console.log("\n[2/3] Creating history collection...")

db.createCollection("history")

// Migrate from Analyses to history with new structure
const analyses = db.Analyses.find().toArray()
const userMap = {}

// Build user_id map from email
db.users.find().forEach(user => {
  userMap[user.patient_id] = user._id
})

const historyRecords = analyses.map(analysis => {
  // Determine result type from diagnostic
  let resultType = "unknown"
  let probability = 0

  if (analysis.diagnostic.diabete === "positif") {
    resultType = "diabetes"
    probability = analysis.confidence.diabete
  } else if (analysis.diagnostic.anemie === "positif") {
    resultType = "anemia"
    probability = analysis.confidence.anemie
  } else if (analysis.diagnostic.carences && analysis.diagnostic.carences.length > 0) {
    resultType = "deficiency"
    probability = Math.max(...Object.values(analysis.confidence.carences))
  }

  return {
    user_id: userMap[analysis.patient_id] || null,
    image_type: analysis.image_type,
    image_url: analysis.image_url,
    uploaded_at: analysis.date_scan,
    result: {
      type: resultType,
      probability: probability,
      model_version: "v1.0.0",
      full_diagnostic: analysis.diagnostic,
      confidence_scores: analysis.confidence,
      recommendations: analysis.recommandations
    }
  }
})

db.history.insertMany(historyRecords)
console.log(`✓ ${historyRecords.length} history records created`)

// Create indexes for history
db.history.createIndex({ user_id: 1 })
db.history.createIndex({ uploaded_at: -1 })
db.history.createIndex({ "result.type": 1 })
console.log("✓ History indexes created")

// ============================================
// 3. VERIFY MIGRATION
// ============================================
console.log("\n[3/3] Verifying migration...")

const userCount = db.users.countDocuments({})
const historyCount = db.history.countDocuments({})
const modelCount = db.Modeles_ML.countDocuments({})

console.log(`\n========== FINAL STATISTICS ==========`)
console.log(`Users: ${userCount}`)
console.log(`History: ${historyCount}`)
console.log(`ML Models: ${modelCount}`)
console.log(`Analyses (old): ${db.Analyses.countDocuments({})}`)
console.log(`Patients (old): ${db.Patients.countDocuments({})}`)
console.log(`=====================================`)

console.log("\n✅ Migration completed successfully!")
console.log("\n📝 Next steps:")
console.log("1. Old collections (Patients, Analyses, Historique_Utilisateurs) can now be archived")
console.log("2. Update your application to use 'users' and 'history' collections")
console.log("3. Remember to update password_hash with real bcrypt hashes!")
