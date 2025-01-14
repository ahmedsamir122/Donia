// firebase.js
const admin = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://donia-d3204-default-rtdb.asia-southeast1.firebasedatabase.app", // Replace with your database URL
});

module.exports = admin;
