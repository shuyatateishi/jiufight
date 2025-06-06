/**
 * EMERGENCY SYNC SYSTEM - 絶対に動作する緊急同期システム
 * すべてのシステムが失敗した場合の最終手段
 */

class EmergencySync {
    constructor() {
        this.isActive = false;
        this.forceEnabled = true;
        this.syncInterval = null;
        this.backupData = {};
        
        this.init();
        console.log('🚨 EMERGENCY SYNC SYSTEM ACTIVATED');
    }
    
    init() {
        // 3秒後に開始
        setTimeout(() => {
            this.startEmergencySync();
        }, 3000);
        
        // ページ離脱時に強制保存
        window.addEventListener('beforeunload', () => {
            this.forceBackup();
        });
        
        // フォーカス復帰時に強制同期
        window.addEventListener('focus', () => {
            this.forceSyncCheck();
        });
    }
    
    startEmergencySync() {
        console.log('🚨 Starting emergency sync system...');
        this.isActive = true;
        
        // 5秒おきに強制バックアップ
        this.syncInterval = setInterval(() => {
            this.forceBackup();
            this.forceSyncCheck();
        }, 5000);
        
        // DOMの変更を監視
        this.watchFormChanges();
    }
    
    forceBackup() {
        try {
            // 現在のfightersDataを複数箇所に保存
            const data = window.fightersData || JSON.parse(localStorage.getItem('fightersData') || '[]');
            const timestamp = Date.now();
            
            // 1. 通常のlocalStorage
            localStorage.setItem('fightersData', JSON.stringify(data));
            localStorage.setItem('fightersData_timestamp', timestamp.toString());
            
            // 2. セッションストレージにもバックアップ
            sessionStorage.setItem('emergency_fightersData', JSON.stringify(data));
            sessionStorage.setItem('emergency_timestamp', timestamp.toString());
            
            // 3. IndexedDBにも保存（非同期）
            this.saveToIndexedDB(data, timestamp);
            
            // 4. メモリバックアップ
            this.backupData = {
                fighters: JSON.parse(JSON.stringify(data)),
                timestamp: timestamp
            };
            
            console.log(`🚨 EMERGENCY BACKUP: ${data.length} fighters saved to multiple locations`);
            
        } catch (error) {
            console.error('🚨 EMERGENCY BACKUP FAILED:', error);
        }
    }
    
    async saveToIndexedDB(data, timestamp) {
        try {
            const request = indexedDB.open('jiufight_emergency', 1);
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('fighters')) {
                    db.createObjectStore('fighters', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('metadata')) {
                    db.createObjectStore('metadata', { keyPath: 'key' });
                }
            };
            
            request.onsuccess = (event) => {
                const db = event.target.result;
                const transaction = db.transaction(['fighters', 'metadata'], 'readwrite');
                
                // Save fighters
                const fightersStore = transaction.objectStore('fighters');
                fightersStore.clear();
                data.forEach(fighter => {
                    fightersStore.add(fighter);
                });
                
                // Save metadata
                const metadataStore = transaction.objectStore('metadata');
                metadataStore.put({ key: 'timestamp', value: timestamp });
                metadataStore.put({ key: 'count', value: data.length });
                
                console.log('🚨 IndexedDB backup completed');
            };
            
        } catch (error) {
            console.error('🚨 IndexedDB backup failed:', error);
        }
    }
    
    forceSyncCheck() {
        if (window.databaseSync && window.databaseSync.isOnline) {
            // Firebase同期を強制実行
            const data = this.backupData.fighters || window.fightersData || JSON.parse(localStorage.getItem('fightersData') || '[]');
            
            console.log('🚨 FORCING Firebase sync with emergency data...');
            window.databaseSync.updateFighters(data).catch(error => {
                console.error('🚨 Emergency Firebase sync failed:', error);
            });
        }
    }
    
    watchFormChanges() {
        // フォーム送信を監視
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'edit-form' || e.target.id === 'add-fighter-form') {
                console.log('🚨 FORM SUBMIT DETECTED - Forcing backup...');
                setTimeout(() => {
                    this.forceBackup();
                    this.forceSyncCheck();
                }, 100);
            }
        });
        
        // 入力変更を監視
        document.addEventListener('input', (e) => {
            if (e.target.closest('#edit-form') || e.target.closest('#add-fighter-form')) {
                // 入力中は3秒後にバックアップ
                clearTimeout(this.inputTimeout);
                this.inputTimeout = setTimeout(() => {
                    this.forceBackup();
                }, 3000);
            }
        });
    }
    
    // 緊急復旧機能
    async emergencyRecover() {
        console.log('🚨 EMERGENCY RECOVERY INITIATED...');
        
        let recoveredData = null;
        
        // 1. メモリから復旧
        if (this.backupData.fighters && this.backupData.fighters.length > 0) {
            recoveredData = this.backupData.fighters;
            console.log('🚨 Recovered from memory backup');
        }
        
        // 2. sessionStorageから復旧
        else {
            const sessionData = sessionStorage.getItem('emergency_fightersData');
            if (sessionData) {
                recoveredData = JSON.parse(sessionData);
                console.log('🚨 Recovered from session storage');
            }
        }
        
        // 3. IndexedDBから復旧
        if (!recoveredData || recoveredData.length === 0) {
            recoveredData = await this.recoverFromIndexedDB();
        }
        
        // 4. 復旧データを適用
        if (recoveredData && recoveredData.length > 0) {
            localStorage.setItem('fightersData', JSON.stringify(recoveredData));
            window.fightersData = recoveredData;
            window.filteredFighters = [...recoveredData];
            
            // 表示更新
            if (typeof displayFighters === 'function') {
                displayFighters();
            }
            
            console.log(`🚨 EMERGENCY RECOVERY COMPLETED: ${recoveredData.length} fighters restored`);
            return true;
        }
        
        console.error('🚨 EMERGENCY RECOVERY FAILED: No backup data found');
        return false;
    }
    
    async recoverFromIndexedDB() {
        return new Promise((resolve) => {
            try {
                const request = indexedDB.open('jiufight_emergency', 1);
                
                request.onsuccess = (event) => {
                    const db = event.target.result;
                    const transaction = db.transaction(['fighters'], 'readonly');
                    const store = transaction.objectStore('fighters');
                    const getAllRequest = store.getAll();
                    
                    getAllRequest.onsuccess = () => {
                        const data = getAllRequest.result;
                        console.log(`🚨 Recovered ${data.length} fighters from IndexedDB`);
                        resolve(data);
                    };
                    
                    getAllRequest.onerror = () => {
                        resolve([]);
                    };
                };
                
                request.onerror = () => {
                    resolve([]);
                };
                
            } catch (error) {
                console.error('🚨 IndexedDB recovery failed:', error);
                resolve([]);
            }
        });
    }
    
    // 緊急状況報告
    getEmergencyStatus() {
        return {
            isActive: this.isActive,
            backupCount: this.backupData.fighters ? this.backupData.fighters.length : 0,
            lastBackup: this.backupData.timestamp ? new Date(this.backupData.timestamp).toLocaleString() : 'None',
            hasDatabaseSync: !!window.databaseSync,
            isDatabaseOnline: window.databaseSync ? window.databaseSync.isOnline : false
        };
    }
}

// グローバルに配置して確実に動作させる
window.emergencySync = new EmergencySync();

// 緊急コマンド
window.emergencyRecover = () => window.emergencySync.emergencyRecover();
window.emergencyStatus = () => console.table(window.emergencySync.getEmergencyStatus());
window.forceBackup = () => window.emergencySync.forceBackup();

console.log('🚨 EMERGENCY SYNC SYSTEM READY');
console.log('🚨 Commands: emergencyRecover(), emergencyStatus(), forceBackup()');