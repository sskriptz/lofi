// search.js - Handles user search functionality

// Import Firebase services
import { getAuth, getFirestore } from '../firebase/firebase-config.js';
import { sendFriendRequest } from './friends-manager.js';

// DOM elements
const searchInput = document.getElementById('searchInputFriends');
const searchResults = document.getElementById('searchResults');

// Set up search input listener
function setupSearchListener() {
    let timeout = null;

    // Define the input handler function
    function handleSearchInput() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            const searchTerm = searchInput.value.trim();
            if (searchTerm.length >= 3) {
                searchUsers(searchTerm);
                searchResults.style.display = 'block';
                searchResults.style.border = '1px solid black';
            } else {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                searchResults.style.border = 'none';
            }
        }, 500);
    }

    // Remove any existing listeners to avoid duplicates
    searchInput.removeEventListener('input', handleSearchInput);
    
    // Add the event listener
    searchInput.addEventListener('input', handleSearchInput);
}

// Search for users by username
async function searchUsers(searchTerm) {
    const auth = getAuth();
    const db = getFirestore();
    
    if (!searchTerm || !auth.currentUser) {
        searchResults.innerHTML = '';
        return;
    }
    
    const currentUser = auth.currentUser;
    
    try {
        // Get current user's friends to check if users are already friends
        const currentUserDoc = await db.collection('users').doc(currentUser.uid).get();
        const currentUserData = currentUserDoc.data();
        const currentUserFriends = currentUserData.friends || [];
        const pendingRequests = currentUserData.friendRequests || [];
        
        // Search for users with username containing the search term (case insensitive)
        const usersRef = db.collection('users');
        
        // Get all users and filter client-side for better partial matches
        const snapshot = await usersRef.get();
        
        searchResults.innerHTML = '';
        
        let hasResults = false;
        
        snapshot.forEach(doc => {
            const userData = doc.data();
            
            // Check if username contains search term (case insensitive)
            if (
                userData.username.toLowerCase().includes(searchTerm.toLowerCase()) && 
                doc.id !== currentUser.uid // Not the current user
            ) {
                hasResults = true;
                
                const isAlreadyFriend = currentUserFriends.some(friend => friend.userId === doc.id);
                const hasPendingRequest = pendingRequests.some(
                    request => request.userId === doc.id && request.status === 'pending'
                );
                
                const userElement = document.createElement('div');
                userElement.className = 'user-card';
                userElement.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                        <img src="${userData.profilePicture || 'https://www.gravatar.com/avatar/?d=mp'}" 
                            alt="Profile" 
                            style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <span>${userData.username}</span>
                    </div>
                    ${
                        isAlreadyFriend ? 
                            '<button disabled>Already Friends</button>' : 
                        hasPendingRequest ? 
                            '<button disabled>Request Pending</button>' : 
                            `<button class="add-friend-btn" data-userid="${doc.id}">Add Friend</button>`
                    }
                `;
                searchResults.appendChild(userElement);
            }
        });
        
        if (!hasResults) {
            searchResults.innerHTML = '<p>No users found</p>';
        } else {
            // Add event listeners to all "Add Friend" buttons
            document.querySelectorAll('.add-friend-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const userId = e.target.getAttribute('data-userid');
                    sendFriendRequest(userId);
                    e.target.disabled = true;
                    e.target.textContent = 'Request Sent';
                });
            });
        }
    } catch (error) {
        console.error('Error searching for users:', error);
        searchResults.innerHTML = '<p>Error searching for users</p>';
    }
}

// Make the sendFriendRequest function available globally
window.sendFriendRequestFromSearch = async (userId) => {
    try {
        await sendFriendRequest(userId);
        // Update UI to show request was sent
        const button = document.querySelector(`.add-friend-btn[data-userid="${userId}"]`);
        if (button) {
            button.disabled = true;
            button.textContent = 'Request Sent';
        }
    } catch (error) {
        console.error('Error sending friend request:', error);
        alert('Failed to send friend request');
    }
};

// Export functions
export { setupSearchListener, searchUsers };
