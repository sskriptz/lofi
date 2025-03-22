// auth-handler.js - Handles authentication related functions

import { getAuth, getFirestore } from './firebase-config.js';
import { loadFriendRequests, loadFriends } from '../friending/friends-manager.js';
import { setupSearchListener } from '../friending/search.js';
import { resetChatState } from '../friending/messaging.js';

// Global variables for DOM elements
const usernameError = document.getElementById('usernameError');
const userUsernameSpan = document.getElementById('userUsername');
const chatContainer = document.getElementById('chatContainer');
const userProfilePic = document.getElementById('userProfilePic');

// Set up auth state change listener
function setupAuthStateListener() {
    const auth = getAuth();
    
    auth.onAuthStateChanged(async (user) => {
        // Reset chat state
        resetChatState();
        
        if (user) {
            const db = getFirestore();
            const userDoc = await db.collection('users').doc(user.uid).get();

            // Set profile picture
            if (user.photoURL) {
                userProfilePic.src = user.photoURL;
            } else {
                userProfilePic.src = 'https://www.gravatar.com/avatar/?d=mp';
            }

            if (!userDoc.exists || !userDoc.data().username) {
                // User needs to set a username
            } else {
                // User has a username and is fully authenticated
                userUsernameSpan.textContent = userDoc.data().username;
                loadFriendRequests();
                loadFriends();
                setupSearchListener();
            }
        } else {
            // User is signed out
        }
    });
}

// Sign in with Google
async function signInWithGoogle() {
    const auth = getAuth();
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        await auth.signInWithPopup(provider);
    } catch (error) {
        alert(error.message);
    }
}

async function setUsername() {
    const username = document.getElementById('username').value.trim();
    
    if (username.length < 3) {
        usernameError.textContent = 'Username must be at least 3 characters long';
        return;
    }

    try {
        const auth = getAuth();
        const db = getFirestore();
        
        // Check if username is already taken
        const usernameQuery = await db.collection('users')
            .where('username', '==', username)
            .get();

        if (!usernameQuery.empty) {
            usernameError.textContent = 'Username is already taken';
            return;
        }

        const user = auth.currentUser;
        await db.collection('users').doc(user.uid).set({
            email: user.email,
            username: username,
            friends: [],
            friendRequests: [],
            profilePicture: user.photoURL || null,
            createdAt: firebase.firestore.FieldValue.serverTimestamp() // Add creation timestamp
        });

        userUsernameSpan.textContent = username;
        loadFriendRequests();
        loadFriends();
        setupSearchListener();
    } catch (error) {
        usernameError.textContent = error.message;
    }
}

// Sign out the current user
function signOut() {
    resetChatState();
    const auth = getAuth();
    auth.signOut();
}

export { setupAuthStateListener, signInWithGoogle, setUsername, signOut };
