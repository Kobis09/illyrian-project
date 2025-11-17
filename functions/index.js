/**
 * ILLYRIAN TOKEN — SECURE REFERRAL FUNCTION (Firebase Functions v2)
 * This backend function securely applies referral codes.
 * Frontend cannot modify other user docs — only this function can.
 */

const { onCall } = require("firebase-functions/v2/https");
const { setGlobalOptions } = require("firebase-functions");
const admin = require("firebase-admin");

// Limit max containers to control cost
setGlobalOptions({ maxInstances: 10 });

// Initialize Firebase Admin SDK
admin.initializeApp();
const db = admin.firestore();

/**
 * applyReferral (onCall)
 * Called by frontend ReferralBonus.js
 *
 * Input: { code: "ABCDEFGH" }
 * Output:
 *   { success: true, bonus: number, message: string }
 *
 * Security:
 *  - User must be logged in
 *  - Cannot use own referral code
 *  - Cannot use referral more than once
 *  - Cannot exceed max bonuses (2)
 *  - Uses Firestore batch to prevent cheating
 */
exports.applyReferral = onCall(async (request) => {
  const uid = request.auth?.uid;

  if (!uid) {
    throw new Error("unauthenticated: User must be logged in.");
  }

  const enteredCode = request.data.code;

  if (!enteredCode || enteredCode.length !== 8) {
    throw new Error("invalid-argument: Invalid referral code.");
  }

  // Current user document
  const curUserRef = db.collection("users").doc(uid);
  const curSnap = await curUserRef.get();
  const cur = curSnap.data() || {};

  // Prevent reusing referral
  if (cur.referredBy) {
    throw new Error("failed-precondition: You already used a referral code.");
  }

  // Prevent using own code
  if (cur.referralCode === enteredCode) {
    throw new Error("failed-precondition: You cannot use your own code.");
  }

  // Find referrer
  const q = await db
    .collection("users")
    .where("referralCode", "==", enteredCode)
    .limit(1)
    .get();

  if (q.empty) {
    throw new Error("not-found: Referral code does not exist.");
  }

  const refDoc = q.docs[0];
  const refId = refDoc.id;
  const refUserRef = db.collection("users").doc(refId);
  const refData = refDoc.data() || {};

  // Calculate new bonuses
  const refBonus = Math.min((refData.referralBonuses || 0) + 1, 2);
  const userBonus = Math.min((cur.referralBonuses || 0) + 1, 2);
  // Apply atomic updates
  const batch = db.batch();

  batch.update(refUserRef, { referralBonuses: refBonus });
  batch.update(curUserRef, {
    referralBonuses: userBonus,
    referredBy: enteredCode,
  });

  await batch.commit();

  return {
    success: true,
    bonus: userBonus,
    message: "Referral applied successfully! Timer reduction activated.",
  };
});
