import { getAuth, getFirestore } from '../firebase/firebase-config.js';
import { formatCoins } from './coins.js';

export function initLeaderboard() {
    const auth = getAuth();
    const db = getFirestore();

    // Modal elements
    const leaderboardModal = document.getElementById('leaderboard-modal');
    const leaderboardBtn = document.getElementById('leaderboard-sp-btn');
    const leaderboardClose = document.querySelector('.leaderboard-close');
    const coinsTab = document.getElementById('coins-tab');
    const streaksTab = document.getElementById('streaks-tab');
    const coinsContent = document.getElementById('coins-leaderboard');
    const streaksContent = document.getElementById('streaks-leaderboard');
    const coinsLeaderboardBody = document.getElementById('coins-leaderboard-body');
    const streaksLeaderboardBody = document.getElementById('streaks-leaderboard-body');

    const sideBar = document.getElementById("mySidebar");
    const sideBarOverlay = document.getElementById("sidePanelOverlay");

    // Comprehensive element validation
    const requiredElements = [
        { element: leaderboardModal, name: 'Leaderboard Modal' },
        { element: leaderboardBtn, name: 'Leaderboard Button' },
        { element: leaderboardClose, name: 'Leaderboard Close Button' },
        { element: coinsTab, name: 'Coins Tab' },
        { element: streaksTab, name: 'Streaks Tab' },
        { element: coinsContent, name: 'Coins Leaderboard Content' },
        { element: streaksContent, name: 'Streaks Leaderboard Content' },
        { element: coinsLeaderboardBody, name: 'Coins Leaderboard Body' },
        { element: streaksLeaderboardBody, name: 'Streaks Leaderboard Body' }
    ];

    // Check for missing elements
    const missingElements = requiredElements.filter(item => !item.element);
    if (missingElements.length > 0) {
        console.error('Missing leaderboard elements:', 
            missingElements.map(item => item.name).join(', '));
        return;
    }

    // Open modal
    leaderboardBtn.addEventListener('click', async () => {
        leaderboardModal.style.opacity = '1';
        leaderboardModal.style.pointerEvents = "auto";
        
        // Optional: sidebar handling (only if elements exist)
        if (sideBar && sideBarOverlay) {
            sideBar.style.transform = "translateX(-100%)";
            sideBar.style.pointerEvents = "none";
            sideBarOverlay.style.display = "none";
        }
        
        // Default to coins tab
        switchTab('coins');
        await fetchLeaderboardData('coins');
    });

    // Close modal
    leaderboardClose.addEventListener('click', () => {
        leaderboardModal.style.opacity = '0';
        leaderboardModal.style.pointerEvents = "none";
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === leaderboardModal) {
            leaderboardModal.style.opacity = '0';
            leaderboardModal.style.pointerEvents = "none";
        }
    });

    // Tab switching
    coinsTab.addEventListener('click', () => switchTab('coins'));
    streaksTab.addEventListener('click', () => switchTab('streaks'));

    function switchTab(tab) {
        if (tab === 'coins') {
            coinsTab.classList.add('active-tab');
            streaksTab.classList.remove('active-tab');
            coinsContent.style.display = 'block';
            streaksContent.style.display = 'none';
            fetchLeaderboardData('coins');
        } else {
            coinsTab.classList.remove('active-tab');
            streaksTab.classList.add('active-tab');
            coinsContent.style.display = 'none';
            streaksContent.style.display = 'block';
            fetchLeaderboardData('dayStreak');
        }
    }

    async function fetchLeaderboardData(type) {
        try {
            // Check if user is authenticated
            const currentUser = auth.currentUser;
            const leaderboardBody = type === 'coins' ? coinsLeaderboardBody : streaksLeaderboardBody;

            if (!currentUser) {
                leaderboardBody.innerHTML = `
                    <tr>
                        <td colspan="4">Please log in to view the leaderboard.</td>
                    </tr>
                `;
                return;
            }

            // Fetch all users sorted by coins or dayStreak in descending order
            const usersRef = db.collection('users');
            const snapshot = await usersRef
                .orderBy(type, 'desc')
                .limit(50) // Limit to top 50 players
                .get();

            // Clear existing entries
            leaderboardBody.innerHTML = '';

            // Check if there are any users
            if (snapshot.empty) {
                leaderboardBody.innerHTML = `
                    <tr>
                        <td colspan="4">No users found.</td>
                    </tr>
                `;
                return;
            }

            // Populate leaderboard
            const users = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            users.forEach((userData, index) => {
                const row = document.createElement('tr');
                
                // Add special styling for top 3
                let medalIcon = '';
                let rankClass = 'rank-default';
                if (index === 0) {
                    medalIcon = '🥇';
                    rankClass = 'rank-first-coins-leaderboard';
                } else if (index === 1) {
                    medalIcon = '🥈';
                    rankClass = 'rank-second-coins-leaderboard';
                } else if (index === 2) {
                    medalIcon = '🥉';
                    rankClass = 'rank-third-coins-leaderboard';
                }
                
                // Default profile picture if not set
                const profilePic = userData.profilePicture || 'https://www.gravatar.com/avatar/?d=mp';
                
                row.innerHTML = `
                    <td class="rank-coins-leaderboard ${rankClass}">
                        <span class="rank-number-coins-leaderboard">${index + 1}</span>
                        ${medalIcon}
                    </td>
                    <td class="coins-leaderboard-username">
                        <img src="${profilePic}" alt="Profile" class="avatar-placeholder-coins-leaderboard">
                        ${userData.username || 'Anonymous'}
                    </td>
                    <td class="coins-leaderboard-amount">${
                        type === 'coins' 
                            ? formatCoins(userData.coins || 0)
                            : (userData.dayStreak || 0) + ' Days'
                    }</td>
                `;
                
                leaderboardBody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching leaderboard data:', error);
            const leaderboardBody = type === 'coins' ? coinsLeaderboardBody : streaksLeaderboardBody;
            leaderboardBody.innerHTML = `
                <tr>
                    <td colspan="4">Unable to load leaderboard. Please try again later.</td>
                </tr>
            `;
        }
    }

    // If leaderboard button doesn't exist, attach to document ready
    if (!leaderboardBtn) {
        console.warn('Leaderboard button not found. Attaching to document ready.');
        document.addEventListener('DOMContentLoaded', initLeaderboard);
    }
}

// Initialize leaderboard on page load
window.addEventListener('DOMContentLoaded', initLeaderboard);
