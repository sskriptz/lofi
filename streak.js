import { getAuth, getFirestore } from './firebase/firebase-config.js';

export function initializeDayStreak() {
    const auth = getAuth();
    const db = getFirestore();

    if (!auth || !db) {
        console.error("Firebase authentication or Firestore not initialized");
        return;
    }

    const streakElement = document.getElementById('streak');
    const streakSpan = streakElement.querySelector('span');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userRef = db.collection("users").doc(user.uid);

            // Get or initialize day streak
            const userDoc = await userRef.get();
            let currentStreak = userDoc.exists && userDoc.data().dayStreak !== undefined 
                ? userDoc.data().dayStreak 
                : 0;

            let lastLoginDate = userDoc.exists && userDoc.data().lastLoginDate
                ? userDoc.data().lastLoginDate.toDate()
                : null;

            function updateStreakDisplay() {
                streakSpan.textContent = currentStreak;
            }

            updateStreakDisplay();

            // Streak update logic
            async function updateDayStreak() {
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to start of day

                if (!lastLoginDate) {
                    // First login, set initial streak
                    currentStreak = 1;
                } else {
                    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
                    const daysSinceLastLogin = Math.floor((today - lastLoginDate) / oneDay);

                    if (daysSinceLastLogin === 1) {
                        // Consecutive day login
                        currentStreak += 1;
                    } else if (daysSinceLastLogin > 1) {
                        // Break in streak
                        currentStreak = 1;
                    }
                }

                try {
                    // Update Firestore with new streak and login date
                    await userRef.set({ 
                        dayStreak: currentStreak,
                        lastLoginDate: today
                    }, { merge: true });

                    // Update display
                    updateStreakDisplay();
                } catch (error) {
                    console.error("Error updating day streak:", error);
                }
            }

            // Update streak on login
            await updateDayStreak();

            // Optional more precise method: check streak once per day
            const checkStreakDaily = () => {
                const now = new Date();
                const nextMidnight = new Date(
                    now.getFullYear(), 
                    now.getMonth(), 
                    now.getDate() + 1, 
                    0, 0, 0
                );
                
                // Calculate time until next midnight
                const timeUntilMidnight = nextMidnight.getTime() - now.getTime();
                
                // Set a timeout to check streak at midnight
                setTimeout(updateDayStreak, timeUntilMidnight);
            };

            checkStreakDaily();
        }
    });
}

export function initDayStreakOnLoad() {
    window.addEventListener('DOMContentLoaded', initializeDayStreak);
}
