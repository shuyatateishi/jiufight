/**
 * Firebase Configuration for Jiufight
 * This provides real-time database sync across all devices
 * Optimized for Vercel deployment
 */

// Firebase configuration - Replace with your actual values
const firebaseConfig = {
    apiKey: "AIzaSyDYOURKEY", // 後で実際のキーに置き換え
    authDomain: "jiufight.firebaseapp.com",
    databaseURL: "https://jiufight-default-rtdb.firebaseio.com",
    projectId: "jiufight",
    storageBucket: "jiufight.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// Check if Firebase is loaded
if (typeof firebase === 'undefined') {
    console.error('❌ Firebase SDK not loaded. Check if scripts are properly included.');
} else {
    try {
        // Initialize Firebase only if not already initialized
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
            console.log('🔥 Firebase initialized for Jiufight');
        } else {
            console.log('🔥 Firebase already initialized');
        }

        // Get database reference
        const database = firebase.database();
        
        // Test connection
        database.ref('.info/connected').on('value', function(snapshot) {
            if (snapshot.val() === true) {
                console.log('✅ Firebase connected successfully');
            } else {
                console.log('🔴 Firebase disconnected');
            }
        });

        // Export for use in other scripts
        window.firebaseDB = database;
        
    } catch (error) {
        console.error('❌ Firebase initialization error:', error);
        console.log('💡 Using fallback mode (localStorage only)');
    }
}