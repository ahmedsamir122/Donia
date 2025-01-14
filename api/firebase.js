// firebase.js
const admin = require("firebase-admin");
const serviceAccount = require("./donia-d3204-firebase-adminsdk-9jp7t-87ddf06a80.json");

// Initialize the Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://donia-d3204-default-rtdb.asia-southeast1.firebasedatabase.app", // Replace with your database URL
});

module.exports = admin;
