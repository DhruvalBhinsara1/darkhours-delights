// firebaseAdmin.js
const admin = require("firebase-admin");
require("dotenv").config();

// Initialize only if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./firebase-service-account.json"),
    });
}

module.exports = admin;