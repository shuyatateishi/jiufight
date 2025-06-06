/**
 * Firebase Configuration for Jiufight
 * This provides real-time database sync across all devices
 */

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDYOURKEY", // 後で実際のキーに置き換え
    authDomain: "jiufight.firebaseapp.com",
    databaseURL: "https://jiufight-default-rtdb.firebaseio.com",
    projectId: "jiufight",
    storageBucket: "jiufight.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get database reference
const database = firebase.database();

console.log('🔥 Firebase initialized for Jiufight');

// Export for use in other scripts
window.firebaseDB = database;