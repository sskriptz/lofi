import { applyDefaultTheme } from './themeDefault.js';
import { applyDarkTheme } from './themeDark.js';
import { applyLightTheme } from './themeLight.js';
import { applyRetroTheme } from './themeRetro.js';

// Theme elements
const themeOptions = document.querySelectorAll('.theme-option');
const saveBtn = document.getElementById('saveAppearanceBtn');
const resetBtn = document.getElementById('resetAppearanceBtn');
const settingsPanel = document.getElementById('appearancePanel'); // Added missing reference

// Track changes to detect if saving is needed
let hasChanges = false;
let currentTheme = 'default';
let isInitialLoad = true;

let firebaseAuth;
let firebaseDb;

export function initFirebaseServices(auth, db) {
  console.log("Initializing Firebase services in theme manager");
  firebaseAuth = auth;
  firebaseDb = db;
  
  if (firebaseAuth && firebaseDb) {
    console.log("Firebase services successfully initialized in theme manager");
  } else {
    console.error("Failed to initialize Firebase services");
  }
}

export function applyTheme(theme) {
  themeOptions.forEach(option => {
    option.classList.remove('active');
  });
  
  const selectedOption = document.querySelector(`.theme-option[data-theme="${theme}"]`);
  if (selectedOption) {
    selectedOption.classList.add('active');
  }
  
  switch(theme) {
    case 'default':
      applyDefaultTheme();
      break;
    case 'dark':
      applyDarkTheme();
      break;
    case 'light':
      applyLightTheme();
      break;
    case 'retro':
      applyRetroTheme();
      break;
  }
  
  currentTheme = theme;
  
  if (!isInitialLoad) {
    hasChanges = true;
    updateSaveButtonState();
  }
}

function updateSaveButtonState() {
  if (hasChanges) {
    saveBtn.disabled = false;
    saveBtn.classList.add('active');
  } else {
    saveBtn.disabled = true;
    saveBtn.classList.remove('active');
  }
}

export async function loadUserTheme() {
  if (!firebaseAuth || !firebaseDb) {
    console.error("Firebase services not initialized");
    applyTheme('default');
    return;
  }

  const user = firebaseAuth.currentUser;
  if (user) {
    try {
      const docRef = await firebaseDb.collection('users').doc(user.uid).get();
      
      if (docRef.exists && docRef.data().theme) {
        applyTheme(docRef.data().theme);
      } else {
        // If no saved theme, use system default
        applyTheme('default');
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      applyTheme('default');
    }
  } else {
    // No user is signed in, use default theme
    applyTheme('default');
  }
  
  isInitialLoad = false;
  hasChanges = false;
  updateSaveButtonState();
}

export async function saveUserTheme() {
  if (!firebaseAuth || !firebaseDb) {
    console.error("Firebase services not initialized");
    return;
  }

  const user = firebaseAuth.currentUser;
  if (user) {
    try {
      // Update the user's theme preference in Firestore
      await firebaseDb.collection('users').doc(user.uid).update({
        theme: currentTheme
      });
      
      console.log("Theme saved successfully");
      hasChanges = false;
      updateSaveButtonState();
    } catch (error) {
      // If the user document doesn't exist yet, create it
      if (error.code === 'not-found') {
        try {
          await firebaseDb.collection('users').doc(user.uid).set({
            theme: currentTheme
          });

          console.log("Theme saved successfully (new user document created)");
          hasChanges = false;
          updateSaveButtonState();
        } catch (secondError) {
          console.error("Error creating new user document:", secondError);
        }
      } else {
        console.error("Error saving theme:", error);
      }
    }
  } else {
    console.warn("Cannot save theme: No user is signed in");
  }
}

// Initialize theme module
export function initThemeManager() {
  console.log("Initializing theme manager");
  
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      applyTheme(theme);
    });
  });
  
  saveBtn.addEventListener('click', async () => {
    if (hasChanges) {
      await saveUserTheme();
      alert("Theme changed successfully!");

      // Check if settingsPanel exists before using it
      if (settingsPanel) {
        settingsPanel.style.opacity = "0";
        settingsPanel.style.pointerEvents = "none";
      } else {
        console.warn("settingsPanel not found");
      }
      
      const overlay = document.getElementById('appearancePanelOverlay');
      if (overlay) {
        overlay.style.display = "none";
      } else {
        console.warn("appearancePanelOverlay not found");
      }
    }
  });
  
  // Reset button event listener
  resetBtn.addEventListener('click', () => {
    applyTheme('default');
    hasChanges = true;
    updateSaveButtonState();
  });
  
  // Initialize with default theme
  applyTheme('default');
}
