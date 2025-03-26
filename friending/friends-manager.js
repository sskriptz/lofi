// friends-manager.js - Handles friend requests, friends management, and friend profiles

import { getAuth, getFirestore } from '../firebase/firebase-config.js';
import { openChat } from './messaging.js';

import {
    BADGE_MAPPINGS,
    showBadgePopup,
} from '../fun/badges.js';



// This is for viewing friend's coins

function formatCoins(coins) {
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




// DOM Elements - Updated to match the new HTML structure
const notifications = document.getElementById('frNotifications');
const friendsList = document.getElementById('friendsList');
const searchResults = document.getElementById('searchResults');
const searchInput = document.getElementById('searchInput');
const openBtn = document.getElementById('hm-icon');
const socialContainerOverlay = document.getElementById('socialPanelOverlay');


async function sendFriendRequest(targetUserId) {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    if (!currentUser) {
        alert('No authenticated user found');
        return;
    }

    try {
        // Validate inputs
        if (!targetUserId) {
            throw new Error('Invalid target user ID');
        }

        // Fetch current user document
        const currentUserDoc = await db.collection('users').doc(currentUser.uid).get();
        const currentUserData = currentUserDoc.exists ? currentUserDoc.data() : null;

        // Fetch target user document
        const targetUserDoc = await db.collection('users').doc(targetUserId).get();
        const targetUserData = targetUserDoc.exists ? targetUserDoc.data() : null;

        // Validate documents
        if (!currentUserData) {
            throw new Error('Current user document not found');
        }
        if (!targetUserData) {
            throw new Error('Target user document not found');
        }

        // Safely access or initialize arrays
        const currentUserFriends = currentUserData.friends || [];
        const targetUserFriendRequests = targetUserData.friendRequests || [];

        // Check if already friends
        const isAlreadyFriend = currentUserFriends.some(friend => friend.userId === targetUserId);
        if (isAlreadyFriend) {
            alert('You are already friends with this user!');
            return;
        }

        // Check if friend request already sent
        const requestAlreadySent = targetUserFriendRequests.some(
            request => request.userId === currentUser.uid && request.status === 'pending'
        );
        if (requestAlreadySent) {
            alert('Friend request already sent!');
            return;
        }

        // Prepare friend request data
        const friendRequestData = {
            userId: currentUser.uid,
            username: currentUserData.username || 'Unknown User',
            status: 'pending',
            timestamp: new Date().toISOString() // Use ISO string instead of server timestamp
        };

        // Safely reference the document
        const targetUserRef = db.collection('users').doc(targetUserId);
        
        // Use update method to add to array
        await targetUserRef.update({
            friendRequests: firebase.firestore.FieldValue.arrayUnion(friendRequestData)
        });

        // Clear search results
        if (searchResults) {
            searchResults.innerHTML = '';
            searchResults.style.display = 'none';
        }
        if (searchInput) {
            searchInput.value = '';
        }

        alert('Friend request sent!');
    } catch (error) {
        console.error('Friend Request Error:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        alert('Error sending friend request: ' + error.message);
    }
}

// Load friend requests for the current user
async function loadFriendRequests() {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    notifications.innerHTML = '';

    if (userData.friendRequests && userData.friendRequests.length > 0) {
        for (const request of userData.friendRequests) {
            if (request.status === 'pending') {
                // Fetch requester's current data to get their up-to-date profile picture
                const requesterDoc = await db.collection('users').doc(request.userId).get();
                const requesterData = requesterDoc.data();
                
                const notification = document.createElement('div');
                notification.className = 'notification';
                notification.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <img src="${requesterData.profilePicture || 'https://www.gravatar.com/avatar/?d=mp'}" 
                            alt="Profile" 
                            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <p>Friend request from ${request.username}</p>
                    </div>
                    <div>
                        <button onclick="acceptFriendRequest('${request.userId}')">Accept</button>
                        <button onclick="rejectFriendRequest('${request.userId}')">Reject</button>
                    </div>
                `;
                notifications.appendChild(notification);
            }
        }
    } else {
        notifications.innerHTML = 'No friend requests';
        notifications.style.color = 'white';
        notifications.style.padding = '20px';
    }
}

// Accept a friend request
async function acceptFriendRequest(requesterId) {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    const currentUserRef = db.collection('users').doc(currentUser.uid);
    const requesterRef = db.collection('users').doc(requesterId);

    try {
        const currentUserDoc = await currentUserRef.get();
        const requesterDoc = await requesterRef.get();
        const currentUserData = currentUserDoc.data();
        const requesterData = requesterDoc.data();

        // Add to current user's friends list
        await currentUserRef.update({
            friends: firebase.firestore.FieldValue.arrayUnion({
                userId: requesterId,
                username: requesterData.username
            }),
            friendRequests: firebase.firestore.FieldValue.arrayRemove({
                userId: requesterId,
                username: requesterData.username,
                status: 'pending'
            })
        });

        // Add to requester's friends list
        await requesterRef.update({
            friends: firebase.firestore.FieldValue.arrayUnion({
                userId: currentUser.uid,
                username: currentUserData.username
            })
        });

        loadFriendRequests();
        loadFriends();
    } catch (error) {
        alert('Error accepting friend request: ' + error.message);
    }
}

// Reject a friend request
async function rejectFriendRequest(requesterId) {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    const currentUserRef = db.collection('users').doc(currentUser.uid);
    const requesterRef = db.collection('users').doc(requesterId);

    try {
        const requesterDoc = await requesterRef.get();
        await currentUserRef.update({
            friendRequests: firebase.firestore.FieldValue.arrayRemove({
                userId: requesterId,
                username: requesterDoc.data().username,
                status: 'pending'
            })
        });
        loadFriendRequests();
    } catch (error) {
        alert('Error rejecting friend request: ' + error.message);
    }
}

// Load friends list for the current user
async function loadFriends() {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    const userDoc = await db.collection('users').doc(currentUser.uid).get();
    const userData = userDoc.data();
    
    friendsList.innerHTML = '';

    if (userData.friends && userData.friends.length > 0) {
        for (const friend of userData.friends) {
            // Fetch friend's current data to get their up-to-date profile picture
            const friendDoc = await db.collection('users').doc(friend.userId).get();
            const friendData = friendDoc.data();
            
            const friendItem = document.createElement('div');
            friendItem.className = 'friend-item';
            friendItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <img src="${friendData.profilePicture || 'https://www.gravatar.com/avatar/?d=mp'}" 
                        alt="Profile" 
                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                    <span>${friend.username}</span>
                </div>
                <div>
                    <button onclick="removeFriend('${friend.userId}')">Remove</button>
                    <button onclick="openChatWithFriend('${friend.userId}', '${friend.username}')">Chat</button>
                </div>
            `;
            friendsList.appendChild(friendItem);
        }
        
        // Update friend items to add profile click functionality
        updateFriendsListWithProfileClick();
    } else {
        friendsList.innerHTML = '<p>No friends yet</p>';
    }
}

// Remove a friend
async function removeFriend(friendId) {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    const currentUserRef = db.collection('users').doc(currentUser.uid);
    const friendRef = db.collection('users').doc(friendId);

    try {
        const currentUserDoc = await currentUserRef.get();
        const friendDoc = await friendRef.get();
        const currentUserData = currentUserDoc.data();
        const friendData = friendDoc.data();

        // Remove from current user's friends list
        await currentUserRef.update({
            friends: firebase.firestore.FieldValue.arrayRemove({
                userId: friendId,
                username: friendData.username
            })
        });

        // Remove from friend's friends list
        await friendRef.update({
            friends: firebase.firestore.FieldValue.arrayRemove({
                userId: currentUser.uid,
                username: currentUserData.username
            })
        });

        loadFriends();
        
        // Check if currently chatting with this friend
        const { currentChatUser } = window;
        if (currentChatUser === friendId) {
            document.getElementById('chatContainer').style.display = 'none';
        }
    } catch (error) {
        alert('Error removing friend: ' + error.message);
    }
}

// Function to handle opening a chat from the friends list
function openChatWithFriend(friendId, friendUsername) {
    openChat(friendId, friendUsername);
}

// Search for users
async function searchUsers(username) {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    
    if (!username) {
        searchResults.innerHTML = '';
        return;
    }
    
    try {
        // Search for users with username containing the search term
        const usersRef = db.collection('users');
        const snapshot = await usersRef
            .where('username', '>=', username)
            .where('username', '<=', username + '\uf8ff')
            .limit(5)
            .get();
        
        searchResults.innerHTML = '';
        
        if (snapshot.empty) {
            searchResults.innerHTML = '<p>No users found</p>';
            return;
        }
        
        snapshot.forEach(doc => {
            const userData = doc.data();
            
            // Don't show current user in search results
            if (doc.id === currentUser.uid) return;
            
            const userElement = document.createElement('div');
            userElement.className = 'search-result';
            userElement.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                    <img src="${userData.profilePicture || 'https://www.gravatar.com/avatar/?d=mp'}" 
                        alt="Profile" 
                        style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                    <span>${userData.username}</span>
                </div>
                <button onclick="sendFriendRequest('${doc.id}')">Add Friend</button>
            `;
            searchResults.appendChild(userElement);
        });
    } catch (error) {
        console.error('Error searching for users:', error);
        searchResults.innerHTML = '<p>Error searching for users</p>';
    }
}

// Add event listener for search input
function initializeSearchListener() {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.trim();
        if (searchTerm.length >= 3) {
            searchUsers(searchTerm);
        } else {
            searchResults.innerHTML = '';
        }
    });
}

// Initialize the social panel with user data
async function initializeSocialPanel() {
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    if (!currentUser) return;
    
    try {
        const userDoc = await db.collection('users').doc(currentUser.uid).get();
        const userData = userDoc.data();
        
        // Update user info in the panel
        document.getElementById('userUsername').textContent = userData.username;
        document.getElementById('userProfilePic').src = userData.profilePicture || 'https://www.gravatar.com/avatar/?d=mp';
        
        // Load friend requests and friends list
        loadFriendRequests();
        loadFriends();
        
        // Initialize search
        initializeSearchListener();
        
        // Initialize friend profile panel
        addFriendProfilePanelToDOM();
    } catch (error) {
        console.error('Error initializing social panel:', error);
    }
}

// Close the social panel
function socialPanelClose() {
    const socialContainer = document.getElementById('socialContainer');
    const chatContainer = document.getElementById('chatContainer');
    
    socialContainer.style.opacity = "0";
    socialContainer.style.pointerEvents = "none";

    chatContainer.style.opacity = "0";
    chatContainer.style.pointerEvents = "none";

    openBtn.style.pointerEvents = "auto";
    openBtn.style.opacity = "1";

    setTimeout(() => {
        socialContainerOverlay.style.display = "none";
    }, 300);
}

// Close the chat panel
function chatPanelClose() {
    const chatContainer = document.getElementById('chatContainer');
    chatContainer.style.display = 'none';
    window.currentChatUser = null;
}

// Define handlers for message sending
function sendMessage(event) {
    event.preventDefault();
    const messageInputValue = document.getElementById('messageInput').value.trim();
    
    if (!messageInputValue || !window.currentChatUser) return;
    
    const auth = getAuth();
    const db = getFirestore();
    
    const currentUser = auth.currentUser;
    const chatId = [currentUser.uid, window.currentChatUser].sort().join('_');

    try {
        db.collection('chats')
            .doc(chatId)
            .collection('messages')
            .add({
                text: messageInputValue,
                senderId: currentUser.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });

        document.getElementById('messageInput').value = '';
    } catch (error) {
        alert('Error sending message: ' + error.message);
    }
}

// Helper function to format dates
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

// === Friend Profile Panel Functions ===

// Add the HTML for the friend profile panel to the document
function addFriendProfilePanelToDOM() {
    // Check if panel already exists
    if (document.getElementById('friendProfilePanel')) return;
    
    const friendProfilePanel = document.createElement('div');
    friendProfilePanel.id = 'friendProfilePanel';
    friendProfilePanel.innerHTML = `
        <div id="friendProfilePanelHeader">
            <div id="fp-user-info" class="fp-user-info-flex"></div>
            <button id="friendProfilePanelClose">&times;</button>
        </div>
        <div class="fp-option-panel">

            <div class="fp-userfun-section">
                <div id="fp-currency-section">
                    <div class="currency-container-fp">
                        <div class="fp-coins-container">
                            <img src="https://www.shareicon.net/download/2016/07/08/116966_line.ico" class="coins-image-fp">
                            <p id="coins-fp"><span>0</span> coins</p>
                        </div>
                        <div class="fp-daystreak-container">
                            <img src="https://media.tenor.com/84knLXwliC4AAAAm/do%C4%9Fum-g%C3%BCn%C3%BC-pastas%C4%B1.webp" class="streak-image-fp">
                            <p id="streak-fp"><span>0</span> day streak</p>
                        </div>
                    </div>
                </div>

                <div id="fp-badges-section">
                    <div class="badges-container-fp"></div>
                </div>
            </div>

            <div id="fp-aboutme-section">
                <h3>About Me</h3>
                <p id="fp-aboutme-content"></p>
            </div>

            <div class="fp-row2-sections">
                <div id="fp-socials-section">
                    <h3>Socials</h3>
                    <div id="fp-socials-content"></div>
                </div>

                <div id="fp-other-section">
                    <h3>Other</h3>
                    <p id="fp-acc-creation-date"></p>
                </div>
            </div>

            <div class="fp-bottom-buttons">
                <button id="fpbb-chat" class="fp-button">Chat</button>
                <button id="fpbb-remove" class="fp-button">Remove Friend</button>
            </div>
        </div>
    `;
    
    const friendProfilePanelOverlay = document.createElement('div');
    friendProfilePanelOverlay.id = 'friendProfilePanelOverlay';
    
    document.body.appendChild(friendProfilePanel);
    document.body.appendChild(friendProfilePanelOverlay);
    
    // Add styles for the friend profile panel
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        #friendProfilePanel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 12%, rgba(87,104,107,1) 100%);
            padding: 20px;
            height: auto;
            width: 30vw;
            z-index: 6001;
            opacity: 0;
            pointer-events: none;
            border-radius: 15px;
            transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 1);
            max-height: 90vh;
            color: white;
        }
        
        #friendProfilePanel:hover {
            transform: translate(-50%, -50%) scale(1.01);
        }
        
        #friendProfilePanelHeader {
            display: flex;
            align-items: end;
            justify-content: space-between;
            width: 100%;
            height: 20vh;
            background-image: url("https://i.pinimg.com/originals/6b/43/c3/6b43c3a7991332d25fb37bf8e0099bf7.gif");
            background-attachment: fixed;
            background-size: cover;
            background-repeat: no-repeat;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        
        #friendProfilePanelOverlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 6000;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease-in-out;
        }
        
        #friendProfilePanelClose {
            background-color: transparent;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            transition: transform 0.3s ease-in-out;
            margin-right: 10px;
            margin-bottom: 10px;
        }
        
        #friendProfilePanelClose:hover {
            transform: scale(1.2);
        }
        
        .fp-option-panel {
            margin-top: 7%;
        }
        
        .fp-user-info-flex {
            display: flex;  
            align-items: center;
            width: auto;
            height: auto;
            justify-content: left;
            margin-left: 0.8vw;
            margin-bottom: 10px;
        }
        
        .fp-user-info-flex img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 15px;
            border: 2px solid white;
        }
        
        .fp-user-info-flex p {
            margin: 0;
            color: white;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 1px 1px 3px rgba(0,0,0,0.8);
        }
        
        #fp-aboutme-section, #fp-socials-section, #fp-other-section {
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 10px;
            padding: 15px;
            margin-bottom: 15px;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        
        .fp-userfun-section {
            display: flex;
            justify-content: space-around;
            flex-direction: row;
            gap: 13px;
        }

        #fp-currency-section {
            background: url("https://i.ibb.co/fd8jVTy/image-5.png");
            border-radius: 10px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            width: 40%;
            max-width: 40%;
            height: 70px;
        }

        .fp-coins-container {
            display: flex;
            justify-content: left;
            align-items: center;
            margin-left: 0.85vw;
            line-height: 0;
            vertical-align: top;
            scale: 0.90;
        }

        .coins-image-fp {
            width: 30px;
            height: 30px;
            padding-right: 3px;
        }


        .fp-daystreak-container {
            display: flex;
            justify-content: left;
            align-items: center;
            margin-left: 1vw;
            line-height: 0;
            vertical-align: top;
            scale: 0.90;
        }

        .streak-image-fp {
            width: 16px;
            height: 22px;
            padding: 5px;
            padding-right: 9px;
        }



        #fp-badges-section {
            background: url("https://i.ibb.co/fd8jVTy/image-5.png");
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 15px;
            height: 70px;
            gap: 1vw;
            width: 60%;
            max-width: 60%;
        }

        .badges-container-fp {
            width: 85%;
            height: 40%;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 12px;
            margin-top: 12px;
            margin-bottom: 12px;
        }
        
        .fp-row2-sections {
            display: flex;
            justify-content: space-between;
            gap: 15px;
        }
        
        .fp-row2-sections > div {
            flex: 1;
        }
        
        .fp-bottom-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }
        
        .fp-button {
            background-color: darkslateblue;
            border: none;
            color: white;
            font-size: 14px;
            cursor: pointer;
            border-radius: 10px;
            padding: 10px 20px;
            transition: background-color 0.3s ease-in-out;
            flex: 1;
        }
        
        .fp-button:hover {
            background-color: slateblue;
        }
        
        #fpbb-remove {
            background-color: #933;
        }
        
        #fpbb-remove:hover {
            background-color: #c44;
        }
        
        #friendProfilePanel h3 {
            margin-top: 0;
            margin-bottom: 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            padding-bottom: 5px;
        }
    `;
    
    document.head.appendChild(styleElement);
    
    document.getElementById('friendProfilePanelClose').addEventListener('click', closeFriendProfilePanel);
    document.getElementById('friendProfilePanelOverlay').addEventListener('click', closeFriendProfilePanel);
}



// Function to open friend profile
function openFriendProfile(userId, username) {
    // Ensure the panel exists in the DOM
    addFriendProfilePanelToDOM();
    
    // Get profile information
    getFriendProfileInfo(userId, username).then(() => {
        const friendProfilePanel = document.getElementById('friendProfilePanel');
        const friendProfilePanelOverlay = document.getElementById('friendProfilePanelOverlay');
        
        friendProfilePanel.style.opacity = '1';
        friendProfilePanel.style.pointerEvents = 'auto';
        friendProfilePanelOverlay.style.opacity = '1';
        friendProfilePanelOverlay.style.pointerEvents = 'auto';
        
        const chatButton = document.getElementById('fpbb-chat');
        const removeButton = document.getElementById('fpbb-remove');
        
        chatButton.onclick = () => {
            closeFriendProfilePanel();
            openChat(userId, username);
        };
        
        removeButton.onclick = () => {
            if (confirm(`Are you sure you want to remove ${username} from your friends?`)) {
                removeFriend(userId);
                closeFriendProfilePanel();
            }
        };
    });
}

// Function to close friend profile panel
function closeFriendProfilePanel() {
    const friendProfilePanel = document.getElementById('friendProfilePanel');
    const friendProfilePanelOverlay = document.getElementById('friendProfilePanelOverlay');
    
    if (friendProfilePanel && friendProfilePanelOverlay) {
        friendProfilePanel.style.opacity = '0';
        friendProfilePanel.style.pointerEvents = 'none';
        friendProfilePanelOverlay.style.opacity = '0';
        friendProfilePanelOverlay.style.pointerEvents = 'none';
    }
}

// Function to fetch friend's profile information
async function getFriendProfileInfo(userId, username) {
    const db = getFirestore();
    
    try {
        const friendDoc = await db.collection('users').doc(userId).get();
        
        if (!friendDoc.exists) {
            console.error('Friend document does not exist');
            return;
        }
        
        const friendData = friendDoc.data();


        // Update badges section
        const badgesContainer = document.querySelector('.badges-container-fp');
        
        if (friendData.badges && friendData.badges.length > 0) {
            badgesContainer.innerHTML = ''; // Clear any existing badges
            badgesContainer.style.display = 'flex';
            badgesContainer.style.justifyContent = 'center';
            badgesContainer.style.alignItems = 'center';
            badgesContainer.style.gap = '10px';
            badgesContainer.style.overflowY = 'hidden';
            badgesContainer.style.overflowX = 'auto';
            
            friendData.badges.forEach(badgeNumber => {
                // Use the BADGE_MAPPINGS from the badge system
                const badgePath = BADGE_MAPPINGS[badgeNumber];
                if (badgePath) {
                    const badgeImg = document.createElement('img');
                    badgeImg.src = badgePath;
                    badgeImg.alt = `Badge ${badgeNumber}`;
                    badgeImg.style.width = '35px';
                    badgeImg.style.height = '35px';
                    badgeImg.style.cursor = 'pointer';
                    
                    // Add click event to open pop-up for badge description
                    badgeImg.addEventListener('click', () => showBadgePopup(badgeNumber));
                    
                    badgesContainer.appendChild(badgeImg);
                }
            });
        } else {
            // Display message if no badges
            badgesContainer.style.display = 'flex';
            badgesContainer.style.justifyContent = 'center';
            badgesContainer.style.alignItems = 'center';
            badgesContainer.innerHTML = '<p style="color: white; margin: 0; text-align: center;">No badges earned</p>';
        }




        
        // Update profile panel with friend's information
        const fpUserInfo = document.getElementById('fp-user-info');
        fpUserInfo.innerHTML = `
            <img src="${friendData.profilePicture || 'https://www.gravatar.com/avatar/?d=mp'}" alt="Profile">
            <p>${friendData.username}</p>
        `;



        // Update coins section
        const coinsElement = document.getElementById('coins-fp');
        const currentCoins = friendData.coins || 0;
        const formattedCoins = formatCoins(currentCoins);
        
        if (coinsElement) {
            coinsElement.innerHTML = `<span>${formattedCoins}</span> coins`;
            // Add tooltip with full number
            coinsElement.setAttribute('title', currentCoins.toLocaleString() + ' coins');
            coinsElement.style.cursor = 'help';
        }


        // Update day streak section
        const streakElement = document.getElementById('streak-fp');
        const currentStreak = friendData.dayStreak || 0;
        
        if (streakElement) {
            streakElement.innerHTML = `<span>${currentStreak}</span> day streak`;
            streakElement.setAttribute('title', `${friendData.username}'s current login streak`);
            streakElement.style.cursor = 'help';
        }

        
        // Apply the friend's banner if available
        if (friendData.bannerURL) {
            const friendProfileHeader = document.getElementById('friendProfilePanelHeader');
            if (friendProfileHeader) {
                friendProfileHeader.style.backgroundImage = `url(${friendData.bannerURL})`;
                friendProfileHeader.style.backgroundColor = "transparent";
            }
            
            // If you have another element to show the banner, update it here too
            const friendBanner = document.getElementById('friendBanner');
            if (friendBanner) {
                friendBanner.style.backgroundImage = `url(${friendData.bannerURL})`;
            }
        } else {
            // Reset to default if no banner is available
            const friendProfileHeader = document.getElementById('friendProfilePanelHeader');
            if (friendProfileHeader) {
                friendProfileHeader.style.backgroundImage = 'none';
                friendProfileHeader.style.backgroundColor = "black"; // Or your default color
            }
            
            const friendBanner = document.getElementById('friendBanner');
            if (friendBanner) {
                friendBanner.style.backgroundImage = 'none';
            }
        }
        
        // Apply the friend's profile color if available
        const friendProfilePanel = document.getElementById('friendProfilePanel');
        if (friendData.profileColor && friendProfilePanel) {
            friendProfilePanel.style.background = friendData.profileColor;
        } else {
            // Reset to default if no custom color is available
            if (friendProfilePanel) {
                friendProfilePanel.style.background = "linear-gradient(40deg, rgba(2,0,36,1) 0%, rgba(0,0,0,1) 12%, rgba(87,104,107,1) 100%)";
            }
        }
        
        // Update about section if available
        const aboutMeElement = document.getElementById('fp-aboutme-content');
        aboutMeElement.textContent = friendData.aboutMe || 'No information provided';
        
        // Update socials if available
        const socialsElement = document.getElementById('fp-socials-content');
        
        // Check if socials is a string (old format) or an object (new format)
        if (typeof friendData.socials === 'string') {
            // If it's a string, display it with line breaks
            socialsElement.innerHTML = friendData.socials.replace(/\n/g, '<br>') || 'No social links provided';
        } else if (friendData.socials && typeof friendData.socials === 'object') {
            // If it's an object, display platform and link
            let socialsHTML = '';
            for (const [platform, link] of Object.entries(friendData.socials)) {
                if (link) {
                    socialsHTML += `<p><strong>${platform}:</strong> ${link}</p>`;
                }
            }
            socialsElement.innerHTML = socialsHTML || '<p>No social links provided</p>';
        } else {
            socialsElement.innerHTML = '<p>No social links provided</p>';
        }

        const accCreationElement = document.getElementById('fp-acc-creation-date');
        
        // Check if createdAt field exists in the user document
        if (friendData.createdAt) {
            const creationDate = friendData.createdAt.toDate ? 
                friendData.createdAt.toDate() : 
                new Date(friendData.createdAt);
            accCreationElement.textContent = `Account Created On: ${formatDate(creationDate)}`;
        } else {
            // Fallback if creation date is not available
            accCreationElement.textContent = 'Account creation date not available';
        }
        
    } catch (error) {
        console.error('Error fetching friend profile:', error);
    }
}

// Update friends list with profile click functionality
function updateFriendsListWithProfileClick() {
    const friendItems = document.querySelectorAll('.friend-item');
    
    friendItems.forEach(item => {
        // Get the friend info container
        const friendInfo = item.querySelector('div:first-child');
        const username = friendInfo.querySelector('span').textContent;
        
        // Extract user ID from the existing buttons
        const chatButton = item.querySelector('button:nth-child(2)');
        const chatOnclick = chatButton.getAttribute('onclick');
        const userId = chatOnclick.split("'")[1];
        
        // Add pointer cursor if not already set
        if (!friendInfo.style.cursor) {
            friendInfo.style.cursor = 'pointer';
        }
        
        // Remove existing click event to prevent duplicates
        const clone = friendInfo.cloneNode(true);
        friendInfo.parentNode.replaceChild(clone, friendInfo);
        
        // Add click event to view profile
        clone.addEventListener('click', () => {
            openFriendProfile(userId, username);
        });
    });
}

// Make functions available globally for inline event handlers
window.sendFriendRequest = sendFriendRequest;
window.acceptFriendRequest = acceptFriendRequest;
window.rejectFriendRequest = rejectFriendRequest;
window.removeFriend = removeFriend;
window.openChatWithFriend = openChatWithFriend;
window.socialPanelClose = socialPanelClose;
window.chatPanelClose = chatPanelClose;
window.sendMessage = sendMessage;
window.openFriendProfile = openFriendProfile;
window.closeFriendProfilePanel = closeFriendProfilePanel;

export { 
    sendFriendRequest, 
    loadFriendRequests, 
    acceptFriendRequest, 
    rejectFriendRequest, 
    loadFriends, 
    removeFriend,
    initializeSocialPanel,
    socialPanelClose,
    chatPanelClose,
    sendMessage,
    openFriendProfile,
    closeFriendProfilePanel,
    addFriendProfilePanelToDOM
};
