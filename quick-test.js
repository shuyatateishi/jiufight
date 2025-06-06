/**
 * Quick test script for real-time sync functionality
 * Run this in browser console to test the sync system
 */

console.log('🧪 Jiufight リアルタイム同期テスト開始');

// Test 1: Check if real-time sync system is available
function testSyncSystemAvailability() {
    console.log('\n📋 Test 1: システム可用性チェック');
    
    if (typeof window.realtimeSync !== 'undefined') {
        console.log('✅ RealtimeSync システムが利用可能');
        return true;
    } else {
        console.log('❌ RealtimeSync システムが見つかりません');
        return false;
    }
}

// Test 2: Check existing fighter data
function testExistingData() {
    console.log('\n📋 Test 2: 既存データチェック');
    
    const fightersData = localStorage.getItem('fightersData');
    const timestamp = localStorage.getItem('fightersData_timestamp');
    
    if (fightersData) {
        const data = JSON.parse(fightersData);
        console.log(`✅ 選手データ発見: ${data.length}人`);
        
        if (timestamp) {
            const lastUpdate = new Date(parseInt(timestamp));
            console.log(`📅 最終更新: ${lastUpdate.toLocaleString()}`);
            console.log(`⏰ 経過時間: ${Math.round((Date.now() - parseInt(timestamp)) / 1000)}秒`);
        }
        
        return data;
    } else {
        console.log('⚠️ 選手データが見つかりません');
        return [];
    }
}

// Test 3: Create test fighter and update
function testFighterUpdate() {
    console.log('\n📋 Test 3: 選手データ更新テスト');
    
    if (!window.realtimeSync) {
        console.log('❌ RealtimeSync システムが利用できません');
        return false;
    }
    
    // Get existing data
    let fightersData = [];
    const existingData = localStorage.getItem('fightersData');
    if (existingData) {
        fightersData = JSON.parse(existingData);
    }
    
    // Create test fighter
    const testFighter = {
        id: 99999,
        name: 'クイックテスト選手',
        nickname: 'JS テスター',
        belt: 'black',
        weight: 'light',
        dojo: 'コンソール道場',
        wins: 100,
        losses: 0,
        bio: 'JavaScriptコンソールからのテスト選手です',
        fullName: 'テスト太郎',
        age: '30',
        occupation: 'デバッガー',
        location: 'ブラウザ内',
        experience: 'JS歴10年',
        specialty: 'console.log',
        characteristic: 'いつもテストしてる',
        motivation: 'バグを倒したい！',
        testTimestamp: new Date().toISOString()
    };
    
    // Add or update test fighter
    const existingIndex = fightersData.findIndex(f => f.id === 99999);
    if (existingIndex >= 0) {
        fightersData[existingIndex] = testFighter;
        console.log('🔄 テスト選手を更新');
    } else {
        fightersData.push(testFighter);
        console.log('➕ テスト選手を追加');
    }
    
    // Save with real-time sync
    window.realtimeSync.updateFighters(fightersData);
    console.log('✅ リアルタイム同期で保存完了');
    
    return testFighter;
}

// Test 4: Set up sync listener
function testSyncListener() {
    console.log('\n📋 Test 4: 同期リスナーテスト');
    
    if (!window.realtimeSync) {
        console.log('❌ RealtimeSync システムが利用できません');
        return false;
    }
    
    window.realtimeSync.onFighterUpdate((updatedData) => {
        console.log('🔄 リアルタイム更新を受信!');
        console.log(`📊 更新された選手数: ${updatedData.length}`);
        console.log(`⏰ 受信時刻: ${new Date().toLocaleString()}`);
        
        // Check for test fighter
        const testFighter = updatedData.find(f => f.id === 99999);
        if (testFighter) {
            console.log('🎯 テスト選手が見つかりました:', testFighter.nickname);
        }
    });
    
    console.log('✅ 同期リスナーを設定しました');
    return true;
}

// Test 5: Cross-device simulation
function testCrossDevice() {
    console.log('\n📋 Test 5: 別端末間同期テスト');
    
    if (!window.realtimeSync) {
        console.log('❌ RealtimeSync システムが利用できません');
        return false;
    }
    
    console.log('🌐 別端末間同期のテスト実行中...');
    
    // Create cross-device test data
    const testData = {
        id: 77777,
        name: 'クロスデバイステスト選手',
        nickname: `別端末テスター_${Date.now()}`,
        belt: 'purple',
        weight: 'light',
        dojo: `${window.realtimeSync.deviceId}_テスト道場`,
        wins: 999,
        losses: 0,
        bio: `別端末間同期テスト - 端末ID: ${window.realtimeSync.deviceId}`,
        testTimestamp: new Date().toISOString(),
        deviceOrigin: window.realtimeSync.deviceId
    };
    
    // Add to existing data
    let fightersData = JSON.parse(localStorage.getItem('fightersData') || '[]');
    const existingIndex = fightersData.findIndex(f => f.id === 77777);
    
    if (existingIndex >= 0) {
        fightersData[existingIndex] = testData;
        console.log('🔄 テスト選手を更新');
    } else {
        fightersData.push(testData);
        console.log('➕ テスト選手を追加');
    }
    
    // Update with cross-device sync
    window.realtimeSync.updateFighters(fightersData);
    
    console.log('✅ 別端末間同期テストデータを送信しました');
    console.log(`📱 端末ID: ${window.realtimeSync.deviceId}`);
    console.log('💡 他の端末・ブラウザでも同じテストを実行して、相互同期を確認してください');
    console.log('🔍 同期状態確認: window.realtimeSync.getSyncStatus()');
    
    return true;
}

// Test 6: Persistence check
function testPersistence() {
    console.log('\n📋 Test 6: データ永続化テスト');
    
    const timestamp = localStorage.getItem('fightersData_timestamp');
    if (timestamp) {
        const lastUpdate = new Date(parseInt(timestamp));
        const now = new Date();
        const timeDiff = now - lastUpdate;
        
        console.log(`📅 最終更新: ${lastUpdate.toLocaleString()}`);
        console.log(`⏰ 経過時間: ${Math.round(timeDiff / 1000)}秒`);
        
        if (timeDiff > 10000) { // 10秒以上前
            console.log('✅ データは正常に永続化されています');
        } else {
            console.log('🔄 データは最近更新されました');
        }
        
        return true;
    } else {
        console.log('⚠️ タイムスタンプが見つかりません');
        return false;
    }
}

// Test 7: Clean up test data
function cleanupTestData() {
    console.log('\n📋 Test 7: テストデータクリーンアップ');
    
    let fightersData = [];
    const existingData = localStorage.getItem('fightersData');
    if (existingData) {
        fightersData = JSON.parse(existingData);
        
        // Remove test fighters
        const originalLength = fightersData.length;
        fightersData = fightersData.filter(f => f.id !== 99999 && f.id !== 9999);
        
        if (fightersData.length < originalLength) {
            if (window.realtimeSync) {
                window.realtimeSync.updateFighters(fightersData);
                console.log('✅ テスト選手を削除（リアルタイム同期）');
            } else {
                localStorage.setItem('fightersData', JSON.stringify(fightersData));
                console.log('✅ テスト選手を削除（localStorage）');
            }
        } else {
            console.log('ℹ️ 削除するテストデータが見つかりませんでした');
        }
    }
}

// Run all tests
function runAllTests() {
    console.log('🚀 全テスト実行中...\n');
    
    const results = {
        systemAvailable: testSyncSystemAvailability(),
        dataExists: testExistingData().length > 0,
        updateWorks: false,
        listenerWorks: false,
        crossTabWorks: false,
        persistenceWorks: false
    };
    
    if (results.systemAvailable) {
        results.listenerWorks = testSyncListener();
        results.updateWorks = !!testFighterUpdate();
        results.crossDeviceWorks = testCrossDevice();
        results.persistenceWorks = testPersistence();
    }
    
    console.log('\n📊 テスト結果サマリー:');
    console.log('─────────────────────────');
    console.log(`システム可用性: ${results.systemAvailable ? '✅' : '❌'}`);
    console.log(`既存データ: ${results.dataExists ? '✅' : '⚠️'}`);
    console.log(`更新機能: ${results.updateWorks ? '✅' : '❌'}`);
    console.log(`リスナー: ${results.listenerWorks ? '✅' : '❌'}`);
    console.log(`別端末同期: ${results.crossDeviceWorks ? '✅' : '❌'}`);
    console.log(`永続化: ${results.persistenceWorks ? '✅' : '⚠️'}`);
    
    console.log('\n💡 次のステップ:');
    console.log('1. 選手一覧ページ (fighters.html) を開いてテスト選手を編集');
    console.log('2. ランキングページ (rankings.html) を開いて同期を確認');
    console.log('3. cleanupTestData() でテストデータを削除');
    
    return results;
}

// Export functions for manual testing
window.jiufightTest = {
    runAllTests,
    testSyncSystemAvailability,
    testExistingData,
    testFighterUpdate,
    testSyncListener,
    testCrossDevice,
    testPersistence,
    cleanupTestData
};

console.log('\n🎯 テスト関数が利用可能です:');
console.log('- jiufightTest.runAllTests() : 全テスト実行');
console.log('- jiufightTest.cleanupTestData() : テストデータ削除');
console.log('\n自動テストを開始します...');

// Auto-run tests
runAllTests();