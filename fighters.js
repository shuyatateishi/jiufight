// Fighter data storage
let fightersData = [];
let filteredFighters = [];

// Load saved data from localStorage on page load
function loadSavedData() {
    const savedData = localStorage.getItem('fightersData');
    if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Merge saved data with default data
        parsedData.forEach(savedFighter => {
            const defaultFighter = fightersData.find(f => f.id === savedFighter.id);
            if (defaultFighter) {
                Object.assign(defaultFighter, savedFighter);
            }
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadFightersData();
    // loadSavedData is called inside loadFightersData to ensure proper data merging
    
    // Check URL parameters for weight filter
    const urlParams = new URLSearchParams(window.location.search);
    const weightParam = urlParams.get('weight');
    if (weightParam) {
        document.getElementById('weight-filter').value = weightParam;
        filterFighters();
    } else {
        displayFighters();
    }
});

// Event listeners
function initializeEventListeners() {
    // Search and filter
    document.getElementById('search-input').addEventListener('input', filterFighters);
    document.getElementById('belt-filter').addEventListener('change', filterFighters);
    document.getElementById('weight-filter').addEventListener('change', filterFighters);
    
    // Add new fighter button
    document.getElementById('add-new-fighter-btn').addEventListener('click', showAddFighterModal);
    
    // Modal close buttons
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });
    
    // Edit form submit
    document.getElementById('edit-form').addEventListener('submit', handleEditSubmit);
    
    // Add fighter form submit
    document.getElementById('add-fighter-form').addEventListener('submit', handleAddFighterSubmit);
    
    // Cancel buttons
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}

// Load fighters data
function loadFightersData() {
    // 既存の選手データ + 第2回大会新選手データを読み込み
    fightersData = [
        // 第2回大会 個人戦出場者
        {
            id: 101,
            name: '巨人なるガラ',
            nickname: '巨人なるガラ',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 102,
            name: 'ドクターオーパスワンやなちゃん',
            nickname: 'ドクターオーパスワンやなちゃん',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 103,
            name: 'Yawaraのヤングボーイぬっきー',
            nickname: 'Yawaraのヤングボーイぬっきー',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 104,
            name: '焼肉古今の司令塔ばばちゃん',
            nickname: '焼肉古今の司令塔ばばちゃん',
            belt: 'white',
            weight: 'rooster',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。焼肉店「古今」を経営する柔術家。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 105,
            name: 'HONDAの開発番長コウシ',
            nickname: 'HONDAの開発番長コウシ',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。ホンダで開発業務に従事。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 106,
            name: '華麗なる新人鈴木',
            nickname: '華麗なる新人鈴木',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。華麗な技で魅せる新人ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 107,
            name: '体幹お兄さん直人',
            nickname: '体幹お兄さん直人',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。体幹トレーニングのエキスパート。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 108,
            name: 'インテリジェンステイクダウンリュウヒ',
            nickname: 'インテリジェンステイクダウンリュウヒ',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。知的なテイクダウンが得意。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 109,
            name: '練習２ポケ本番キングスタッキー',
            nickname: '練習２ポケ本番キングスタッキー',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。本番で力を発揮するタイプ。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 110,
            name: '小島家のイケメン長男ケイタ',
            nickname: '小島家のイケメン長男ケイタ',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。小島家の長男。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 111,
            name: 'Yawaraのジローラモ古庫',
            nickname: 'Yawaraのジローラモ古庫',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 112,
            name: '浪速のキムラロックシャイボーイ野田',
            nickname: '浪速のキムラロックシャイボーイ野田',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。大阪出身のキムラロック使い。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 113,
            name: 'マナウスのくちばしアームロック',
            nickname: 'マナウスのくちばしアームロック',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。独特なアームロックが得意。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 114,
            name: 'タクシー運転手の採用はお任せ！テツ',
            nickname: 'タクシー運転手の採用はお任せ！テツ',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'Super Yawara Cup 個人戦出場者。タクシー会社で採用業務を担当。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // 第2回大会 柔術団体戦出場者
        {
            id: 201,
            name: '関原翔',
            nickname: '関原翔',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 202,
            name: '治療家の破壊王河野',
            nickname: '治療家の破壊王河野',
            belt: 'purple',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。普段は治療家として活動。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 203,
            name: '山本歩夢',
            nickname: '山本歩夢',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 204,
            name: 'フェニックススイープ白木',
            nickname: 'フェニックススイープ白木',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。フェニックススイープが得意技。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 205,
            name: 'ガブリエル',
            nickname: 'ガブリエル',
            belt: 'brown',
            weight: 'middle',
            dojo: 'FHR',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。FHR所属の茶帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 206,
            name: 'シーシャ好きの柔道ファイターよしき',
            nickname: 'シーシャ好きの柔道ファイターよしき',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。柔道出身でシーシャが趣味。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 207,
            name: '千原右京',
            nickname: '千原右京',
            belt: 'purple',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 208,
            name: '柔術ポーカーフェイス関',
            nickname: '柔術ポーカーフェイス関',
            belt: 'blue',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。ポーカーフェイスが持ち味。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 209,
            name: '宮澤雄大',
            nickname: '宮澤雄大',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 210,
            name: 'スピードスター喜一',
            nickname: 'スピードスター喜一',
            belt: 'purple',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。スピード勝負が得意。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 211,
            name: 'きんじ',
            nickname: 'きんじ',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 212,
            name: '慶應出身エリート弁護士メーン上田',
            nickname: '慶應出身エリート弁護士メーン上田',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。慶應義塾大学出身の弁護士。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 213,
            name: '羽場内',
            nickname: '羽場内',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 214,
            name: 'エンジニア黒帯西尾',
            nickname: 'エンジニア黒帯西尾',
            belt: 'black',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。エンジニアとして働く黒帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 215,
            name: '大竹',
            nickname: '大竹',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 216,
            name: 'トゥータイムスチャンピオン野島',
            nickname: 'トゥータイムスチャンピオン野島',
            belt: 'purple',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。2度のチャンピオン経験を持つ。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 217,
            name: '原田さん（黒帯）',
            nickname: '原田さん（黒帯）',
            belt: 'black',
            weight: 'light',
            dojo: 'FHR',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。FHR所属の黒帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 218,
            name: '小島家のイケメン次男ユウジ',
            nickname: '小島家のイケメン次男ユウジ',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: '柔術団体戦出場者。小島家の次男。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // 新規追加選手データ
        {
            id: 301,
            name: '後藤 芳輝',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 302,
            name: '杉浦 悠斗',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 303,
            name: '佐々木 彦太',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 304,
            name: '鈴木 洸次郎',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 305,
            name: '岡部 穂孝',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 306,
            name: '野田 斉',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 307,
            name: '中川 翔太',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 308,
            name: 'ピリキート大橋',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // 既存選手データ（第1回大会等）
        // ミディアムヘビー級
        {
            id: 1,
            name: '三木 善靖',
            nickname: '',
            belt: 'purple',
            weight: 'medium-heavy',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ミディアムヘビー級1位の紫帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: [],
            image: 'images/fighters/LINE_ALBUM_対戦カード_250606_1.jpg'
        },
        {
            id: 2,
            name: '佐藤 篤史',
            nickname: '',
            belt: 'blue',
            weight: 'medium-heavy',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ミディアムヘビー級2位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 3,
            name: '宮本 博之',
            nickname: 'いにしえのドリーマー宮本',
            belt: 'blue',
            weight: 'medium-heavy',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ミディアムヘビー級3位。ニックネームの通り、夢を追い続けるファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // ミドル級
        {
            id: 4,
            name: 'Hideki Da Silva',
            nickname: 'Hi',
            belt: 'brown',
            weight: 'middle',
            dojo: 'FHR',
            wins: 0,
            losses: 0,
            bio: 'ミドル級1位のFHR所属茶帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 5,
            name: 'サコ',
            nickname: '',
            belt: 'blue',
            weight: 'middle',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ミドル級2位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 6,
            name: '岩月 穂波',
            nickname: '',
            belt: 'white',
            weight: 'middle',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ミドル級3位の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 7,
            name: '中路 拓也',
            nickname: '',
            belt: 'white',
            weight: 'middle',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ミドル級4位の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 8,
            name: '井柳 俊紀',
            nickname: '',
            belt: 'white',
            weight: 'middle',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ミドル級5位の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // ライト級
        {
            id: 9,
            name: '松木 フェルナンド',
            nickname: '',
            belt: 'black',
            weight: 'light',
            dojo: 'FHR',
            wins: 0,
            losses: 0,
            bio: 'ライト級1位の黒帯チャンピオン。⭐️マーク付きの実力者。',
            achievements: '⭐️チャンピオン',
            style: '-',
            matchHistory: [],
            image: 'images/fighters/LINE_ALBUM_対戦カード_250606_9.jpg'
        },
        {
            id: 10,
            name: '原田 大樹',
            nickname: '',
            belt: 'black',
            weight: 'light',
            dojo: 'FHR',
            wins: 0,
            losses: 0,
            bio: 'ライト級2位のFHR所属黒帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 11,
            name: '田邊 大吾',
            nickname: '',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級3位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 12,
            name: 'kentaroh Awata',
            nickname: '',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級4位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 13,
            name: '岡島 悠裕',
            nickname: 'スマイリー岡島',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級5位。いつも笑顔のスマイリー岡島。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 14,
            name: '大山 裕輔',
            nickname: '',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 15,
            name: '金山 延弘',
            nickname: '',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 16,
            name: 'つくね',
            nickname: 'シーシャボーイつくね',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'シーシャ愛好家として知られる白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 17,
            name: '菅野 流飛',
            nickname: '',
            belt: 'white',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 18,
            name: '齋藤 誠',
            nickname: '',
            belt: 'blue',
            weight: 'light',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライト級の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // フェザー級
        {
            id: 19,
            name: 'Leander De Souza',
            nickname: 'Le',
            belt: 'purple',
            weight: 'feather',
            dojo: 'FHR',
            wins: 0,
            losses: 0,
            bio: 'フェザー級1位のFHR所属紫帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 20,
            name: '河野 裕也',
            nickname: '',
            belt: 'purple',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'フェザー級2位の紫帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 21,
            name: '中西 亮介',
            nickname: '',
            belt: 'blue',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'フェザー級3位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 22,
            name: '秋山 紳右衛門',
            nickname: '',
            belt: 'blue',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'フェザー級4位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 23,
            name: '武田 好史',
            nickname: '',
            belt: 'white',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'フェザー級5位の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 24,
            name: '上村 智大',
            nickname: '',
            belt: 'white',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'フェザー級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 25,
            name: '久家 慎一郎',
            nickname: '',
            belt: 'white',
            weight: 'feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'フェザー級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // ライトフェザー級
        {
            id: 26,
            name: '野島 繁昭',
            nickname: '',
            belt: 'purple',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級1位の紫帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 27,
            name: '渡辺 晋',
            nickname: '',
            belt: 'blue',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級2位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 28,
            name: '西尾 健斗',
            nickname: '',
            belt: 'blue',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級3位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 29,
            name: 'シンヤ',
            nickname: '',
            belt: 'purple',
            weight: 'light-feather',
            dojo: 'FHR',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級4位のFHR所属紫帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 30,
            name: '公文 卓馬',
            nickname: '',
            belt: 'purple',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級5位の紫帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 31,
            name: '工藤 広樹',
            nickname: '',
            belt: 'blue',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 32,
            name: '武田 喜一',
            nickname: '',
            belt: 'blue',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 33,
            name: 'さしみ',
            nickname: '',
            belt: 'purple',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級の紫帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 34,
            name: '岩瀬 誠',
            nickname: '',
            belt: 'white',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 35,
            name: '飯田 修三',
            nickname: '',
            belt: 'white',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 36,
            name: '濱田 優貴',
            nickname: '',
            belt: 'blue',
            weight: 'light-feather',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ライトフェザー級の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        // ルースター級
        {
            id: 37,
            name: '永塚 和寛',
            nickname: '永塚',
            belt: 'blue',
            weight: 'rooster',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ルースター級1位の青帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 38,
            name: '綿貫 智也',
            nickname: '綿貫',
            belt: 'white',
            weight: 'rooster',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ルースター級2位の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 39,
            name: '小野 太暉',
            nickname: '',
            belt: 'white',
            weight: 'rooster',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ルースター級3位の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 40,
            name: '馬場 祐次',
            nickname: '焼肉古今の司令塔ばばちゃん',
            belt: 'white',
            weight: 'rooster',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ルースター級4位。焼肉店「古今」を経営する柔術家。',
            achievements: '-',
            style: '-',
            matchHistory: []
        },
        {
            id: 41,
            name: '松下 ともゆき',
            nickname: '松下',
            belt: 'white',
            weight: 'rooster',
            dojo: 'YAWARA柔術アカデミー',
            wins: 0,
            losses: 0,
            bio: 'ルースター級5位の白帯ファイター。',
            achievements: '-',
            style: '-',
            matchHistory: []
        }
    ];
    
    // Load saved data after initial data is loaded
    loadSavedData();
    
    filteredFighters = [...fightersData];
}

// Display fighters
function displayFighters() {
    const grid = document.getElementById('fighters-grid');
    
    if (filteredFighters.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #999;">該当する選手が見つかりません</p>';
        return;
    }
    
    grid.innerHTML = filteredFighters.map(fighter => `
        <div class="fighter-card" onclick="showFighterProfile(${fighter.id})">
            <div class="fighter-image"></div>
            <div class="fighter-info">
                <h3 class="fighter-name">${fighter.nickname || fighter.fullName || fighter.name}</h3>
                ${fighter.nickname ? `<p class="fighter-real-name">${fighter.fullName || fighter.name}</p>` : ''}
                <div class="fighter-belt-badge">
                    <span class="belt-indicator belt-${fighter.belt}">${getBeltName(fighter.belt)}</span>
                </div>
                <div class="fighter-weight">${getWeightClassName(fighter.weight)}級</div>
                <div class="fighter-dojo">${fighter.dojo}</div>
                <div class="fighter-record">
                    <span class="wins">${fighter.wins}勝</span> / 
                    <span class="losses">${fighter.losses}敗</span>
                </div>
                <div class="win-rate">勝率: ${calculateWinRate(fighter.wins, fighter.losses)}%</div>
            </div>
        </div>
    `).join('');
}

// Filter fighters
function filterFighters() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const beltFilter = document.getElementById('belt-filter').value;
    const weightFilter = document.getElementById('weight-filter').value;
    
    filteredFighters = fightersData.filter(fighter => {
        const matchesSearch = fighter.name.toLowerCase().includes(searchTerm) || 
                            (fighter.nickname && fighter.nickname.toLowerCase().includes(searchTerm)) ||
                            (fighter.fullName && fighter.fullName.toLowerCase().includes(searchTerm)) ||
                            fighter.dojo.toLowerCase().includes(searchTerm);
        const matchesBelt = !beltFilter || fighter.belt === beltFilter;
        const matchesWeight = !weightFilter || fighter.weight === weightFilter;
        
        return matchesSearch && matchesBelt && matchesWeight;
    });
    
    displayFighters();
}

// Show fighter profile
function showFighterProfile(fighterId) {
    const fighter = fightersData.find(f => f.id === fighterId);
    if (!fighter) return;
    
    const profileHtml = `
        <div class="fighter-profile">
            <div class="profile-image">
                ${fighter.image ? 
                    `<img src="${fighter.image}" alt="${fighter.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` : 
                    (fighter.nickname || fighter.name).charAt(0)
                }
            </div>
            <h2 class="profile-name">${fighter.nickname || fighter.name}</h2>
            ${fighter.nickname ? `<p class="profile-real-name">${fighter.name}</p>` : ''}
            <div class="profile-details">
                <span class="fighter-belt belt-${fighter.belt}">${getBeltName(fighter.belt)}</span>
                <span> | ${getWeightClassName(fighter.weight)}級</span>
            </div>
            
            <div class="profile-info">
                <div class="info-item">
                    <strong>本名:</strong> <span>${fighter.fullName || fighter.name}</span>
                </div>
                <div class="info-item">
                    <strong>リングネーム:</strong> <span>${fighter.nickname || '未設定'}</span>
                </div>
                <div class="info-item">
                    <strong>年齢:</strong> <span>${fighter.age || '未公開'}</span>
                </div>
                <div class="info-item">
                    <strong>職業:</strong> <span>${fighter.occupation || '未公開'}</span>
                </div>
                <div class="info-item">
                    <strong>出身地/居住地:</strong> <span>${fighter.location || '未公開'}</span>
                </div>
                <div class="info-item">
                    <strong>柔術歴:</strong> <span>${fighter.experience || '未公開'}</span>
                </div>
                <div class="info-item">
                    <strong>得意技:</strong> <span>${fighter.specialty || '未公開'}</span>
                </div>
                <div class="info-item">
                    <strong>自分の特徴:</strong> <span>${fighter.characteristic || '未公開'}</span>
                </div>
                <div class="info-item">
                    <strong>意気込み:</strong> <span>${fighter.motivation || '未公開'}</span>
                </div>
            </div>
            
            <button class="edit-btn" onclick="showEditForm(${fighter.id})">プロフィールを編集</button>
        </div>
    `;
    
    document.getElementById('fighter-profile').innerHTML = profileHtml;
    document.getElementById('fighter-modal').style.display = 'block';
}

// Show edit form
function showEditForm(fighterId) {
    const fighter = fightersData.find(f => f.id === fighterId);
    if (!fighter) return;
    
    document.getElementById('fighter-modal').style.display = 'none';
    document.getElementById('edit-modal').style.display = 'block';
    
    // Populate form
    document.getElementById('edit-fighter-id').value = fighter.id;
    document.getElementById('edit-full-name').value = fighter.fullName || fighter.name;
    document.getElementById('edit-nickname').value = fighter.nickname || '';
    document.getElementById('edit-age').value = fighter.age || '';
    document.getElementById('edit-occupation').value = fighter.occupation || '';
    document.getElementById('edit-location').value = fighter.location || '';
    document.getElementById('edit-experience').value = fighter.experience || '';
    document.getElementById('edit-specialty').value = fighter.specialty || '';
    document.getElementById('edit-characteristic').value = fighter.characteristic || '';
    document.getElementById('edit-motivation').value = fighter.motivation || '';
}

// Handle edit form submission
function handleEditSubmit(e) {
    e.preventDefault();
    
    const fighterId = parseInt(document.getElementById('edit-fighter-id').value);
    const fighter = fightersData.find(f => f.id === fighterId);
    
    if (!fighter) return;
    
    // Update fighter data
    const updatedFullName = document.getElementById('edit-full-name').value;
    const updatedNickname = document.getElementById('edit-nickname').value;
    
    fighter.fullName = updatedFullName;
    fighter.nickname = updatedNickname;
    fighter.age = document.getElementById('edit-age').value;
    fighter.occupation = document.getElementById('edit-occupation').value;
    fighter.location = document.getElementById('edit-location').value;
    fighter.experience = document.getElementById('edit-experience').value;
    fighter.specialty = document.getElementById('edit-specialty').value;
    fighter.characteristic = document.getElementById('edit-characteristic').value;
    fighter.motivation = document.getElementById('edit-motivation').value;
    
    // Update name if fullName was changed
    if (updatedFullName && !fighter.name.includes('（')) {
        fighter.name = updatedFullName;
    }
    
    // Save to database with real-time sync
    if (window.databaseSync) {
        window.databaseSync.updateFighters(fightersData);
    } else {
        localStorage.setItem('fightersData', JSON.stringify(fightersData));
    }
    
    // Close modal and refresh display
    document.getElementById('edit-modal').style.display = 'none';
    displayFighters();
    
    // Show success message
    alert('プロフィールが更新されました！');
    
    // Show updated profile
    showFighterProfile(fighterId);
}

// Helper functions
function getBeltName(belt) {
    const beltNames = {
        white: '白帯',
        blue: '青帯',
        purple: '紫帯',
        brown: '茶帯',
        black: '黒帯'
    };
    return beltNames[belt] || belt;
}

function getWeightClassName(weight) {
    const weightClassNames = {
        'rooster': 'ルースター',
        'light-feather': 'ライトフェザー',
        'feather': 'フェザー',
        'light': 'ライト',
        'middle': 'ミドル',
        'medium-heavy': 'ミディアムヘビー'
    };
    return weightClassNames[weight] || weight;
}

function calculateWinRate(wins, losses) {
    const total = wins + losses;
    if (total === 0) return 0;
    return Math.round((wins / total) * 100);
}

// Show add fighter modal
function showAddFighterModal() {
    document.getElementById('add-fighter-modal').style.display = 'block';
    
    // Clear form
    document.getElementById('add-fighter-form').reset();
}

// Handle add fighter form submission
function handleAddFighterSubmit(e) {
    e.preventDefault();
    
    // Get form values
    const fullName = document.getElementById('new-full-name').value.trim();
    const nickname = document.getElementById('new-nickname').value.trim();
    const belt = document.getElementById('new-belt').value;
    const weight = document.getElementById('new-weight').value;
    const dojo = document.getElementById('new-dojo').value.trim();
    const age = document.getElementById('new-age').value;
    const bio = document.getElementById('new-bio').value.trim();
    
    // Validate required fields
    if (!fullName || !belt || !weight || !dojo) {
        alert('必須項目を入力してください。');
        return;
    }
    
    // Generate new ID
    const maxId = Math.max(...fightersData.map(f => f.id), 0);
    const newId = maxId + 1;
    
    // Create new fighter object
    const newFighter = {
        id: newId,
        name: fullName,
        nickname: nickname || '',
        belt: belt,
        weight: weight,
        dojo: dojo,
        wins: 0,
        losses: 0,
        bio: bio || `${fullName}選手のプロフィール`,
        fullName: fullName,
        age: age || '',
        occupation: '',
        location: '',
        experience: '',
        specialty: '',
        characteristic: '',
        motivation: '',
        achievements: '-',
        style: '-',
        image: null,
        matchHistory: []
    };
    
    // Add to fighters data
    fightersData.push(newFighter);
    
    // Save to database with real-time sync
    if (window.databaseSync) {
        window.databaseSync.updateFighters(fightersData);
        console.log(`✅ New fighter ${fullName} added and synced to database`);
    } else {
        localStorage.setItem('fightersData', JSON.stringify(fightersData));
    }
    
    // Close modal and refresh display
    document.getElementById('add-fighter-modal').style.display = 'none';
    displayFighters();
    
    // Show success message
    alert(`新規選手「${fullName}」を登録しました！`);
}