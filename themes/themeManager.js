import { applyDarkTheme } from './themeDark.js';
import { applyLightTheme } from './themeLight.js';
import { applyRetroTheme } from './themeRetro.js';
import { getAuth, getFirestore } from '../firebase/firebase-config.js';

let firebaseAuth;
let firebaseDb;

// Theme elements
const themeOptions = document.querySelectorAll('.theme-option');
const saveBtn = document.getElementById('saveAppearanceBtn');
const resetBtn = document.getElementById('resetAppearanceBtn');
const settingsPanel = document.getElementById('appearancePanel');

// Track changes to detect if saving is needed
let hasChanges = false;
let currentTheme = 'dark'; // Changed default to 'dark'
let selectedTheme = 'dark'; // Changed default to 'dark'
let originalTheme = 'dark'; // Changed default to 'dark'
let isInitialLoad = true;


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

// This function only updates the visual selection in the panel without applying the theme
function selectTheme(theme) {
  themeOptions.forEach(option => {
    option.classList.remove('active');
  });
  
  const selectedOption = document.querySelector(`.theme-option[data-theme="${theme}"]`);
  if (selectedOption) {
    selectedOption.classList.add('active');
  }
  
  selectedTheme = theme;
  
  if (!isInitialLoad) {
    hasChanges = (selectedTheme !== originalTheme);
    updateSaveButtonState();
  }
}

// This function actually applies the theme to the UI
export function applyTheme(theme) {
  switch(theme) {
    case 'dark':
      applyDarkTheme();
      break;
    case 'light':
      applyLightTheme();
      break;
    case 'retro':
      applyRetroTheme();
      break;
    default:
      // Fallback to dark theme if an invalid theme is specified
      applyDarkTheme();
      theme = 'dark';
      break;
  }
  
  currentTheme = theme;
  selectedTheme = theme;
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
  // Use the Firebase services that were initialized with initFirebaseServices
  if (!firebaseAuth || !firebaseDb) {
    console.error("Firebase services not initialized");
    applyTheme('dark');
    originalTheme = 'dark';
    selectTheme('dark');
    return;
  }

  const user = firebaseAuth.currentUser;
  if (user) {
    try {
      const docRef = await firebaseDb.collection('users').doc(user.uid).get();
      
      if (docRef.exists && docRef.data().theme) {
        const savedTheme = docRef.data().theme;
        applyTheme(savedTheme);
        originalTheme = savedTheme; // Store the loaded theme as original
        selectTheme(savedTheme);
      } else {
        // If no saved theme, use dark as default
        applyTheme('dark');
        originalTheme = 'dark';
        selectTheme('dark');
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      applyTheme('dark');
      originalTheme = 'dark';
      selectTheme('dark');
    }
  } else {
    // No user is signed in, use dark theme
    applyTheme('dark');
    originalTheme = 'dark';
    selectTheme('dark');
  }
  
  isInitialLoad = false;
  hasChanges = false;
  updateSaveButtonState();
}

export async function saveUserTheme() {
  // Apply the selected theme
  applyTheme(selectedTheme);
  
  if (!firebaseAuth || !firebaseDb) {
    console.error("Firebase services not initialized");
    return;
  }

  const user = firebaseAuth.currentUser;
  if (user) {
    try {
      // Update the user's theme preference in Firestore
      await firebaseDb.collection('users').doc(user.uid).update({
        theme: selectedTheme
      });
      
      console.log("Theme saved successfully");
      originalTheme = selectedTheme; // Update the original theme after saving
      hasChanges = false;
      updateSaveButtonState();
    } catch (error) {
      // If the user document doesn't exist yet, create it
      if (error.code === 'not-found') {
        try {
          await firebaseDb.collection('users').doc(user.uid).set({
            theme: selectedTheme
          });

          console.log("Theme saved successfully (new user document created)");
          originalTheme = selectedTheme; // Update the original theme after saving
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

// Function to cancel changes and restore the original selection
export function cancelThemeChanges() {
  if (hasChanges) {
    selectTheme(originalTheme);
    hasChanges = false;
    updateSaveButtonState();
  }
}

// Helper function to close the panel
function closeAppearancePanel() {
  // Cancel any unsaved changes
  if (hasChanges) {
    cancelThemeChanges();
  }
  
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

// Initialize theme module
export function initThemeManager() {
  console.log("Initializing theme manager");
  
  themeOptions.forEach(option => {
    option.addEventListener('click', () => {
      const theme = option.getAttribute('data-theme');
      selectTheme(theme); // Only select theme, don't apply it yet
    });
  });
  
  saveBtn.addEventListener('click', async () => {
    if (hasChanges) {
      await saveUserTheme(); // This will apply and save the theme
      alert("Theme changed successfully!");

      // Close the panel
      closeAppearancePanel();
    }
  });
  
  // Reset button event listener
  resetBtn.addEventListener('click', () => {
    selectTheme('dark'); // Changed to reset to dark theme
    hasChanges = true;
    updateSaveButtonState();
  });
  
  // Add event listeners to handle panel closing
  const closeBtn = document.getElementById('closeAppearanceBtn');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      closeAppearancePanel();
    });
  }
  
  const overlay = document.getElementById('appearancePanelOverlay');
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeAppearancePanel();
      }
    });
  }
  
  // Initialize with dark theme
  applyTheme('dark');
  selectTheme('dark');
}
