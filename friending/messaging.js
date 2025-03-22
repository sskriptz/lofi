// messaging.js - Handles chat messaging functionality

import { getAuth, getFirestore } from '../firebase/firebase-config.js';

// Global variables
let currentChatUser = null;
let messageListener = null;

// DOM elements
const chatContainer = document.getElementById('chatContainer');
const chatMessages = document.getElementById('chatMessages');
const messageInput = document.getElementById('messageInput');

// Reset chat state (used when logging out or switching users)
function resetChatState() {
    chatContainer.style.display = 'none';
    currentChatUser = null;
    if (messageListener) {
        messageListener();
        messageListener = null;
    }
}

// Open chat with a friend
function openChat(friendId, friendUsername) {
    currentChatUser = friendId;
    chatContainer.style.display = 'block';
    chatContainer.style.opacity = '1';
    chatContainer.style.pointerEvents = 'auto';
    document.querySelector('#chatUsername span').textContent = friendUsername;
    loadMessages(friendId);
}

// Load messages for a chat
async function loadMessages(friendId) {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    chatMessages.innerHTML = '';

    // Clear previous listener
    if (messageListener) {
        messageListener();
    }

    // Create a chat ID that's consistent regardless of who started the chat
    const chatId = [currentUser.uid, friendId].sort().join('_');

    // Set up real-time listener for messages
    messageListener = db.collection('chats')
        .doc(chatId)
        .collection('messages')
        .orderBy('timestamp')
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    const message = change.doc.data();
                    const messageDiv = document.createElement('div');
                    messageDiv.className = `message ${message.senderId === currentUser.uid ? 'sent' : 'received'}`;
                    messageDiv.textContent = message.text;
                    chatMessages.appendChild(messageDiv);
                }
            });
            chatMessages.scrollTop = chatMessages.scrollHeight;
        });
}

// Send a message
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message || !currentChatUser) return;

    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    const chatId = [currentUser.uid, currentChatUser].sort().join('_');

    try {
        await db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .add({
                text: message,
                senderId: currentUser.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

        messageInput.value = '';
    } catch (error) {
        alert('Error sending message: ' + error.message);
    }
}

// Expose functions for global use
window.openChat = openChat;
window.currentChatUser = currentChatUser;

export { 
    resetChatState, 
    openChat, 
    loadMessages, 
    sendMessage, 
    currentChatUser 
};
