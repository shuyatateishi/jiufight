// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
});

// Weight class tabs functionality
function initWeightClassTabs() {
    const tabs = document.querySelectorAll('.weight-tab');
    if (!tabs.length) return;
    
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Here you would update the ranking table based on the selected weight class
            const weightClass = this.dataset.weight;
            updateRankingTable(weightClass);
        });
    });
}

// Update ranking table based on weight class
function updateRankingTable(weightClass) {
    const tableTitle = document.querySelector('.ranking-table-preview h3');
    if (!tableTitle) return;
    
    const weightClassNames = {
        'rooster': 'ルースター級',
        'light-feather': 'ライトフェザー級',
        'feather': 'フェザー級',
        'light': 'ライト級',
        'middle': 'ミドル級',
        'medium-heavy': 'ミディアムヘビー級'
    };
    
    tableTitle.textContent = `${weightClassNames[weightClass]} - トップ5選手`;
    // Here you would load the actual ranking data for the selected weight class
}

// Countdown timer
function updateCountdown() {
    const tournamentDate = new Date('2025-06-07T09:00:00+09:00');
    const now = new Date();
    const diff = tournamentDate - now;
    
    if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const daysCount = document.querySelector('.days-count');
        if (daysCount) {
            daysCount.textContent = `あと${days}日！`;
        }
    }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Add hover effects to cards
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.feature-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Initialize on page load (consolidated)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll);
} else {
    initializeAll();
}

function initializeAll() {
    // Initialize weight class tabs
    initWeightClassTabs();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize card hover effects
    initCardHoverEffects();
    
    // Update countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
}