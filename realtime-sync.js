/**
 * Real-time synchronization system for Jiufight
 * Handles announcements, match progress, and fighter profile updates across browser windows/tabs
 */

class RealtimeSync {
    constructor() {
        // BroadcastChannel（同一ブラウザ内のタブ間同期用）
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
        
        // 別端末間同期用の強化されたシステム
        this.deviceId = this.generateDeviceId();
        this.syncMarkers = {
            announcements: 'jiufight_announcements_sync',
            matches: 'jiufight_matches_sync', 
            fighters: 'jiufight_fighters_sync'
        };
        
        this.initializeBroadcastListeners();
        this.initializeCrossDeviceSync();
        this.startPolling();
    }
    
    // デバイス固有IDを生成（セッション用）
    generateDeviceId() {
        let deviceId = sessionStorage.getItem('jiufight_device_id');
        if (!deviceId) {
            deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('jiufight_device_id', deviceId);
        }
        return deviceId;
    }
    
    // 別端末間同期の初期化
    initializeCrossDeviceSync() {
        // localStorageイベントリスナー（別端末からの変更を検知）
        window.addEventListener('storage', (e) => {
            if (e.key && e.key.includes('_timestamp')) {
                console.log('Cross-device sync detected:', e.key);
                setTimeout(() => {
                    this.checkForUpdates();
                }, 100);
            }
        });
        
        // 初期同期マーカーの設定
        this.updateSyncMarker('fighters');
        this.updateSyncMarker('announcements');
        this.updateSyncMarker('matches');
    }
    
    // 同期マーカーを更新（他端末に変更を通知）
    updateSyncMarker(type) {
        const markerKey = this.syncMarkers[type];
        const marker = {
            deviceId: this.deviceId,
            timestamp: Date.now(),
            lastUpdate: parseInt(localStorage.getItem(`${type}Data_timestamp`) || '0')
        };
        localStorage.setItem(markerKey, JSON.stringify(marker));
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
        // より頻繁にチェック（別端末間同期のため）
        setInterval(() => {
            this.checkForUpdates();
        }, 2000); // Check every 2 seconds
        
        // ページがアクティブになった時に即座にチェック
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                setTimeout(() => {
                    this.checkForUpdates();
                }, 500);
            }
        });
        
        // ウィンドウフォーカス時にもチェック
        window.addEventListener('focus', () => {
            setTimeout(() => {
                this.checkForUpdates();
            }, 300);
        });
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
        
        // Broadcast to other windows/tabs (同一ブラウザ内)
        this.channels.announcements.postMessage({
            type: 'update',
            timestamp: timestamp
        });
        
        // 別端末間同期マーカー更新
        this.updateSyncMarker('announcements');
        
        this.lastUpdateTimes.announcements = timestamp;
        
        console.log(`アナウンス更新完了 - 端末ID: ${this.deviceId}, タイムスタンプ: ${timestamp}`);
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
        
        // Broadcast to other windows/tabs (同一ブラウザ内)
        this.channels.matches.postMessage({
            type: 'update',
            matchNumber: matchNumber,
            timestamp: timestamp
        });
        
        // 別端末間同期マーカー更新
        this.updateSyncMarker('matches');
        
        this.lastUpdateTimes.matches = timestamp;
        
        console.log(`試合データ更新完了 - 端末ID: ${this.deviceId}, 試合番号: ${matchNumber}`);
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
        
        // Broadcast to other windows/tabs (同一ブラウザ内)
        this.channels.fighters.postMessage({
            type: 'update',
            timestamp: timestamp
        });
        
        // 別端末間同期マーカー更新
        this.updateSyncMarker('fighters');
        
        this.lastUpdateTimes.fighters = timestamp;
        
        console.log(`選手データ更新完了 - 端末ID: ${this.deviceId}, タイムスタンプ: ${timestamp}`);
    }
    
    checkFighterUpdates() {
        const storedTimestamp = parseInt(localStorage.getItem('fightersData_timestamp') || '0');
        
        // 同期マーカーもチェック（別端末からの更新検知用）
        const syncMarker = localStorage.getItem(this.syncMarkers.fighters);
        if (syncMarker) {
            try {
                const marker = JSON.parse(syncMarker);
                // 他の端末からの更新かチェック
                if (marker.deviceId !== this.deviceId && marker.lastUpdate > this.lastUpdateTimes.fighters) {
                    console.log(`別端末 (${marker.deviceId}) からの選手データ更新を検知`);
                    this.handleFighterUpdate();
                    return;
                }
            } catch (e) {
                console.warn('同期マーカーの解析に失敗:', e);
            }
        }
        
        // 通常のタイムスタンプチェック
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
    
    // デバッグ用：同期状態を確認
    getSyncStatus() {
        const status = {
            deviceId: this.deviceId,
            lastUpdateTimes: this.lastUpdateTimes,
            localStorageData: {
                fighters: {
                    count: JSON.parse(localStorage.getItem('fightersData') || '[]').length,
                    timestamp: localStorage.getItem('fightersData_timestamp'),
                    syncMarker: localStorage.getItem(this.syncMarkers.fighters)
                },
                announcements: {
                    count: JSON.parse(localStorage.getItem('announcements') || '[]').length,
                    timestamp: localStorage.getItem('announcements_timestamp'),
                    syncMarker: localStorage.getItem(this.syncMarkers.announcements)
                },
                matches: {
                    current: localStorage.getItem('currentMatch'),
                    timestamp: localStorage.getItem('currentMatch_timestamp'),
                    syncMarker: localStorage.getItem(this.syncMarkers.matches)
                }
            }
        };
        return status;
    }
    
    // 強制同期実行
    forceSyncCheck() {
        console.log('強制同期チェック実行中...');
        this.checkForUpdates();
        console.log('現在の同期状態:', this.getSyncStatus());
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