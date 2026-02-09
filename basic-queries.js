// ============================================
// HealthGuard Vision - Basic User Queries
// ============================================

use('HealthGuardVision');

// ============================================
// Get User Profile
// ============================================
console.log("\n📌 GET USER PROFILE\n");

const userEmail = "jean.dupont@email.com";
const user = db.users.findOne({ email: userEmail });

console.log(`Name: ${user.first_name} ${user.last_name}`);
console.log(`Email: ${user.email}`);
console.log(`Phone: ${user.phone}`);
console.log(`Sex: ${user.sex === 'man' ? 'H (Homme)' : 'F (Femme)'}`);
console.log(`Member since: ${user.created_at}\n`);

// ============================================
// User's Scan History
// ============================================
console.log("\n📌 USER'S SCAN HISTORY\n");

const userId = user._id;
const scanHistory = db.history.find({ user_id: userId }).toArray();

console.log(`Total scans: ${scanHistory.length}\n`);

scanHistory.forEach((scan, index) => {
  console.log(`Scan #${index + 1}:`);
  console.log(`  Type: ${scan.image_type}`);
  console.log(`  Date: ${scan.uploaded_at}`);
  console.log(`  Finding: ${scan.result.type.toUpperCase()}`);
  console.log(`  Probability: ${(scan.result.probability * 100).toFixed(1)}%`);
  console.log(`  Action: ${scan.result.recommendations[0]}`);
  console.log();
});
