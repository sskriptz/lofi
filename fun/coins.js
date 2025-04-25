import { getAuth, getFirestore } from '../firebase/firebase-config.js';
import { BADGE_MAPPINGS, BADGE_DESCRIPTIONS, showBadgePopup, refreshBadgeDisplay } from './badges.js';

// Add coin milestone badge bonuses
const COIN_MILESTONE_BONUSES = {
    4: 500,       // 1,000 coins milestone
    5: 2500,      // 10,000 coins milestone
    6: 10000,     // 50,000 coins milestone
    7: 25000,     // 100,000 coins milestone
    8: 150000     // 1,000,000 coins milestone
};

// Add coin milestone thresholds
const COIN_MILESTONE_THRESHOLDS = {
    4: 1000,
    5: 10000,
    6: 50000,
    7: 100000,
    8: 1000000
};

export function formatCoins(coins) {
    if (coins < 1000) return Math.floor(coins).toString();
    
    const units = [
        { value: 1e15, symbol: 'Q' },
        { value: 1e12, symbol: 'T' },
        { value: 1e9, symbol: 'B' },
        { value: 1e6, symbol: 'M' },
        { value: 1e3, symbol: 'k' }
    ];

    for (let unit of units) {
        if (coins >= unit.value) {
            const formattedNum = (coins / unit.value).toFixed(1);
            return `${parseFloat(formattedNum)}${unit.symbol}`;
        }
    }

    return Math.floor(coins).toString();
}

function showCoinMilestonePopup(badgeNumber, bonusAmount) {
    const badgePath = BADGE_MAPPINGS[badgeNumber];
    const milestoneThreshold = COIN_MILESTONE_THRESHOLDS[badgeNumber];
    const description = BADGE_DESCRIPTIONS[badgeNumber] || "No description available.";

    const existingOverlay = document.querySelector('.milestone-popup-overlay');
    if (existingOverlay) {
        document.body.removeChild(existingOverlay);
    }

    const overlay = document.createElement('div');
    overlay.className = 'milestone-popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '105vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';

    const popup = document.createElement('div');
    popup.className = 'milestone-popup';
    popup.style.background = 'linear-gradient(145deg, #2a2a2a, #1a1a1a)';
    popup.style.padding = '30px';
    popup.style.borderRadius = '15px';
    popup.style.boxShadow = '0 4px 20px rgba(255, 215, 0, 0.3)';
    popup.style.textAlign = 'center';
    popup.style.width = '400px';
    popup.style.animation = 'scaleIn 0.5s ease-in-out';
    popup.style.border = '2px solid #FFD700';

    const congratsHeader = document.createElement('h2');
    congratsHeader.textContent = 'Milestone Achieved!';
    congratsHeader.style.color = '#FFD700';
    congratsHeader.style.marginBottom = '10px';
    congratsHeader.style.fontSize = '24px';

    const milestoneText = document.createElement('p');
    milestoneText.textContent = `You've reached ${milestoneThreshold.toLocaleString()} coins accumulated!`;
    milestoneText.style.color = 'white';
    milestoneText.style.fontSize = '18px';
    milestoneText.style.marginBottom = '20px';

    const badgeImg = document.createElement('img');
    badgeImg.src = badgePath;
    badgeImg.alt = `Badge ${badgeNumber}`;
    badgeImg.style.width = '100px';
    badgeImg.style.height = '100px';
    badgeImg.style.objectFit = 'contain';
    badgeImg.style.display = 'block';
    badgeImg.style.margin = '0 auto 20px';
    badgeImg.style.filter = 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))';

    const desc = document.createElement('p');
    desc.innerHTML = description;
    desc.style.color = 'white';
    desc.style.marginBottom = '20px';

    const bonusText = document.createElement('p');
    bonusText.textContent = `Bonus Reward: ${bonusAmount.toLocaleString()} coins added to your account!`;
    bonusText.style.color = '#FFD700';
    bonusText.style.fontSize = '18px';
    bonusText.style.fontWeight = 'bold';
    bonusText.style.marginBottom = '20px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Awesome!';
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = 'none';
    closeButton.style.background = '#FFD700';
    closeButton.style.color = 'black';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '16px';
    closeButton.style.fontWeight = 'bold';
    closeButton.style.transition = 'all 0.2s';

    closeButton.addEventListener('mouseover', () => {
        closeButton.style.background = '#FFF';
        closeButton.style.transform = 'scale(1.05)';
    });

    closeButton.addEventListener('mouseout', () => {
        closeButton.style.background = '#FFD700';
        closeButton.style.transform = 'scale(1)';
    });

    closeButton.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    });

    // Create animation style
    const style = document.createElement('style');
    style.textContent = `
        @keyframes scaleIn {
            0% { transform: scale(0.8); opacity: 0; }
            70% { transform: scale(1.05); opacity: 1; }
            100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shine {
            0% { background-position: -100px; }
            40% { background-position: 300px; }
            100% { background-position: 300px; }
        }
        .fade-out {
            opacity: 0;
            transition: opacity 0.3s ease-out;
        }
    `;

    popup.appendChild(congratsHeader);
    popup.appendChild(milestoneText);
    popup.appendChild(badgeImg);
    popup.appendChild(desc);
    popup.appendChild(bonusText);
    popup.appendChild(closeButton);
    overlay.appendChild(popup);
    document.head.appendChild(style);
    document.body.appendChild(overlay);
}

// Function to check coin milestones and award badges
async function checkCoinMilestones(userRef, userData, currentCoins, totalCoinsAccumulated) {
    // Get current badges
    const userBadges = userData.badges || [];
    const earnedMilestoneBadges = userData.earnedMilestoneBadges || [];
    let coinsAwarded = 0;
    let badgeAwarded = false;

    // Check each milestone in descending order
    for (const badgeNumber of [8, 7, 6, 5, 4]) {
        const threshold = COIN_MILESTONE_THRESHOLDS[badgeNumber];
        
        // If threshold has been reached and badge not already earned
        if (totalCoinsAccumulated >= threshold && 
            !userBadges.includes(badgeNumber) && 
            !earnedMilestoneBadges.includes(badgeNumber)) {
            
            // Award badge and coins
            const bonusAmount = COIN_MILESTONE_BONUSES[badgeNumber];
            coinsAwarded += bonusAmount;
            
            // Add badge to user's collection
            userBadges.push(badgeNumber);
            earnedMilestoneBadges.push(badgeNumber);
            badgeAwarded = true;
            
            // Show milestone popup
            showCoinMilestonePopup(badgeNumber, bonusAmount);
        }
    }
    
    // Update database if necessary
    if (coinsAwarded > 0) {
        await userRef.set({
            coins: currentCoins + coinsAwarded,
            badges: userBadges,
            earnedMilestoneBadges: earnedMilestoneBadges
        }, { merge: true });
        
        // Refresh badge display if a new badge was awarded
        if (badgeAwarded) {
            // Allow a short delay for the database update to complete
            setTimeout(() => refreshBadgeDisplay(), 1000);
        }
        
        return currentCoins + coinsAwarded;
    }
    
    return currentCoins;
}

export function initializeCoinSystem() {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth || !db) {
        console.error("Firebase authentication or Firestore not initialized");
        return;
    }

    const coinsElement = document.getElementById('coins');
    const coinStoreElement = document.getElementById('store-coins');
    let coinUpdateInterval;

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userRef = db.collection("users").doc(user.uid);

            // Get or initialize coins
            const userDoc = await userRef.get();
            let userData = userDoc.exists ? userDoc.data() : {};
            let currentCoins = userData.coins !== undefined ? userData.coins : 0;
            let totalCoinsAccumulated = userData.totalCoinsAccumulated !== undefined ? userData.totalCoinsAccumulated : currentCoins;
            let lastDailyBonusDate = userData.lastDailyBonusDate || null;

            function updateCoinsDisplay() {
                const formattedCoins = formatCoins(currentCoins);
                const coinSpan = coinsElement.querySelector('span');
                const coinStoreSpan = coinStoreElement.querySelector('span');
                
                coinSpan.textContent = formattedCoins;
                coinSpan.setAttribute('title', currentCoins.toLocaleString() + ' coins');
                coinSpan.style.cursor = 'help';

                coinStoreSpan.textContent = formattedCoins;
                coinStoreSpan.setAttribute('title', currentCoins.toLocaleString() + ' coins');
                coinStoreSpan.style.cursor = 'help';
            }

            // Check for milestone badges
            currentCoins = await checkCoinMilestones(userRef, userData, currentCoins, totalCoinsAccumulated);

            // Function to check and add daily coins
            async function checkDailyCoins() {
                const today = new Date().toISOString().split('T')[0];
                
                const welcomeMessage = document.getElementById('welcomeMessage');

                if (!lastDailyBonusDate || lastDailyBonusDate !== today) {
                    // Add daily coins
                    currentCoins += 100;
                    totalCoinsAccumulated += 100;
                    
                    // Update Firestore with new coin count and daily bonus date
                    await userRef.set({ 
                        coins: currentCoins,
                        totalCoinsAccumulated: totalCoinsAccumulated,
                        lastDailyBonusDate: today
                    }, { merge: true });    

                    // Show welcome panel with daily coins message
                    welcomeMessage.textContent = `Welcome, ${user.displayName}!\n\n\n You received your daily bonus of 100 coins. Your total is now ${currentCoins.toLocaleString()} coins.`;
                    
                    // Check if this daily bonus pushed us past a milestone
                    currentCoins = await checkCoinMilestones(userRef, userData, currentCoins, totalCoinsAccumulated);

                    // Update display
                    updateCoinsDisplay();
                } else {
                    // Already claimed today's bonus
                    welcomeMessage.textContent = `Welcome back, ${user.displayName}!\n\n\n You've already claimed your daily bonus today. Come back tomorrow for more coins!`;
                }
            }

            // Call daily coins check
            await checkDailyCoins();

            updateCoinsDisplay();

            // Existing coin earning logic remains the same
            function startCoinEarning() {
                if (coinUpdateInterval) {
                    clearInterval(coinUpdateInterval);
                }

                coinUpdateInterval = setInterval(async () => {
                    if (document.visibilityState === 'visible') {
                        currentCoins += 20;
                        totalCoinsAccumulated += 20;

                        try {
                            await userRef.set({ 
                                coins: currentCoins,
                                totalCoinsAccumulated: totalCoinsAccumulated
                            }, { merge: true });

                            // Check if this passive earning pushed us past a milestone
                            currentCoins = await checkCoinMilestones(
                                userRef, 
                                await userRef.get().then(doc => doc.data()), 
                                currentCoins, 
                                totalCoinsAccumulated
                            );

                            updateCoinsDisplay();
                        } catch (error) {
                            console.error("Error updating coins:", error);
                        }
                    }
                }, 30000);
            }

            startCoinEarning();

            // Close button for welcome panel
            const closePanelBtn = document.getElementById('closePanelBtn');
            closePanelBtn.addEventListener('click', () => {
                const welcomePanel = document.getElementById('welcomePanel');
                welcomePanel.style.top = "-100px";
                welcomePanel.style.opacity = "0";
            });

            // Handle visibility change to pause/resume coin earning
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') {
                    startCoinEarning();
                } else if (coinUpdateInterval) {
                    clearInterval(coinUpdateInterval);
                }
            });
        }
    });
}

// Helper function to update totalCoinsAccumulated when coins are spent
export async function updateCoinsAfterPurchase(amount) {
    const auth = getAuth();
    const db = getFirestore();
    
    if (!auth || !db || !auth.currentUser) {
        console.error("Firebase authentication or Firestore not initialized or user not logged in");
        return false;
    }
    
    const userRef = db.collection("users").doc(auth.currentUser.uid);
    
    try {
        const userDoc = await userRef.get();
        if (!userDoc.exists) return false;
        
        const userData = userDoc.data();
        const currentCoins = userData.coins || 0;
        
        // Check if user has enough coins
        if (currentCoins < amount) return false;
        
        // Update coins (reduce by purchase amount)
        // Note: we don't reduce totalCoinsAccumulated since that tracks lifetime accumulation
        await userRef.update({
            coins: currentCoins - amount
        });
        
        return true;
    } catch (error) {
        console.error("Error updating coins after purchase:", error);
        return false;
    }
}

export function initCoinSystemOnLoad() {
    window.addEventListener('DOMContentLoaded', initializeCoinSystem);
}
