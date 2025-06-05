// Tournament fighters profile system
document.addEventListener('DOMContentLoaded', () => {
    initializeTournamentFighters();
});

// Fighter data for tournament participants
const tournamentFighters = {
    // Individual tournament fighters
    '巨人なるガラ': { id: 101, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'ドクターオーパスワンやなちゃん': { id: 102, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'Yawaraのヤングボーイぬっきー': { id: 103, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '焼肉古今の司令塔ばばちゃん': { id: 104, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'HONDAの開発番長コウシ': { id: 105, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '華麗なる新人鈴木': { id: 106, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '体幹お兄さん直人': { id: 107, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'インテリジェンステイクダウンリュウヒ': { id: 108, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'いにしえのドリーマー宮本': { id: 3, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '練習２ポケ本番キングスタッキー': { id: 109, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'シーシャボーイつくね': { id: 16, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '小島家のイケメン長男ケイタ': { id: 110, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'Yawaraのジローラモ古庫': { id: 111, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '浪速のキムラロックシャイボーイ野田': { id: 112, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'スマイリー岡島': { id: 13, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'マナウスのくちばしアームロック': { id: 113, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'タクシー運転手の採用はお任せ！テツ': { id: 114, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    
    // Team tournament fighters  
    '関原翔': { id: 201, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '治療家の破壊王河野': { id: 202, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '山本歩夢': { id: 203, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'フェニックススイープ白木': { id: 204, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'ガブリエル': { id: 205, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'シーシャ好きの柔道ファイターよしき': { id: 206, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '千原右京': { id: 207, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '柔術ポーカーフェイス関': { id: 208, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '宮澤雄大': { id: 209, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'スピードスター喜一': { id: 210, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'きんじ': { id: 211, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '慶應出身エリート弁護士メーン上田': { id: 212, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '羽場内': { id: 213, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'エンジニア黒帯西尾': { id: 214, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '大竹': { id: 215, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    'トゥータイムスチャンピオン野島': { id: 216, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '原田さん（黒帯）': { id: 217, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' },
    '小島家のイケメン次男ユウジ': { id: 218, fullName: '', age: '', occupation: '', location: '', experience: '', specialty: '', characteristic: '', motivation: '' }
};

function initializeTournamentFighters() {
    // Load saved data from localStorage
    loadSavedProfiles();
    
    // Add click event listeners to all fighter names
    const fighterNames = document.querySelectorAll('.fighter-name');
    fighterNames.forEach(nameElement => {
        nameElement.style.cursor = 'pointer';
        nameElement.style.color = '#C41E3A';
        nameElement.style.textDecoration = 'underline';
        
        nameElement.addEventListener('click', (e) => {
            const fighterName = e.target.textContent.trim();
            if (tournamentFighters[fighterName]) {
                showFighterProfile(fighterName);
            }
        });
    });
    
    // Create modal HTML if it doesn't exist
    createModalHTML();
}

function loadSavedProfiles() {
    // Load from unified fightersData storage
    const savedFighters = localStorage.getItem('fightersData');
    if (savedFighters) {
        const fightersArray = JSON.parse(savedFighters);
        
        // Update tournament fighters with saved data
        Object.keys(tournamentFighters).forEach(fighterName => {
            const fighterId = tournamentFighters[fighterName].id;
            const savedFighter = fightersArray.find(f => f.id === fighterId);
            
            if (savedFighter) {
                // Copy all profile fields from saved data
                tournamentFighters[fighterName].fullName = savedFighter.fullName || '';
                tournamentFighters[fighterName].age = savedFighter.age || '';
                tournamentFighters[fighterName].occupation = savedFighter.occupation || '';
                tournamentFighters[fighterName].location = savedFighter.location || '';
                tournamentFighters[fighterName].experience = savedFighter.experience || '';
                tournamentFighters[fighterName].specialty = savedFighter.specialty || '';
                tournamentFighters[fighterName].characteristic = savedFighter.characteristic || '';
                tournamentFighters[fighterName].motivation = savedFighter.motivation || '';
            }
        });
    }
}

function saveProfile(fighterName, profileData) {
    // Update fightersData in localStorage to sync with fighters.js
    const savedFighters = JSON.parse(localStorage.getItem('fightersData') || '[]');
    const fighterId = tournamentFighters[fighterName].id;
    
    // Find or create fighter entry
    let fighterIndex = savedFighters.findIndex(f => f.id === fighterId);
    
    if (fighterIndex === -1) {
        // Create new entry if not found
        savedFighters.push({
            id: fighterId,
            name: fighterName,
            nickname: fighterName,
            ...profileData
        });
    } else {
        // Update existing entry
        Object.assign(savedFighters[fighterIndex], profileData);
    }
    
    // Save to unified storage
    localStorage.setItem('fightersData', JSON.stringify(savedFighters));
    
    // Also update the tournamentFighters object
    if (tournamentFighters[fighterName]) {
        Object.assign(tournamentFighters[fighterName], profileData);
    }
}

function showFighterProfile(fighterName) {
    // Reload latest data before showing
    loadSavedProfiles();
    
    const fighter = tournamentFighters[fighterName];
    if (!fighter) return;
    
    const modal = document.getElementById('tournament-fighter-modal');
    const profileContent = document.getElementById('tournament-fighter-profile');
    
    profileContent.innerHTML = `
        <div class="fighter-profile">
            <h2 class="profile-name">${fighterName}</h2>
            <div class="profile-info">
                <div class="info-item">
                    <strong>本名:</strong> <span>${fighter.fullName || '未設定'}</span>
                </div>
                <div class="info-item">
                    <strong>リングネーム:</strong> <span>${fighterName}</span>
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
            <button class="edit-btn" onclick="showEditForm('${fighterName}')">プロフィールを編集</button>
        </div>
    `;
    
    modal.style.display = 'block';
}

function showEditForm(fighterName) {
    const fighter = tournamentFighters[fighterName];
    if (!fighter) return;
    
    const modal = document.getElementById('tournament-fighter-modal');
    const editModal = document.getElementById('tournament-edit-modal');
    
    modal.style.display = 'none';
    editModal.style.display = 'block';
    
    // Populate form
    document.getElementById('edit-fighter-name').value = fighterName;
    document.getElementById('edit-full-name').value = fighter.fullName || '';
    document.getElementById('edit-age').value = fighter.age || '';
    document.getElementById('edit-occupation').value = fighter.occupation || '';
    document.getElementById('edit-location').value = fighter.location || '';
    document.getElementById('edit-experience').value = fighter.experience || '';
    document.getElementById('edit-specialty').value = fighter.specialty || '';
    document.getElementById('edit-characteristic').value = fighter.characteristic || '';
    document.getElementById('edit-motivation').value = fighter.motivation || '';
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const fighterName = document.getElementById('edit-fighter-name').value;
    const profileData = {
        fullName: document.getElementById('edit-full-name').value,
        age: document.getElementById('edit-age').value,
        occupation: document.getElementById('edit-occupation').value,
        location: document.getElementById('edit-location').value,
        experience: document.getElementById('edit-experience').value,
        specialty: document.getElementById('edit-specialty').value,
        characteristic: document.getElementById('edit-characteristic').value,
        motivation: document.getElementById('edit-motivation').value
    };
    
    saveProfile(fighterName, profileData);
    
    // Close modal and show success message
    document.getElementById('tournament-edit-modal').style.display = 'none';
    alert('プロフィールが更新されました！');
    
    // Show updated profile
    showFighterProfile(fighterName);
}

function createModalHTML() {
    // Check if modals already exist
    if (document.getElementById('tournament-fighter-modal')) return;
    
    const modalHTML = `
        <!-- Fighter Profile Modal -->
        <div id="tournament-fighter-modal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeTournamentModal('tournament-fighter-modal')">&times;</span>
                <div id="tournament-fighter-profile">
                    <!-- Profile content will be loaded here -->
                </div>
            </div>
        </div>

        <!-- Edit Profile Modal -->
        <div id="tournament-edit-modal" class="modal">
            <div class="modal-content">
                <span class="close" onclick="closeTournamentModal('tournament-edit-modal')">&times;</span>
                <h2>プロフィール編集</h2>
                <form id="tournament-edit-form" onsubmit="handleEditSubmit(event)">
                    <input type="hidden" id="edit-fighter-name">
                    
                    <div class="form-group">
                        <label for="edit-full-name">本名（フルネーム）</label>
                        <input type="text" id="edit-full-name">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-age">年齢（任意）</label>
                        <input type="number" id="edit-age" min="1" max="100">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-occupation">職業（任意）</label>
                        <input type="text" id="edit-occupation" placeholder="例: 営業マン、学生、エンジニアなど">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-location">出身地 or 現在の居住地</label>
                        <input type="text" id="edit-location" placeholder="例: 東京都、神奈川県横浜市など">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-experience">柔術歴 or 総合格闘技歴</label>
                        <input type="text" id="edit-experience" placeholder="例: 柔術歴3年、MMA2年など">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-specialty">得意技・スタイル</label>
                        <input type="text" id="edit-specialty" placeholder="例: ガードワーク、パスガード、レッグロックなど">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-characteristic">自分の特徴を一言で！</label>
                        <input type="text" id="edit-characteristic" placeholder="例: 普段は営業マン、いつもニコニコしてます">
                    </div>
                    
                    <div class="form-group">
                        <label for="edit-motivation">今回の試合に向けての意気込み（アナウンスで読み上げ可）</label>
                        <textarea id="edit-motivation" rows="3" placeholder="例: 家族の前で勝ちたい！、肉が欲しいです！"></textarea>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="submit" class="save-btn">保存</button>
                        <button type="button" class="cancel-btn" onclick="closeTournamentModal('tournament-edit-modal')">キャンセル</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add modal styles
    const modalStyles = `
        <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            animation: fadeIn 0.3s;
        }
        
        .modal-content {
            background-color: white;
            margin: 5% auto;
            padding: 2rem;
            border-radius: 10px;
            width: 90%;
            max-width: 600px;
            max-height: 85vh;
            overflow-y: auto;
            position: relative;
            animation: slideIn 0.3s;
        }
        
        .close {
            position: absolute;
            right: 1rem;
            top: 1rem;
            font-size: 2rem;
            font-weight: bold;
            color: #999;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .close:hover {
            color: #333;
        }
        
        .fighter-profile {
            text-align: center;
        }
        
        .profile-name {
            font-size: 2rem;
            margin-bottom: 2rem;
            color: #C41E3A;
        }
        
        .profile-info {
            text-align: left;
            margin: 2rem 0;
        }
        
        .info-item {
            display: flex;
            margin-bottom: 1rem;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .info-item strong {
            min-width: 140px;
            color: #C41E3A;
            font-weight: 600;
        }
        
        .info-item span {
            flex: 1;
            color: #333;
        }
        
        .edit-btn {
            background-color: #C41E3A;
            color: white;
            border: none;
            padding: 10px 25px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
            margin-top: 1rem;
        }
        
        .edit-btn:hover {
            background-color: #a01729;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #333;
        }
        
        .form-group input,
        .form-group textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1rem;
            transition: border-color 0.3s ease;
        }
        
        .form-group input:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: #C41E3A;
        }
        
        .form-buttons {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
        }
        
        .save-btn,
        .cancel-btn {
            padding: 10px 25px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .save-btn {
            background-color: #4CAF50;
            color: white;
        }
        
        .save-btn:hover {
            background-color: #45a049;
        }
        
        .cancel-btn {
            background-color: #999;
            color: white;
        }
        
        .cancel-btn:hover {
            background-color: #777;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideIn {
            from {
                transform: translateY(-50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        @media (max-width: 768px) {
            .modal-content {
                width: 95%;
                margin: 10% auto;
                padding: 1.5rem;
            }
        }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
}

function closeTournamentModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal on outside click
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});