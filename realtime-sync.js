/**
 * Real-time synchronization system for Jiufight
 * Handles announcements, match progress, and fighter profile updates across browser windows/tabs
 */

class RealtimeSync {
    constructor() {
        this.channels = {
            announcements: new BroadcastChannel('jiufight-announcements'),
            matches: new BroadcastChannel('jiufight-matches'),
            fighters: new BroadcastChannel('jiufight-fighters')
        };
        
        this.lastUpdateTimes = {
            announcements: 0,
            matches: 0,
            fighters: 0
        };
        
        this.callbacks = {
            announcements: [],
            matches: [],
            fighters: []
        };
        
        this.initializeBroadcastListeners();
        this.startPolling();
    }
    
    // Initialize broadcast channel listeners
    initializeBroadcastListeners() {
        this.channels.announcements.onmessage = (event) => {
            if (event.data.type === 'update') {
                this.handleAnnouncementUpdate();
            }
        };
        
        this.channels.matches.onmessage = (event) => {
            if (event.data.type === 'update') {
                this.handleMatchUpdate();
            }
        };
        
        this.channels.fighters.onmessage = (event) => {
            if (event.data.type === 'update') {
                this.handleFighterUpdate();
            }
        };
    }
    
    // Start polling for changes (fallback for cross-browser compatibility)
    startPolling() {
        setInterval(() => {
            this.checkForUpdates();
        }, 5000); // Check every 5 seconds
    }
    
    // Check for updates across all data types
    checkForUpdates() {
        this.checkAnnouncementUpdates();
        this.checkMatchUpdates();
        this.checkFighterUpdates();
    }
    
    // Announcements management
    updateAnnouncements(announcements) {
        const timestamp = Date.now();
        localStorage.setItem('announcements', JSON.stringify(announcements));
        localStorage.setItem('announcements_timestamp', timestamp.toString());
        
        // Broadcast to other windows/tabs
        this.channels.announcements.postMessage({
            type: 'update',
            timestamp: timestamp
        });
        
        this.lastUpdateTimes.announcements = timestamp;
    }
    
    checkAnnouncementUpdates() {
        const storedTimestamp = parseInt(localStorage.getItem('announcements_timestamp') || '0');
        if (storedTimestamp > this.lastUpdateTimes.announcements) {
            this.handleAnnouncementUpdate();
        }
    }
    
    handleAnnouncementUpdate() {
        const announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
        const timestamp = parseInt(localStorage.getItem('announcements_timestamp') || '0');
        
        this.lastUpdateTimes.announcements = timestamp;
        
        // Notify all registered callbacks
        this.callbacks.announcements.forEach(callback => {
            callback(announcements);
        });
    }
    
    onAnnouncementUpdate(callback) {
        this.callbacks.announcements.push(callback);
    }
    
    // Match progress management
    updateMatch(matchNumber) {
        const timestamp = Date.now();
        localStorage.setItem('currentMatch', matchNumber.toString());
        localStorage.setItem('currentMatch_timestamp', timestamp.toString());
        
        // Broadcast to other windows/tabs
        this.channels.matches.postMessage({
            type: 'update',
            matchNumber: matchNumber,
            timestamp: timestamp
        });
        
        this.lastUpdateTimes.matches = timestamp;
    }
    
    checkMatchUpdates() {
        const storedTimestamp = parseInt(localStorage.getItem('currentMatch_timestamp') || '0');
        if (storedTimestamp > this.lastUpdateTimes.matches) {
            this.handleMatchUpdate();
        }
    }
    
    handleMatchUpdate() {
        const matchNumber = parseInt(localStorage.getItem('currentMatch') || '1');
        const timestamp = parseInt(localStorage.getItem('currentMatch_timestamp') || '0');
        
        this.lastUpdateTimes.matches = timestamp;
        
        // Notify all registered callbacks
        this.callbacks.matches.forEach(callback => {
            callback(matchNumber);
        });
    }
    
    onMatchUpdate(callback) {
        this.callbacks.matches.push(callback);
    }
    
    // Fighter data management
    updateFighters(fightersData) {
        const timestamp = Date.now();
        localStorage.setItem('fightersData', JSON.stringify(fightersData));
        localStorage.setItem('fightersData_timestamp', timestamp.toString());
        
        // Broadcast to other windows/tabs
        this.channels.fighters.postMessage({
            type: 'update',
            timestamp: timestamp
        });
        
        this.lastUpdateTimes.fighters = timestamp;
    }
    
    checkFighterUpdates() {
        const storedTimestamp = parseInt(localStorage.getItem('fightersData_timestamp') || '0');
        if (storedTimestamp > this.lastUpdateTimes.fighters) {
            this.handleFighterUpdate();
        }
    }
    
    handleFighterUpdate() {
        const fightersData = JSON.parse(localStorage.getItem('fightersData') || '[]');
        const timestamp = parseInt(localStorage.getItem('fightersData_timestamp') || '0');
        
        this.lastUpdateTimes.fighters = timestamp;
        
        // Notify all registered callbacks
        this.callbacks.fighters.forEach(callback => {
            callback(fightersData);
        });
    }
    
    onFighterUpdate(callback) {
        this.callbacks.fighters.push(callback);
    }
    
    // Cleanup
    destroy() {
        Object.values(this.channels).forEach(channel => {
            channel.close();
        });
    }
}

// Global instance
window.realtimeSync = new RealtimeSync();

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RealtimeSync;
}