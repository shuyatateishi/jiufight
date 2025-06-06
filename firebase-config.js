/**
 * Firebase Configuration for Jiufight
 * This provides real-time database sync across all devices
 * Optimized for Vercel deployment
 */

// Firebase configuration - Live production config
const firebaseConfig = {
    apiKey: "AIzaSyCovPI3FuL8dIvCkaQTOOO3VcRQEqpMo00",
    authDomain: "jiufight-20836.firebaseapp.com",
    databaseURL: "https://jiufight-20836-default-rtdb.firebaseio.com",
    projectId: "jiufight-20836",
    storageBucket: "jiufight-20836.firebasestorage.app",
    messagingSenderId: "977988247154",
    appId: "1:977988247154:web:82e43c0d6804c0c20daceb",
    measurementId: "G-5S9SRB6F5J"
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