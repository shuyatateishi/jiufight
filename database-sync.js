/**
 * Database-powered Real-time Synchronization System for Jiufight
 * Uses Firebase Realtime Database for true cross-device sync
 */

class DatabaseSync {
    constructor() {
        this.db = null;
        this.deviceId = this.generateDeviceId();
        this.callbacks = {
            fighters: [],
            announcements: [],
            matches: []
        };
        this.isOnline = false;
        this.localCache = {
            fighters: [],
            announcements: [],
            matches: { current: 1 }
        };
        
        this.initializeDatabase();
    }
    
    // Generate unique device ID
    generateDeviceId() {
        let deviceId = sessionStorage.getItem('jiufight_device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('jiufight_device_id', deviceId);
        }
        return deviceId;
    }
    
    // Initialize Firebase database connection (Vercel optimized)
    async initializeDatabase() {
        try {
            // Wait for Firebase to be fully loaded (important for Vercel deployment)
            if (typeof firebase === 'undefined') {
                console.warn('⚠️ Firebase SDK not loaded, falling back to localStorage');
                this.useFallbackMode();
                return;
            }

            // Wait a bit for Firebase to initialize in case of slow networks
            let attempts = 0;
            while (!window.firebaseDB && attempts < 10) {
                await new Promise(resolve => setTimeout(resolve, 500));
                attempts++;
            }

            if (!window.firebaseDB) {
                console.warn('⚠️ Firebase database not initialized, falling back to localStorage');
                this.useFallbackMode();
                return;
            }
            
            this.db = window.firebaseDB;
            this.isOnline = true;
            
            // Set up connection state monitoring
            this.setupConnectionMonitoring();
            
            // Initialize data listeners
            this.setupFightersListener();
            this.setupAnnouncementsListener();
            this.setupMatchesListener();
            
            // Load initial data from local storage to database if needed
            await this.syncLocalToDatabase();
            
            console.log('✅ Database sync initialized successfully');
            console.log(`📱 Device ID: ${this.deviceId}`);
            
        } catch (error) {
            console.error('❌ Database initialization error:', error);
            this.useFallbackMode();
        }
    }
    
    // Fallback to localStorage-only mode
    useFallbackMode() {
        console.log('📴 Using offline mode (localStorage only)');
        this.isOnline = false;
        
        // Load from localStorage
        this.localCache.fighters = JSON.parse(localStorage.getItem('fightersData') || '[]');
        this.localCache.announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        this.localCache.matches.current = parseInt(localStorage.getItem('currentMatch') || '1');
        
        // Set up localStorage polling
        this.startLocalStoragePolling();
    }
    
    // Monitor online/offline status
    setupConnectionMonitoring() {
        if (!this.db) return;
        
        const connectedRef = this.db.ref('.info/connected');
        connectedRef.on('value', (snapshot) => {
            if (snapshot.val() === true) {
                console.log('🟢 Database connected');
                this.isOnline = true;
                this.syncLocalToDatabase();
            } else {
                console.log('🔴 Database disconnected');
                this.isOnline = false;
            }
        });
    }
    
    // Sync local data to database on connection
    async syncLocalToDatabase() {
        if (!this.db || !this.isOnline) return;
        
        try {
            // Get local data
            const localFighters = JSON.parse(localStorage.getItem('fightersData') || '[]');
            const localAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
            const localMatch = parseInt(localStorage.getItem('currentMatch') || '1');
            
            // Check if database is empty
            const fightersSnapshot = await this.db.ref('fighters').once('value');
            if (!fightersSnapshot.exists() && localFighters.length > 0) {
                console.log('📤 Uploading local fighters data to database...');
                await this.updateFighters(localFighters);
            }
            
            const announcementsSnapshot = await this.db.ref('announcements').once('value');
            if (!announcementsSnapshot.exists() && localAnnouncements.length > 0) {
                console.log('📤 Uploading local announcements to database...');
                await this.updateAnnouncements(localAnnouncements);
            }
            
            const matchSnapshot = await this.db.ref('matches/current').once('value');
            if (!matchSnapshot.exists()) {
                console.log('📤 Uploading match data to database...');
                await this.updateMatch(localMatch);
            }
            
        } catch (error) {
            console.error('Sync error:', error);
        }
    }
    
    // Set up real-time listeners for fighters data
    setupFightersListener() {
        if (!this.db) return;
        
        console.log('🎯 Setting up fighters listener...');
        
        this.db.ref('fighters').on('value', (snapshot) => {
            console.log('📡 Fighters snapshot received');
            const data = snapshot.val();
            
            if (data) {
                // Convert object to array if needed
                const fightersArray = Array.isArray(data) ? data : Object.values(data);
                
                console.log(`📊 Received ${fightersArray.length} fighters from Firebase`);
                
                // Check if this is a different update from what we have
                const currentDataStr = JSON.stringify(this.localCache.fighters);
                const newDataStr = JSON.stringify(fightersArray);
                
                if (currentDataStr !== newDataStr) {
                    console.log('✨ Data is different, updating local cache...');
                    
                    // Update local cache
                    this.localCache.fighters = fightersArray;
                    localStorage.setItem('fightersData', JSON.stringify(fightersArray));
                    localStorage.setItem('fightersData_timestamp', Date.now().toString());
                    
                    // Notify callbacks
                    console.log(`📢 Notifying ${this.callbacks.fighters.length} callbacks...`);
                    this.callbacks.fighters.forEach((callback, index) => {
                        try {
                            console.log(`  → Calling callback ${index + 1}`);
                            callback(fightersArray);
                        } catch (error) {
                            console.error(`Callback ${index + 1} error:`, error);
                        }
                    });
                    
                    console.log(`🔄 Fighters data updated from database: ${fightersArray.length} fighters`);
                } else {
                    console.log('⏭️ Data is same, skipping update');
                }
            } else {
                console.log('⚠️ No fighters data in snapshot');
            }
        }, (error) => {
            console.error('❌ Firebase listener error:', error);
        });
    }
    
    // Set up real-time listeners for announcements
    setupAnnouncementsListener() {
        if (!this.db) return;
        
        this.db.ref('announcements').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const announcementsArray = Array.isArray(data) ? data : Object.values(data);
                
                this.localCache.announcements = announcementsArray;
                localStorage.setItem('announcements', JSON.stringify(announcementsArray));
                localStorage.setItem('announcements_timestamp', Date.now().toString());
                
                this.callbacks.announcements.forEach(callback => {
                    try {
                        callback(announcementsArray);
                    } catch (error) {
                        console.error('Callback error:', error);
                    }
                });
                
                console.log(`🔄 Announcements updated from database: ${announcementsArray.length} items`);
            }
        });
    }
    
    // Set up real-time listeners for match data
    setupMatchesListener() {
        if (!this.db) return;
        
        this.db.ref('matches').on('value', (snapshot) => {
            const data = snapshot.val();
            if (data && data.current) {
                this.localCache.matches.current = data.current;
                localStorage.setItem('currentMatch', data.current.toString());
                localStorage.setItem('currentMatch_timestamp', Date.now().toString());
                
                this.callbacks.matches.forEach(callback => {
                    try {
                        callback(data.current);
                    } catch (error) {
                        console.error('Callback error:', error);
                    }
                });
                
                console.log(`🔄 Match updated from database: Match ${data.current}`);
            }
        });
    }
    
    // Update fighters data
    async updateFighters(fightersData) {
        console.log(`🔄 updateFighters called with ${fightersData.length} fighters`);
        console.log(`📊 Database status: online=${this.isOnline}, db=${!!this.db}`);
        
        const updateData = {
            data: fightersData,
            timestamp: Date.now(),
            deviceId: this.deviceId
        };
        
        if (this.db && this.isOnline) {
            try {
                console.log(`📤 Saving fighters to Firebase...`);
                
                // Firebaseに保存（配列をそのまま保存）
                const fightersRef = this.db.ref('fighters');
                await fightersRef.set(fightersData);
                console.log(`✅ Fighters array saved to Firebase`);
                
                // メタデータも保存
                const metadataRef = this.db.ref('metadata/fighters');
                await metadataRef.set({
                    lastUpdate: updateData.timestamp,
                    deviceId: updateData.deviceId,
                    count: fightersData.length
                });
                console.log(`✅ Metadata saved to Firebase`);
                
                console.log(`✅ Fighters data saved to database (${fightersData.length} fighters)`);
                console.log(`📱 Device ID: ${this.deviceId}`);
                console.log(`🕐 Timestamp: ${updateData.timestamp}`);
                
                // 保存後、データが正しく保存されたか確認
                const verifySnapshot = await fightersRef.once('value');
                const verifyData = verifySnapshot.val();
                console.log(`🔍 Verification: Firebase has ${verifyData ? verifyData.length : 0} fighters`);
                
            } catch (error) {
                console.error('❌ Database update error:', error);
                console.error('Error details:', error.message);
                this.saveToLocalStorage('fighters', fightersData);
            }
        } else {
            console.log(`💾 Using localStorage fallback`);
            this.saveToLocalStorage('fighters', fightersData);
        }
        
        // Always save to localStorage as backup
        localStorage.setItem('fightersData', JSON.stringify(fightersData));
        localStorage.setItem('fightersData_timestamp', updateData.timestamp.toString());
        console.log(`💾 Local storage updated with timestamp ${updateData.timestamp}`);
    }
    
    // Update announcements
    async updateAnnouncements(announcements) {
        const updateData = {
            data: announcements,
            timestamp: Date.now(),
            deviceId: this.deviceId
        };
        
        if (this.db && this.isOnline) {
            try {
                await this.db.ref('announcements').set(announcements);
                await this.db.ref('metadata/announcements').set({
                    lastUpdate: updateData.timestamp,
                    deviceId: updateData.deviceId,
                    count: announcements.length
                });
                console.log(`✅ Announcements saved to database (${announcements.length} items)`);
            } catch (error) {
                console.error('Database update error:', error);
                this.saveToLocalStorage('announcements', announcements);
            }
        } else {
            this.saveToLocalStorage('announcements', announcements);
        }
        
        localStorage.setItem('announcements', JSON.stringify(announcements));
        localStorage.setItem('announcements_timestamp', updateData.timestamp.toString());
    }
    
    // Update match number
    async updateMatch(matchNumber) {
        const updateData = {
            current: matchNumber,
            timestamp: Date.now(),
            deviceId: this.deviceId
        };
        
        if (this.db && this.isOnline) {
            try {
                await this.db.ref('matches').set({ current: matchNumber });
                await this.db.ref('metadata/matches').set({
                    lastUpdate: updateData.timestamp,
                    deviceId: updateData.deviceId,
                    currentMatch: matchNumber
                });
                console.log(`✅ Match number saved to database: ${matchNumber}`);
            } catch (error) {
                console.error('Database update error:', error);
                this.saveToLocalStorage('match', matchNumber);
            }
        } else {
            this.saveToLocalStorage('match', matchNumber);
        }
        
        localStorage.setItem('currentMatch', matchNumber.toString());
        localStorage.setItem('currentMatch_timestamp', updateData.timestamp.toString());
    }
    
    // Save to localStorage when offline
    saveToLocalStorage(type, data) {
        console.log(`💾 Saving ${type} to localStorage (offline mode)`);
        
        switch(type) {
            case 'fighters':
                localStorage.setItem('fightersData', JSON.stringify(data));
                break;
            case 'announcements':
                localStorage.setItem('announcements', JSON.stringify(data));
                break;
            case 'match':
                localStorage.setItem('currentMatch', data.toString());
                break;
        }
        
        // Queue for later sync when online
        this.queueForSync(type, data);
    }
    
    // Queue data for sync when connection is restored
    queueForSync(type, data) {
        const queue = JSON.parse(localStorage.getItem('jiufight_sync_queue') || '[]');
        queue.push({
            type,
            data,
            timestamp: Date.now(),
            deviceId: this.deviceId
        });
        localStorage.setItem('jiufight_sync_queue', JSON.stringify(queue));
    }
    
    // Process sync queue when online
    async processSyncQueue() {
        if (!this.db || !this.isOnline) return;
        
        const queue = JSON.parse(localStorage.getItem('jiufight_sync_queue') || '[]');
        if (queue.length === 0) return;
        
        console.log(`📤 Processing ${queue.length} queued updates...`);
        
        for (const item of queue) {
            try {
                switch(item.type) {
                    case 'fighters':
                        await this.updateFighters(item.data);
                        break;
                    case 'announcements':
                        await this.updateAnnouncements(item.data);
                        break;
                    case 'match':
                        await this.updateMatch(item.data);
                        break;
                }
            } catch (error) {
                console.error('Queue processing error:', error);
            }
        }
        
        // Clear queue
        localStorage.removeItem('jiufight_sync_queue');
    }
    
    // Register callbacks
    onFighterUpdate(callback) {
        console.log('📌 Registering fighter update callback');
        this.callbacks.fighters.push(callback);
        console.log(`📊 Total callbacks registered: ${this.callbacks.fighters.length}`);
        
        // Immediately call with current data
        if (this.localCache.fighters.length > 0) {
            console.log(`📤 Calling callback with cached data: ${this.localCache.fighters.length} fighters`);
            callback(this.localCache.fighters);
        } else {
            console.log('📭 No cached data to send');
        }
    }
    
    onAnnouncementUpdate(callback) {
        this.callbacks.announcements.push(callback);
        if (this.localCache.announcements.length > 0) {
            callback(this.localCache.announcements);
        }
    }
    
    onMatchUpdate(callback) {
        this.callbacks.matches.push(callback);
        callback(this.localCache.matches.current);
    }
    
    // Get current sync status
    getSyncStatus() {
        return {
            isOnline: this.isOnline,
            deviceId: this.deviceId,
            hasDatabase: !!this.db,
            localCache: {
                fighters: this.localCache.fighters.length,
                announcements: this.localCache.announcements.length,
                currentMatch: this.localCache.matches.current
            },
            syncQueue: JSON.parse(localStorage.getItem('jiufight_sync_queue') || '[]').length
        };
    }
    
    // Start localStorage polling for offline mode
    startLocalStoragePolling() {
        setInterval(() => {
            // Check for changes in localStorage
            const currentFighters = JSON.parse(localStorage.getItem('fightersData') || '[]');
            const currentAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
            const currentMatch = parseInt(localStorage.getItem('currentMatch') || '1');
            
            // Check if data changed
            if (JSON.stringify(currentFighters) !== JSON.stringify(this.localCache.fighters)) {
                this.localCache.fighters = currentFighters;
                this.callbacks.fighters.forEach(cb => cb(currentFighters));
            }
            
            if (JSON.stringify(currentAnnouncements) !== JSON.stringify(this.localCache.announcements)) {
                this.localCache.announcements = currentAnnouncements;
                this.callbacks.announcements.forEach(cb => cb(currentAnnouncements));
            }
            
            if (currentMatch !== this.localCache.matches.current) {
                this.localCache.matches.current = currentMatch;
                this.callbacks.matches.forEach(cb => cb(currentMatch));
            }
        }, 2000); // Poll every 2 seconds
    }
    
    // Force sync check
    async forceSync() {
        console.log('🔄 Forcing sync check...');
        
        if (this.isOnline) {
            await this.processSyncQueue();
            
            // Re-fetch all data
            if (this.db) {
                const fightersSnapshot = await this.db.ref('fighters').once('value');
                const announcementsSnapshot = await this.db.ref('announcements').once('value');
                const matchSnapshot = await this.db.ref('matches/current').once('value');
                
                console.log('✅ Force sync completed');
            }
        } else {
            console.log('📴 Cannot force sync - offline');
        }
    }
}

// Create global instance
window.databaseSync = new DatabaseSync();

console.log('🚀 Database sync system initialized');