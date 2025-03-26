import { getAuth, getFirestore } from '../firebase/firebase-config.js';

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

            // Function to check and add daily coins
            async function checkDailyCoins() {
                const today = new Date().toISOString().split('T')[0];
                
                const welcomeMessage = document.getElementById('welcomeMessage');

                if (!lastDailyBonusDate || lastDailyBonusDate !== today) {
                    // Add daily coins
                    currentCoins += 100;
                    
                    // Update Firestore with new coin count and daily bonus date
                    await userRef.set({ 
                        coins: currentCoins,
                        lastDailyBonusDate: today
                    }, { merge: true });    

                    // Show welcome panel with daily coins message
                    welcomeMessage.textContent = `Welcome, ${user.displayName}!\n\n\n You received your daily bonus of 100 coins. Your total is now ${currentCoins.toLocaleString()} coins.`;
                    

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

                        try {
                            await userRef.set({ 
                                coins: currentCoins 
                            }, { merge: true });

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

export function initCoinSystemOnLoad() {
    window.addEventListener('DOMContentLoaded', initializeCoinSystem);
}
