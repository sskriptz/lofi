import { getAuth, getFirestore } from './firebase/firebase-config.js';

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
    let coinUpdateInterval;

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userRef = db.collection("users").doc(user.uid);

            // Get or initialize coins
            const userDoc = await userRef.get();
            let currentCoins = userDoc.exists && userDoc.data().coins !== undefined 
                ? userDoc.data().coins 
                : 0;

            function updateCoinsDisplay() {
                const formattedCoins = formatCoins(currentCoins);
                const coinSpan = coinsElement.querySelector('span');
                
                coinSpan.textContent = formattedCoins;
                
                // Create tooltip with full number
                coinSpan.setAttribute('title', currentCoins.toLocaleString() + ' coins');
                
                //hover styling to indicate tooltip
                coinSpan.style.cursor = 'help';
            }

            updateCoinsDisplay();

            // Coin earning logic
            function startCoinEarning() {
                // Clear any existing interval to prevent multiple intervals
                if (coinUpdateInterval) {
                    clearInterval(coinUpdateInterval);
                }

                coinUpdateInterval = setInterval(async () => {
                    // Check if document is visible (not in background)
                    if (document.visibilityState === 'visible') {
                        currentCoins += 20;

                        try {
                            // Update Firestore with new coin count
                            await userRef.set({ 
                                coins: currentCoins 
                            }, { merge: true });

                            // Update display
                            updateCoinsDisplay();
                        } catch (error) {
                            console.error("Error updating coins:", error);
                        }
                    }
                }, 30000); // how often it should be updated
            }

            startCoinEarning();

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
