/**
 * DEBUG SYSTEM for Fighters Page Issues
 * 選手ページの問題をデバッグするシステム
 */

// デバッグコンソールを画面に表示
function createDebugConsole() {
    if (document.getElementById('debug-console')) return;
    
    const debugDiv = document.createElement('div');
    debugDiv.id = 'debug-console';
    debugDiv.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        width: 400px;
        height: 300px;
        background: rgba(0, 0, 0, 0.9);
        color: #00ff00;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        overflow-y: auto;
        z-index: 10001;
        border: 2px solid #00ff00;
        border-radius: 5px;
    `;
    
    debugDiv.innerHTML = `
        <div style="color: #ffff00; font-weight: bold; margin-bottom: 10px;">
            🔍 FIGHTER DEBUG CONSOLE
            <button onclick="clearDebugLog()" style="float: right; font-size: 10px;">Clear</button>
        </div>
        <div id="debug-log"></div>
    `;
    
    document.body.appendChild(debugDiv);
}

let debugMessages = [];

function debugLog(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const colorMap = {
        error: '#ff0000',
        warn: '#ffaa00', 
        info: '#00ff00',
        success: '#00ffff'
    };
    
    const logEntry = `[${timestamp}] ${message}`;
    debugMessages.push(logEntry);
    
    console.log(`🔍 ${logEntry}`);
    
    const debugLogDiv = document.getElementById('debug-log');
    if (debugLogDiv) {
        debugLogDiv.innerHTML = debugMessages.slice(-20).map(msg => 
            `<div style="color: ${colorMap[type] || '#00ff00'}">${msg}</div>`
        ).join('');
        debugLogDiv.scrollTop = debugLogDiv.scrollHeight;
    }
}

function clearDebugLog() {
    debugMessages = [];
    const debugLogDiv = document.getElementById('debug-log');
    if (debugLogDiv) {
        debugLogDiv.innerHTML = '';
    }
}

// モーダル状態を監視
function monitorModals() {
    debugLog('🎭 Starting modal monitoring...', 'info');
    
    const modals = ['fighter-modal', 'edit-modal', 'add-fighter-modal'];
    
    setInterval(() => {
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && modal.style.display === 'block') {
                debugLog(`🚨 MODAL OPEN: ${modalId}`, 'warn');
            }
        });
    }, 1000);
}

// fightersData の変更を監視
function monitorFightersData() {
    debugLog('📊 Starting fightersData monitoring...', 'info');
    
    let lastFightersCount = 0;
    let lastDataString = '';
    
    setInterval(() => {
        const currentData = window.fightersData || [];
        const currentCount = currentData.length;
        const currentDataString = JSON.stringify(currentData.slice(0, 3)); // 最初の3人分のみ
        
        if (currentCount !== lastFightersCount) {
            debugLog(`📈 FightersData count changed: ${lastFightersCount} → ${currentCount}`, 'info');
            lastFightersCount = currentCount;
        }
        
        if (currentDataString !== lastDataString) {
            debugLog(`🔄 FightersData content changed`, 'info');
            lastDataString = currentDataString;
        }
    }, 2000);
}

// localStorage の変更を監視
function monitorLocalStorage() {
    debugLog('💾 Starting localStorage monitoring...', 'info');
    
    let lastTimestamp = localStorage.getItem('fightersData_timestamp');
    
    setInterval(() => {
        const currentTimestamp = localStorage.getItem('fightersData_timestamp');
        if (currentTimestamp !== lastTimestamp) {
            debugLog(`💾 localStorage updated: ${new Date(parseInt(currentTimestamp)).toLocaleTimeString()}`, 'success');
            lastTimestamp = currentTimestamp;
        }
    }, 1000);
}

// フォーム入力を監視
function monitorFormInputs() {
    debugLog('📝 Starting form input monitoring...', 'info');
    
    document.addEventListener('input', (e) => {
        if (e.target.closest('#edit-form')) {
            debugLog(`📝 Form input: ${e.target.id} = "${e.target.value.substring(0, 20)}..."`, 'info');
        }
    });
    
    document.addEventListener('submit', (e) => {
        if (e.target.id === 'edit-form') {
            debugLog(`📤 FORM SUBMIT: edit-form`, 'warn');
        }
    });
}

// Firebase状態を監視
function monitorFirebaseStatus() {
    debugLog('🔥 Starting Firebase monitoring...', 'info');
    
    setInterval(() => {
        if (window.databaseSync) {
            const status = window.databaseSync.getSyncStatus();
            if (!status.isOnline) {
                debugLog(`🔥 Firebase OFFLINE`, 'error');
            }
        } else {
            debugLog(`🔥 DatabaseSync not available`, 'error');
        }
    }, 5000);
}

// 初期状態チェック
function checkInitialState() {
    debugLog('🚀 Checking initial state...', 'info');
    
    setTimeout(() => {
        // モーダルの初期状態をチェック
        const modals = ['fighter-modal', 'edit-modal', 'add-fighter-modal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal) {
                const isVisible = modal.style.display === 'block';
                debugLog(`🎭 ${modalId}: ${isVisible ? 'VISIBLE' : 'hidden'}`, isVisible ? 'error' : 'info');
            }
        });
        
        // fightersData の初期状態をチェック
        const fightersCount = window.fightersData ? window.fightersData.length : 0;
        debugLog(`📊 Initial fightersData: ${fightersCount} fighters`, 'info');
        
        // localStorage の状態をチェック
        const localData = JSON.parse(localStorage.getItem('fightersData') || '[]');
        debugLog(`💾 localStorage: ${localData.length} fighters`, 'info');
        
    }, 2000);
}

// 緊急修正ボタンを追加
function addEmergencyControls() {
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = `
        position: fixed;
        top: 320px;
        left: 10px;
        background: rgba(255, 0, 0, 0.9);
        padding: 10px;
        border-radius: 5px;
        z-index: 10002;
    `;
    
    controlsDiv.innerHTML = `
        <div style="color: white; font-weight: bold; margin-bottom: 5px;">🚨 EMERGENCY CONTROLS</div>
        <button onclick="closeAllModals()" style="margin: 2px; padding: 5px; font-size: 11px;">Close All Modals</button><br>
        <button onclick="forceReloadFighters()" style="margin: 2px; padding: 5px; font-size: 11px;">Reload Fighters</button><br>
        <button onclick="testSaveFunction()" style="margin: 2px; padding: 5px; font-size: 11px;">Test Save</button>
    `;
    
    document.body.appendChild(controlsDiv);
}

// 緊急関数
function closeAllModals() {
    debugLog('🚨 EMERGENCY: Closing all modals', 'error');
    ['fighter-modal', 'edit-modal', 'add-fighter-modal'].forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
        }
    });
}

function forceReloadFighters() {
    debugLog('🚨 EMERGENCY: Force reloading fighters', 'error');
    if (typeof displayFighters === 'function') {
        displayFighters();
    }
}

function testSaveFunction() {
    debugLog('🚨 EMERGENCY: Testing save function', 'error');
    const testData = window.fightersData || [];
    localStorage.setItem('fightersData', JSON.stringify(testData));
    debugLog(`💾 Test save: ${testData.length} fighters`, 'success');
}

// 全てを初期化
function initializeDebugSystem() {
    debugLog('🔍 DEBUG SYSTEM STARTING...', 'success');
    
    createDebugConsole();
    addEmergencyControls();
    
    monitorModals();
    monitorFightersData();
    monitorLocalStorage();
    monitorFormInputs();
    monitorFirebaseStatus();
    
    checkInitialState();
    
    debugLog('✅ DEBUG SYSTEM READY', 'success');
}

// ページ読み込み完了後に開始
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDebugSystem);
} else {
    initializeDebugSystem();
}

// グローバルにアクセス可能にする
window.debugFighters = {
    log: debugLog,
    clear: clearDebugLog,
    closeModals: closeAllModals,
    reloadFighters: forceReloadFighters,
    testSave: testSaveFunction
};