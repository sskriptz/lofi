import { getAuth, getFirestore } from '../firebase/firebase-config.js';

// Badge mapping
const BADGE_MAPPINGS = {
    1: './assets/badges/owner-badge.png',
    2: './assets/badges/dev-badge.png',
    3: './assets/badges/first-100-badge.png',
    4: './assets/badges/1kcoinbadge.png',   // 1,000 coins
    5: './assets/badges/10kcoinbadge.png',   // 10,000 coins
    6: './assets/badges/50kcoinbadge.png',   // 50,000 coins
    7: './assets/badges/100kcoinbadge.png',   // 100,000 coins
    8: './assets/badges/1Mcoinbadge.png'    // 1,000,000 coins
};

// Badge descriptions
const BADGE_DESCRIPTIONS = {
    1: `<span class="rarity unknown">Rarity: ???</span><br>Owner Badge: Awarded to the creator or owner of the project.`,
    2: `<span class="rarity mythical">Rarity: Mythical</span><br>Developer Badge: Earned by developers who contributed to the project.`,
    3: `<span class="rarity common">Rarity: Common</span><br>First 100 Badge: Given to the first 100 users who joined.`,
    4: `<span class="rarity common">Rarity: Common</span><br>Coin Collector I: Earned by accumulating 1,000 coins.`,
    5: `<span class="rarity uncommon">Rarity: Uncommon</span><br>Coin Collector II: Earned by accumulating 10,000 coins.`,
    6: `<span class="rarity rare">Rarity: Rare</span><br>Coin Collector III: Earned by accumulating 50,000 coins.`,
    7: `<span class="rarity epic">Rarity: Epic</span><br>Coin Collector IV: Earned by accumulating 100,000 coins.`,
    8: `<span class="rarity legendary">Rarity: Legendary</span><br>Coin Collector V: Earned by accumulating 1,000,000 coins.`
};

function showBadgePopup(badgeNumber) {
    const badgePath = BADGE_MAPPINGS[badgeNumber];
    const description = BADGE_DESCRIPTIONS[badgeNumber] || "No description available.";

    const existingOverlay = document.querySelector('.badge-popup-overlay');
    if (existingOverlay) {
        document.body.removeChild(existingOverlay);
    }

    const overlay = document.createElement('div');
    overlay.className = 'badge-popup-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '105vh';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '10000';

    const popup = document.createElement('div');
    popup.className = 'badge-popup';
    popup.style.background = '#1a1a1a';
    popup.style.padding = '20px';
    popup.style.borderRadius = '10px';
    popup.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.3)';
    popup.style.textAlign = 'center';
    popup.style.width = '300px';
    popup.style.animation = 'fadeIn 0.3s ease-in-out';

    const badgeImg = document.createElement('img');
    badgeImg.src = badgePath;
    badgeImg.alt = `Badge ${badgeNumber}`;
    badgeImg.style.width = '80px';
    badgeImg.style.height = '80px';
    badgeImg.style.objectFit = 'contain';
    badgeImg.style.display = 'block';
    badgeImg.style.margin = '0 auto 15px';

    const desc = document.createElement('p');
    desc.innerHTML = description; // Use innerHTML to render HTML elements
    desc.style.color = 'white';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.style.marginTop = '10px';
    closeButton.style.padding = '8px 12px';
    closeButton.style.border = 'none';
    closeButton.style.background = '#333';
    closeButton.style.color = 'white';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';

    closeButton.addEventListener('click', () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(overlay);
        }, 300);
    });

    popup.appendChild(badgeImg);
    popup.appendChild(desc);
    popup.appendChild(closeButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}

// Function to refresh badge display
export async function refreshBadgeDisplay() {
    const auth = getAuth();
    const db = getFirestore();
    
    if (!auth || !db || !auth.currentUser) {
        console.error("Firebase authentication or Firestore not initialized or user not logged in");
        return;
    }
    
    const userRef = db.collection("users").doc(auth.currentUser.uid);
    
    try {
        const userDoc = await userRef.get();
        const userData = userDoc.exists ? userDoc.data() : {};
        const badgesContainer = document.querySelector('.badges-container');
        
        if (!badgesContainer) {
            console.error("Badges container not found in DOM");
            return;
        }

        if (userData.badges && userData.badges.length > 0) {
            badgesContainer.style.overflowX = 'auto';
            badgesContainer.style.overflowY = 'hidden';
            badgesContainer.style.display = 'flex';
            badgesContainer.style.justifyContent = 'center';
            badgesContainer.style.alignItems = 'center';
            badgesContainer.style.gap = '10px';

            badgesContainer.innerHTML = '';

            userData.badges.forEach(badgeNumber => {
                const badgePath = BADGE_MAPPINGS[badgeNumber];
                if (badgePath) {
                    const badgeImg = document.createElement('img');
                    badgeImg.src = badgePath;
                    badgeImg.alt = `Badge ${badgeNumber}`;
                    badgeImg.style.width = '35px';
                    badgeImg.style.height = '35px';
                    badgeImg.style.cursor = 'pointer';

                    // Add click event to open pop-up
                    badgeImg.addEventListener('click', () => showBadgePopup(badgeNumber));

                    badgesContainer.appendChild(badgeImg);
                }
            });
        } else {
            badgesContainer.style.display = 'flex';
            badgesContainer.style.justifyContent = 'center';
            badgesContainer.style.alignItems = 'center';
            badgesContainer.innerHTML = '<p style="color: white;">No badges earned yet</p>';
            badgesContainer.style.overflowX = 'visible';
        }
    } catch (error) {
        console.error("Error refreshing badge display:", error);
    }
}


// Initialize Badge System
export function initializeBadgeSystem() {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth || !db) {
        console.error("Firebase authentication or Firestore not initialized");
        return;
    }

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userRef = db.collection("users").doc(user.uid);

            try {
                const userDoc = await userRef.get();
                const userData = userDoc.exists ? userDoc.data() : {};
                const badgesContainer = document.querySelector('.badges-container');

                if (!userData.badges) {
                    await userRef.set({
                        ...userData,
                        badges: []
                    }, { merge: true });
                }

                if (userData.badges && userData.badges.length > 0) {
                    badgesContainer.style.overflowX = 'auto';
                    badgesContainer.style.overflowY = 'hidden';
                    badgesContainer.style.display = 'flex';
                    badgesContainer.style.justifyContent = 'center';
                    badgesContainer.style.alignItems = 'center';
                    badgesContainer.style.gap = '10px';

                    badgesContainer.innerHTML = '';

                    userData.badges.forEach(badgeNumber => {
                        const badgePath = BADGE_MAPPINGS[badgeNumber];
                        if (badgePath) {
                            const badgeImg = document.createElement('img');
                            badgeImg.src = badgePath;
                            badgeImg.alt = `Badge ${badgeNumber}`;
                            badgeImg.style.width = '35px';
                            badgeImg.style.height = '35px';
                            badgeImg.style.cursor = 'pointer';

                            // Add click event to open pop-up
                            badgeImg.addEventListener('click', () => showBadgePopup(badgeNumber));

                            badgesContainer.appendChild(badgeImg);
                        }
                    });
                } else {
                    badgesContainer.style.display = 'flex';
                    badgesContainer.style.justifyContent = 'center';
                    badgesContainer.style.alignItems = 'center';
                    badgesContainer.innerHTML = '<p style="color: white;">No badges earned yet</p>';
                    badgesContainer.style.overflowX = 'visible';
                }
            } catch (error) {
                console.error("Error fetching or updating user badges:", error);
                document.querySelector('.badges-container').innerHTML = '<p style="color: red;">Error loading badges</p>';
            }
        }
    });
}

// Initialize badge system on page load
export function initBadgeSystemOnLoad() {
    window.addEventListener('DOMContentLoaded', initializeBadgeSystem);
}

export { 
    BADGE_MAPPINGS, 
    BADGE_DESCRIPTIONS, 
    showBadgePopup, 
};
