// Rankings data
let rankingsData = {
    overall: [],
    submission: [],
    points: [],
    winstreak: []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    loadRankingsData();
    renderCharts();
});

// Event listeners
function initializeEventListeners() {
    // Mobile menu
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const category = this.dataset.category;
            updateRankingDisplay(category);
        });
    });
}

// Load rankings data (simulated - replace with API call)
function loadRankingsData() {
    rankingsData = {
        overall: [
            { id: 1, name: '山田太郎', belt: 'blue', weight: '-70', wins: 15, losses: 3, points: 92, trend: 'up', change: 2 },
            { id: 2, name: '佐藤次郎', belt: 'blue', weight: '-70', wins: 12, losses: 5, points: 85, trend: 'same', change: 0 },
            { id: 3, name: '鈴木三郎', belt: 'purple', weight: '-85', wins: 20, losses: 8, points: 78, trend: 'down', change: -1 },
            { id: 4, name: '高橋五郎', belt: 'brown', weight: '-100', wins: 30, losses: 10, points: 75, trend: 'up', change: 3 },
            { id: 5, name: '田中花子', belt: 'white', weight: '-60', wins: 5, losses: 2, points: 68, trend: 'up', change: 5 },
            { id: 6, name: '伊藤六郎', belt: 'blue', weight: '-85', wins: 10, losses: 8, points: 62, trend: 'down', change: -2 },
            { id: 7, name: '渡辺七美', belt: 'purple', weight: '-60', wins: 18, losses: 10, points: 58, trend: 'same', change: 0 },
            { id: 8, name: '木村八郎', belt: 'white', weight: '-70', wins: 3, losses: 4, points: 45, trend: 'up', change: 1 }
        ],
        submission: [
            { id: 1, name: '鈴木三郎', submissions: 15, submissionRate: '75%' },
            { id: 2, name: '山田太郎', submissions: 12, submissionRate: '80%' },
            { id: 3, name: '高橋五郎', submissions: 10, submissionRate: '33%' }
        ],
        points: [
            { id: 1, name: '佐藤次郎', avgPoints: 8.5 },
            { id: 2, name: '山田太郎', avgPoints: 7.2 },
            { id: 3, name: '田中花子', avgPoints: 6.8 }
        ],
        winstreak: [
            { id: 1, name: '田中花子', streak: 5 },
            { id: 2, name: '山田太郎', streak: 4 },
            { id: 3, name: '高橋五郎', streak: 3 }
        ]
    };
    
    // Display initial rankings
    updateRankingDisplay('overall');
}

// Update ranking display
function updateRankingDisplay(category) {
    updatePodium(category);
    updateRankingsTable(category);
}

// Update podium
function updatePodium(category) {
    const data = rankingsData[category];
    const topThree = data.slice(0, 3);
    
    if (category === 'overall') {
        // Update podium spots
        const podiumSpots = document.querySelectorAll('.podium-spot');
        const order = [1, 0, 2]; // Display order: 2nd, 1st, 3rd
        
        order.forEach((dataIndex, displayIndex) => {
            if (topThree[dataIndex]) {
                const spot = podiumSpots[displayIndex];
                const fighter = topThree[dataIndex];
                spot.querySelector('.fighter-name').textContent = fighter.name;
                spot.querySelector('.fighter-stats').textContent = `${fighter.points}ポイント`;
            }
        });
    }
}

// Update rankings table
function updateRankingsTable(category) {
    const tbody = document.getElementById('rankings-tbody');
    const data = rankingsData[category];
    
    if (category === 'overall') {
        tbody.innerHTML = data.map((fighter, index) => `
            <tr>
                <td>
                    <span class="rank-number">${index + 1}</span>
                </td>
                <td>${fighter.name}</td>
                <td>
                    <span class="fighter-belt belt-${fighter.belt}">${getBeltName(fighter.belt)}</span>
                </td>
                <td>${fighter.weight}kg級</td>
                <td>${fighter.wins}勝 ${fighter.losses}敗</td>
                <td>${fighter.points}</td>
                <td>
                    <span class="rank-change rank-${fighter.trend}">
                        ${getTrendIcon(fighter.trend, fighter.change)}
                    </span>
                </td>
            </tr>
        `).join('');
    } else if (category === 'submission') {
        tbody.innerHTML = data.map((fighter, index) => `
            <tr>
                <td>
                    <span class="rank-number">${index + 1}</span>
                </td>
                <td>${fighter.name}</td>
                <td colspan="3">-</td>
                <td>${fighter.submissions} (${fighter.submissionRate})</td>
                <td>-</td>
            </tr>
        `).join('');
    } else if (category === 'points') {
        tbody.innerHTML = data.map((fighter, index) => `
            <tr>
                <td>
                    <span class="rank-number">${index + 1}</span>
                </td>
                <td>${fighter.name}</td>
                <td colspan="3">-</td>
                <td>平均 ${fighter.avgPoints}</td>
                <td>-</td>
            </tr>
        `).join('');
    } else if (category === 'winstreak') {
        tbody.innerHTML = data.map((fighter, index) => `
            <tr>
                <td>
                    <span class="rank-number">${index + 1}</span>
                </td>
                <td>${fighter.name}</td>
                <td colspan="3">-</td>
                <td>${fighter.streak}連勝中</td>
                <td>-</td>
            </tr>
        `).join('');
    }
}

// Render charts
function renderCharts() {
    renderBeltChart();
    renderFinishChart();
    renderTimeChart();
    renderActivityChart();
}

// Belt win rate chart
function renderBeltChart() {
    const container = document.getElementById('belt-chart');
    const data = [
        { belt: '白帯', rate: 71, color: '#f5f5f5' },
        { belt: '青帯', rate: 68, color: '#2196F3' },
        { belt: '紫帯', rate: 64, color: '#9C27B0' },
        { belt: '茶帯', rate: 75, color: '#795548' },
        { belt: '黒帯', rate: 82, color: '#000' }
    ];
    
    container.innerHTML = '<div class="bar-chart">' +
        data.map(item => `
            <div class="bar" style="height: ${item.rate}%; background-color: ${item.color}">
                <span class="bar-value">${item.rate}%</span>
                <span class="bar-label">${item.belt}</span>
            </div>
        `).join('') +
        '</div>';
}

// Finish rate chart
function renderFinishChart() {
    const container = document.getElementById('finish-chart');
    const submissionRate = 45;
    const pointsRate = 55;
    
    container.innerHTML = `
        <div class="pie-chart">
            <div style="text-align: center; padding-top: 60px;">
                <div style="color: var(--primary-color); font-weight: bold;">サブミッション: ${submissionRate}%</div>
                <div style="color: #666; font-weight: bold;">ポイント: ${pointsRate}%</div>
            </div>
        </div>
    `;
}

// Average match time chart
function renderTimeChart() {
    const container = document.getElementById('time-chart');
    const data = [
        { category: '白帯', time: 4.2 },
        { category: '青帯', time: 5.8 },
        { category: '紫帯', time: 6.5 },
        { category: '茶帯', time: 7.2 },
        { category: '黒帯', time: 8.9 }
    ];
    
    const maxTime = Math.max(...data.map(d => d.time));
    
    container.innerHTML = '<div class="bar-chart">' +
        data.map(item => `
            <div class="bar" style="height: ${(item.time / maxTime) * 100}%">
                <span class="bar-value">${item.time}分</span>
                <span class="bar-label">${item.category}</span>
            </div>
        `).join('') +
        '</div>';
}

// Monthly activity chart
function renderActivityChart() {
    const container = document.getElementById('activity-chart');
    const data = [
        { month: '1月', matches: 45 },
        { month: '2月', matches: 52 },
        { month: '3月', matches: 38 },
        { month: '4月', matches: 61 },
        { month: '5月', matches: 55 },
        { month: '6月', matches: 72 }
    ];
    
    const maxMatches = Math.max(...data.map(d => d.matches));
    
    container.innerHTML = '<div class="bar-chart">' +
        data.map(item => `
            <div class="bar" style="height: ${(item.matches / maxMatches) * 100}%">
                <span class="bar-value">${item.matches}</span>
                <span class="bar-label">${item.month}</span>
            </div>
        `).join('') +
        '</div>';
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

function getTrendIcon(trend, change) {
    const icons = {
        up: '▲',
        down: '▼',
        same: '―'
    };
    
    if (trend === 'same') {
        return icons[trend];
    }
    
    return `${icons[trend]} ${Math.abs(change)}`;
}