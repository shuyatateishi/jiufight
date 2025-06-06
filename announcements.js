// Announcement data management
let announcements = {
    weighIn: [],
    matchCall: [],
    awards: [],
    general: []
};

// Audio settings
let audioEnabled = true;
let audioVolume = 0.7;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadMatchProgress();
    loadAnnouncements();
    startAutoRefresh();
    
    // Initialize real-time sync listeners
    if (window.realtimeSync) {
        window.realtimeSync.onAnnouncementUpdate((announcements) => {
            loadAnnouncements();
        });
        
        window.realtimeSync.onMatchUpdate((matchNumber) => {
            loadMatchProgress();
        });
    }
});

// Event listeners
function initializeEventListeners() {
    // Mobile menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Refresh button
    document.getElementById('refresh-btn').addEventListener('click', () => {
        loadMatchProgress();
        loadAnnouncements();
    });
    
    // Auto refresh checkbox
    document.getElementById('auto-refresh').addEventListener('change', (e) => {
        if (e.target.checked) {
            startAutoRefresh();
        } else {
            stopAutoRefresh();
        }
    });
    
    // Audio controls
    const audioToggle = document.getElementById('audio-toggle');
    audioToggle.addEventListener('click', () => {
        audioEnabled = !audioEnabled;
        audioToggle.textContent = audioEnabled ? '音声ON' : '音声OFF';
        audioToggle.classList.toggle('off', !audioEnabled);
    });
    
    document.getElementById('volume-control').addEventListener('input', (e) => {
        audioVolume = e.target.value / 100;
    });
}

// Track previous announcement count to detect new ones
let previousAnnouncementCount = 0;

// Load announcements from localStorage (set by admin panel)
function loadAnnouncements() {
    // Load announcements from localStorage
    const savedAnnouncements = JSON.parse(localStorage.getItem('announcements') || '[]');
    
    // Check if there are new announcements
    const hasNewAnnouncements = savedAnnouncements.length > previousAnnouncementCount;
    previousAnnouncementCount = savedAnnouncements.length;
    
    // Clear existing announcements
    announcements = {
        weighIn: [],
        matchCall: [],
        awards: [],
        general: []
    };
    
    // Sort and categorize announcements
    savedAnnouncements.forEach(announcement => {
        const announcementItem = {
            time: announcement.time,
            message: announcement.text,
            timestamp: announcement.timestamp
        };
        
        switch(announcement.type) {
            case 'weigh-in':
                announcementItem.urgent = true;
                announcements.weighIn.push(announcementItem);
                break;
            case 'match-call':
                announcementItem.mat = 'マットA'; // Default mat, can be enhanced
                announcements.matchCall.push(announcementItem);
                break;
            case 'awards':
                announcementItem.category = '表彰式';
                announcements.awards.push(announcementItem);
                break;
            case 'general':
            default:
                announcementItem.type = 'info';
                announcements.general.push(announcementItem);
                break;
        }
    });
    
    displayAnnouncements();
    
    // Play audio for the newest announcement if there's a new one
    if (hasNewAnnouncements && savedAnnouncements.length > 0) {
        const newestAnnouncement = savedAnnouncements[0];
        playAnnouncement(newestAnnouncement.text);
    }
}

// Display announcements
function displayAnnouncements() {
    // Weigh-in
    displayAnnouncementList('weigh-in-list', announcements.weighIn, (item) => `
        <div class="announcement-item ${item.urgent ? 'urgent' : ''}">
            <span class="time">${item.time}</span>
            <span class="category">${item.category}</span>
            <span class="message">${item.message}</span>
        </div>
    `);
    
    // Match calls
    displayAnnouncementList('match-call-list', announcements.matchCall, (item) => `
        <div class="announcement-item">
            <span class="time">${item.time}</span>
            <span class="mat">${item.mat}</span>
            <span class="message">${item.message}</span>
        </div>
    `);
    
    // Awards
    displayAnnouncementList('awards-list', announcements.awards, (item) => `
        <div class="announcement-item">
            <span class="time">${item.time}</span>
            <span class="category">${item.category}</span>
            <span class="message">${item.message}</span>
        </div>
    `);
    
    // General
    displayAnnouncementList('general-list', announcements.general, (item) => `
        <div class="announcement-item ${item.type || ''}">
            <span class="time">${item.time}</span>
            <span class="message">${item.message}</span>
        </div>
    `);
}

// Helper function to display announcement list
function displayAnnouncementList(elementId, items, template) {
    const element = document.getElementById(elementId);
    if (items.length === 0) {
        element.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">現在アナウンスはありません</p>';
    } else {
        element.innerHTML = items.map(template).join('');
    }
}

// Audio announcement
function playAnnouncement(text) {
    if (!audioEnabled || !('speechSynthesis' in window)) return;
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    utterance.volume = audioVolume;
    utterance.rate = 0.9;
    
    speechSynthesis.speak(utterance);
}

// Auto refresh
let refreshInterval;

function startAutoRefresh() {
    refreshInterval = setInterval(() => {
        if (document.getElementById('auto-refresh').checked) {
            loadMatchProgress(); // Update match progress
            loadAnnouncements();
        }
    }, 30000); // 30 seconds
}

function stopAutoRefresh() {
    if (refreshInterval) {
        clearInterval(refreshInterval);
    }
}

// Load and display match progress
function loadMatchProgress() {
    // Get current match from localStorage (set by admin panel)
    const currentMatch = parseInt(localStorage.getItem('currentMatch') || '1');
    const totalMatches = 18;
    
    // Match details (same as admin panel)
    const matches = [
        '待機中',
        // 個人戦 (Super Yawara Cup)
        '巨人なるガラ vs ドクターオーパスワンやなちゃん',
        'Yawaraのヤングボーイぬっきー vs 焼肉古今の司令塔ばばちゃん',
        'HONDAの開発番長コウシ vs 華麗なる新人鈴木',
        '体幹お兄さん直人 vs インテリジェンステイクダウンリュウヒ',
        'いにしえのドリーマー宮本 vs 練習２ポケ本番キングスタッキー',
        'シーシャボーイつくね vs 小島家のイケメン長男ケイタ',
        'Yawaraのジローラモ古庫 vs 浪速のキムラロックシャイボーイ野田',
        'スマイリー岡島 vs マナウスのくちばしアームロック',
        'タクシー運転手の採用はお任せ！テツ vs インテリジェンステイクダウンリュウヒ',
        // 柔術団体戦
        '関原翔 vs 治療家の破壊王河野',
        '山本歩夢 vs フェニックススイープ白木',
        'ガブリエル vs シーシャ好きの柔道ファイターよしき',
        '千原右京 vs 柔術ポーカーフェイス関',
        '宮澤雄大 vs スピードスター喜一',
        'きんじ vs 慶應出身エリート弁護士メーン上田',
        '羽場内 vs エンジニア黒帯西尾',
        '大竹 vs トゥータイムスチャンピオン野島',
        '原田さん（黒帯）vs 小島家のイケメン次男ユウジ'
    ];
    
    // Update display
    document.getElementById('current-match-number').textContent = currentMatch;
    document.getElementById('current-match-detail').textContent = matches[currentMatch - 1] || '不明';
}

// Simulate new announcement with audio
function simulateNewAnnouncement() {
    const newAnnouncement = {
        time: new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
        mat: 'マットA',
        message: '次の試合の選手は準備をお願いします'
    };
    
    announcements.matchCall.unshift(newAnnouncement);
    displayAnnouncements();
    
    // Play audio announcement
    playAnnouncement(newAnnouncement.message);
}