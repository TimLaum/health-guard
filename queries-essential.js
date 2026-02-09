// ============================================
// HealthGuard Vision - Essential Queries
// Clean & Production-Ready Examples
// ============================================

use('HealthGuardVision');

// ============================================
// EXAMPLE 3: Find All Diabetes Cases
// ============================================
console.log("\n📌 DIABETES CASES\n");

const diabetesCases = db.history.find({
  "result.full_diagnostic.diabete": "positif"
}).toArray();

diabetesCases.forEach((scan) => {
  const userInfo = db.users.findOne({ _id: ObjectId(scan.user_id) });
  console.log(`${userInfo.first_name} ${userInfo.last_name}`);
  console.log(`  Confidence: ${(scan.result.confidence_scores.diabete * 100).toFixed(1)}%`);
  console.log(`  Scan Date: ${scan.uploaded_at}`);
  console.log(`  Deficiencies: ${scan.result.full_diagnostic.carences.join(', ')}`);
  console.log();
});

// ============================================
// EXAMPLE 4-5: User Statistics
// ============================================
console.log("\n📌 USER SCAN STATISTICS\n");

const scansByUser = db.history.aggregate([
  {
    $group: {
      _id: "$user_id",
      total_scans: { $sum: 1 },
      scan_types: { $addToSet: "$image_type" }
    }
  },
  { $sort: { total_scans: -1 } }
]).toArray();

scansByUser.forEach((stat) => {
  const userInfo = db.users.findOne({ _id: ObjectId(stat._id) });
  console.log(`${userInfo.first_name} ${userInfo.last_name}: ${stat.total_scans} scan(s)`);
  console.log(`  Types: ${stat.scan_types.join(', ')}`);
  console.log();
});

// ============================================
// EXAMPLE 6: Urgent Cases Alert
// ============================================
console.log("\n📌 URGENT MEDICAL CASES\n");

const urgentCases = db.history.find({
  "result.recommendations": { $regex: "Urgence|urgent" }
}).toArray();

urgentCases.forEach((scan) => {
  const userInfo = db.users.findOne({ _id: ObjectId(scan.user_id) });
  console.log(`🚨 ${userInfo.first_name} ${userInfo.last_name}`);
  console.log(`   Email: ${userInfo.email}`);
  console.log(`   Phone: ${userInfo.phone}`);
  console.log(`   Action: ${scan.result.recommendations[0]}`);
  console.log();
});

// ============================================
// EXAMPLE 7: Diagnosis Statistics
// ============================================
console.log("\n📌 DIAGNOSIS STATISTICS\n");

const diagStats = db.history.aggregate([
  {
    $group: {
      _id: "$result.type",
      count: { $sum: 1 },
      avg_probability: { $avg: "$result.probability" }
    }
  }
]).toArray();

diagStats.forEach((stat) => {
  console.log(`${stat._id.toUpperCase()}: ${stat.count} case(s)`);
  console.log(`  Avg confidence: ${(stat.avg_probability * 100).toFixed(1)}%`);
});

console.log("\n✅ Done\n");
