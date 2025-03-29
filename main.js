import { initFirebase, getAuth, getFirestore } from './firebase/firebase-config.js';
import { setupAuthStateListener } from './firebase/auth-handler.js';
import songs from './fun/songs.js';
import { initThemeManager, initFirebaseServices, loadUserTheme } from './themes/themeManager.js';
import { initializeCoinSystem } from './fun/coins.js';
import { initializeDayStreak } from './fun/streak.js';
import { initLeaderboard } from './fun/leaderboard.js';
import { initBadgeSystemOnLoad } from './fun/badges.js';
import { initStoreOnLoad } from './fun/store.js';
import { initializeInventory } from './fun/inventory.js';




document.addEventListener('DOMContentLoaded', () => {
    initFirebase();
    const auth = getAuth();
    const db = getFirestore();
    initFirebaseServices(auth, db);
    initThemeManager();
    initializeCoinSystem();
    initializeDayStreak();
    initLeaderboard();
    initBadgeSystemOnLoad();
    initStoreOnLoad();
    initializeInventory();

    
    let messageListener = null;
    let currentChatUser = null;
    
    setupAuthStateListener();
    
    document.getElementById('messageForm')?.addEventListener('submit', (event) => {
        event.preventDefault();
        import('./friending/messaging.js').then(module => {
            module.sendMessage();
        });
    });

    let homepageSignOutBtn = document.getElementById("sign-out-btn");

    homepageSignOutBtn.addEventListener('click', () => {
        auth.setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
            auth.signOut().then(() => {
                // After setting persistence to NONE, sign out and reset the UI
                window.location.href = "index.html";  // Redirect to index.html after sign-out
            }).catch(error => console.error("Sign-out error:", error));
        }).catch(error => console.error("Error clearing persistence:", error));
    });    

    const welcomePanel = document.createElement("div");
    welcomePanel.id = "welcomePanel";
    welcomePanel.style.position = "absolute";
    welcomePanel.style.top = "-100px";
    welcomePanel.style.background = "rgba(255, 255, 255, 0.8)";
    welcomePanel.style.borderRadius = "15px";
    welcomePanel.style.border = "3px solid rgba(0, 0, 0, 0.7)";
    welcomePanel.style.padding = "20px";
    welcomePanel.style.fontSize = "18px";
    welcomePanel.style.textAlign = "center";
    welcomePanel.style.width = "80%";
    welcomePanel.style.maxWidth = "400px";
    welcomePanel.style.zIndex = "9999";
    welcomePanel.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.3)";
    welcomePanel.style.transition = "top 0.5s ease, opacity 0.3s ease, transform 0.3s ease";
    welcomePanel.style.opacity = "0";
    welcomePanel.style.fontFamily = "'Inconsolata', monospace";
    welcomePanel.style.backdropFilter = "blur(15px)";
    document.body.appendChild(welcomePanel);
    
    const welcomeMessage = document.createElement("p");
    welcomeMessage.id = "welcomeMessage";
    welcomeMessage.style.whiteSpace = "pre-line";
    welcomeMessage.style.color = "black";
    welcomePanel.appendChild(welcomeMessage);
    
    const closePanelBtn = document.createElement("button");
    closePanelBtn.id = "closePanelBtn";
    closePanelBtn.textContent = "Continue";
    closePanelBtn.style.background = "#333333"; 
    closePanelBtn.style.border = "2px solid transparent";
    closePanelBtn.style.color = "white";
    closePanelBtn.style.fontSize = "20px";
    closePanelBtn.style.marginTop = "20px";
    closePanelBtn.style.cursor = "pointer";
    closePanelBtn.style.padding = "12px 30px";
    closePanelBtn.style.borderRadius = "8px";
    closePanelBtn.style.transition = "background-color 0.3s ease, border-color 0.3s ease";
    closePanelBtn.style.fontWeight = "bold";
    closePanelBtn.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
    welcomePanel.appendChild(closePanelBtn);
    
    closePanelBtn.onmouseover = () => {
        closePanelBtn.style.borderColor = "#ffffff";
        closePanelBtn.style.backgroundColor = "#555555";
    };
    closePanelBtn.onmouseout = () => {
        closePanelBtn.style.borderColor = "transparent";
        closePanelBtn.style.backgroundColor = "#333333";
    };
    
    welcomePanel.onmouseover = () => {
        welcomePanel.style.transform = "translateX(-50%) scale(1.05)";
        welcomePanel.style.boxShadow = "0 15px 50px rgba(0, 0, 0, 0.4)";
    };
    welcomePanel.onmouseout = () => {
        welcomePanel.style.transform = "translateX(-50%) scale(1)";
        welcomePanel.style.boxShadow = "0 10px 40px rgba(0, 0, 0, 0.3)";
    };
      

    const style = document.createElement('style');
    style.innerHTML = 
        `@keyframes hoverUpDown {
            0% { transform: translateY(0); }
            50% { transform: translateY(10px); }
            100% { transform: translateY(0); }
        }`;
    document.head.appendChild(style);



    function checkIfNewUser(user) {
        const creationTime = user.metadata.creationTime;
        const lastSignInTime = user.metadata.lastSignInTime;
    
        if (creationTime === lastSignInTime) {
            welcomeMessage.innerHTML = `Welcome, ${user.displayName}!`;
        } else {
            welcomeMessage.innerHTML = `Welcome back, ${user.displayName}!`;
        }
    
        setTimeout(() => {
            welcomePanel.style.opacity = "1";
            welcomePanel.style.top = "20px";
            welcomePanel.style.animation = "hoverUpDown 3s infinite ease-in-out";
        }, 500); 
    }


    closePanelBtn.onclick = () => {
        welcomePanel.style.top = "-100px";
        welcomePanel.style.opacity = "0";
    
        setTimeout(() => {
            welcomePanel.style.display = "none";
        }, 500);
    };


    // Setup auth state observer
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            checkIfNewUser(user);
        } else {
            // If user is not signed in, redirect to index page
            window.location.href = "index.html";
            return;
        }

        if (user) {
            loadUserTheme();
        } else {
            applyTheme('dark');
        }

        document.getElementById('chatContainer').style.display = 'none';
        currentChatUser = null;
        if (messageListener) {
            messageListener();
            messageListener = null;
        }

        // ----------------- UPDATE USER INFO -----------------
  
  
        const userDoc = await db.collection('users').doc(user.uid).get();
          
        const profilePicElement = document.getElementById('userProfilePic');
        if (user.photoURL) {
            profilePicElement.src = user.photoURL;
        } else {
            profilePicElement.src = 'https://www.gravatar.com/avatar/?d=mp';
        }





        // Update user info display
        const userInfo = document.getElementById('userInfo');
        userInfo.innerHTML = `
            <img src="${user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}" 
                 alt="Profile" 
                 width="50" 
                 style="border-radius: 50%">
            <p id="homepageUserDisplayName">Hello, ${user.displayName}</p>
        `;






        const profileUserInfo = document.getElementById("pp-user-info");
        profileUserInfo.innerHTML = `
            <img src="${user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}" 
                 alt="Profile" 
                 width="50" 
                 style="border-radius: 50%">
            <p>${user.displayName}</p>
        `;


        const storeUserInfo = document.getElementById("pp-user-info-store");
        storeUserInfo.innerHTML = `
            <img src="${user.photoURL || 'https://www.gravatar.com/avatar/?d=mp'}" 
                 alt="Profile" 
                 width="50" 
                 style="border-radius: 50%">
            <p>${user.displayName}</p>
        `;



        const accCreationDateP = document.getElementById("acc-creation-date");

        // Function to format the date
        function formatDate(timestamp) {
            const date = new Date(timestamp);
            return date.toLocaleDateString("en-US", {  
                year: "numeric",  
                month: "long",  
                day: "numeric"  
            });
        }

        if (user) {
            const creationTimestamp = user.metadata.creationTime;
            if (creationTimestamp) {
                accCreationDateP.textContent = `Account Created On: ${formatDate(creationTimestamp)}`;
            } else {
                accCreationDateP.textContent = "Creation date not available.";
            }
        }






        // -----------------------------------------------

        if (!userDoc.exists) {
            // Create new user document with Google display name
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                username: user.displayName,
                friends: [],
                friendRequests: [],
                profilePicture: user.photoURL || null,
                createdAt: firebase.firestore.FieldValue.serverTimestamp() // Add creation timestamp
            });
            document.getElementById('userUsername').textContent = user.displayName;
        } else {
            document.getElementById('userUsername').textContent = userDoc.data().username;
        }



        // Retrieve the "About Me" text when the user is signed in
        if (user) {
            // Fetch the user's "About Me" from Firestore
            db.collection("users").doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    // Display the saved "About Me" text if it exists
                    aboutMeOfficialP.textContent = doc.data().aboutMe || "You haven't set an About Me yet.";
                } else {
                    aboutMeOfficialP.textContent = "You haven't set an About Me yet.";
                }
            })
            .catch(error => {
                console.error("Error fetching About Me:", error);
            });
        }


        // Retrieve the "Socials" text when the user is signed in

        if (user) {
            db.collection("users").doc(user.uid).get()
            .then(doc => {
                if (doc.exists) {
                    socialsOfficialP.innerHTML = (doc.data().socials || "You haven't set your Socials yet.").replace(/\n/g, "<br>");
                } else {
                    socialsOfficialP.innerHTML = "You haven't set your Socials yet.";
                }
            })
            .catch(error => {
                console.error("Error fetching Socials:", error);
            });
        }
    });

    // Update user profile picture

    const profilePicInput = document.getElementById("profile-pic-input");
    const profilePicSaveBtn = document.getElementById("profile-pic-save-btn");
    const profilePicPreview = document.getElementById("profile-pic-preview");

    // Function to validate image URL
    function isValidImageUrl(url) {
        try {
            const urlObj = new URL(url); // This will throw an error if the URL is invalid
            return /\.(jpg|jpeg|png|gif|webp)$/i.test(urlObj.pathname);
        } catch (e) {
            return false;
        }
    }
    // Preview image when URL is entered
    profilePicInput.addEventListener("input", () => {
        const imageUrl = profilePicInput.value.trim();
        
        if (imageUrl && isValidImageUrl(imageUrl)) {
            profilePicPreview.src = imageUrl;
            profilePicPreview.style.display = "block";
            
            profilePicPreview.onerror = () => {
                profilePicPreview.style.display = "none";
                profilePicPreview.src = "";
                alert("Invalid image URL or image could not be loaded");
            };
        } else {
            profilePicPreview.style.display = "none";
        }
    });

    // Function to update profile picture
    async function updateProfilePicture() {
        const imageUrl = profilePicInput.value.trim();
        
        if (!imageUrl) {
            alert("Please enter an image URL");
            return;
        }
        
        if (!isValidImageUrl(imageUrl)) {
            alert("Please enter a valid image URL");
            return;
        }
        
        const user = auth.currentUser;
        
        if (!user) {
            alert("You must be logged in to update your profile picture");
            return;
        }
        
        try {
            // Update profile in Firebase Auth
            await user.updateProfile({
                photoURL: imageUrl
            });
            
            // Update in Firestore
            await db.collection("users").doc(user.uid).update({
                profilePicture: imageUrl
            });
            
            // Update profile pictures in friends' data
            const allUsersSnapshot = await db.collection('users').get();
            const batch = db.batch();
            
            allUsersSnapshot.forEach(doc => {
                const friendRef = db.collection('users').doc(doc.id);
                const friendData = doc.data();
                
                if (friendData.friends) {
                    // Update profile picture in friends array
                    const updatedFriends = friendData.friends.map(friend =>
                        friend.userId === user.uid
                            ? { 
                                userId: user.uid, 
                                username: user.displayName || friend.username, 
                                profilePicture: imageUrl 
                            }
                            : friend
                    );
                    
                    // Only update if there's a change
                    if (JSON.stringify(updatedFriends) !== JSON.stringify(friendData.friends)) {
                        batch.update(friendRef, { friends: updatedFriends });
                    }
                }
            });
            
            await batch.commit();
            
            // Update all profile picture instances on the page
            updateAllProfilePictures(imageUrl);
            
            alert("Profile picture updated successfully!");
            profilePicInput.value = "";
            
        } catch (error) {
            console.error("Error updating profile picture:", error);
            alert("Failed to update profile picture: " + error.message);
        }
    }


    function updateAllProfilePictures(imageUrl) {
        const userInfo = document.getElementById('userInfo');
        if (userInfo) {
            const imgElement = userInfo.querySelector('img');
            if (imgElement) {
                imgElement.src = imageUrl;
            }
        }
        
        // Update in pp-user-info div
        const profileUserInfo = document.getElementById("pp-user-info");
        if (profileUserInfo) {
            const imgElement = profileUserInfo.querySelector('img');
            if (imgElement) {
                imgElement.src = imageUrl;
            }
        }
        
        // Update userProfilePic if it exists
        const profilePicElement = document.getElementById('userProfilePic');
        if (profilePicElement) {
            profilePicElement.src = imageUrl;
        }
        
        // Update any other profile pictures with current user's ID
        const profilePics = document.querySelectorAll("img[data-userid='" + auth.currentUser.uid + "']");
        if (profilePics.length > 0) {
            profilePics.forEach(pic => {
                pic.src = imageUrl;
            });
        }
        
        // Update any profile pic that might be using the auth user's photo
        const userPhotoPics = document.querySelectorAll(".user-photo");
        if (userPhotoPics.length > 0) {
            userPhotoPics.forEach(pic => {
                if (pic.getAttribute('data-uid') === auth.currentUser.uid) {
                    pic.src = imageUrl;
                }
            });
        }
    }

    profilePicSaveBtn.addEventListener("click", updateProfilePicture);





    const bannerInput = document.getElementById("banner-input");
    const bannerPreview = document.createElement("img");
    bannerPreview.id = "banner-preview"; 
    document.querySelector(".bannerPreviewContainer").appendChild(bannerPreview);
    const bannerSaveBtn = document.getElementById("banner-save-btn");

    document.querySelector(".bannerPreviewContainer").style.textAlign = "center";
    document.querySelector(".bannerPreviewContainer").style.marginTop = "10px";
    document.querySelector(".bannerPreviewContainer").style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    document.querySelector(".bannerPreviewContainer").style.padding = "10px";
    document.querySelector(".bannerPreviewContainer").style.borderRadius = "10px";
    document.querySelector(".bannerPreviewContainer").style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
    document.querySelector(".bannerPreviewContainer").style.display = "flex";
    document.querySelector(".bannerPreviewContainer").style.justifyContent = "center";

    bannerPreview.style.maxWidth = "75%";
    bannerPreview.style.maxHeight = "150px";
    bannerPreview.style.objectFit = "contain";
    bannerPreview.style.borderRadius = "10px";
    bannerPreview.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 1)";

    // Validate image URL including base64 data URLs
    function isValidImageUrl(url) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.startsWith("data:image");
    }

    // Preview banner when URL is entered
    bannerInput.addEventListener("input", () => {
        const imageUrl = bannerInput.value.trim();
        
        // Clear previous preview before showing a new one
        bannerPreview.src = "";
        bannerPreview.style.display = "none"; 

        if (imageUrl && isValidImageUrl(imageUrl)) {
            bannerPreview.src = imageUrl;
            bannerPreview.style.display = "block";
            bannerPreview.onerror = () => {
                bannerPreview.style.display = "none";
                alert("Invalid image URL or image could not be loaded");
            };
        }
    });

    // Update profile banner in Firestore
    async function updateProfileBanner() {
        const imageUrl = bannerInput.value.trim();
        const user = auth.currentUser;

        if (!imageUrl || !isValidImageUrl(imageUrl)) {
            alert("Please enter a valid image URL");
            return;
        }

        if (!user) {
            alert("You must be logged in to update your profile banner");
            return;
        }

        try {
            // Store only in "bannerURL" field
            await db.collection("users").doc(user.uid).set({ bannerURL: imageUrl }, { merge: true });

            // Update the profile header background with the new banner image
            const profileHeader = document.getElementById("profilePanelHeader");
            if (profileHeader) {
                profileHeader.style.backgroundImage = `url(${imageUrl})`;  // Set background image
                profileHeader.style.backgroundColor = "transparent"; // Ensure background color is transparent when the image is set
            }

            updateBannerOnPage(imageUrl);
            alert("Banner updated successfully!");
            bannerInput.value = "";
        } catch (error) {
            alert("Failed to update banner: " + error.message);
        }
    }

    // Update the banner on the page
    function updateBannerOnPage(imageUrl) {
        // Update userBanner if it exists
        const profileBanner = document.getElementById("userBanner");
        if (profileBanner) profileBanner.style.backgroundImage = `url(${imageUrl})`;

        // Update the preview image
        bannerPreview.src = imageUrl;
    }

    // Load the user's banner when they log in or reload the page
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (userDoc.exists && userDoc.data().bannerURL) {
                const bannerImageUrl = userDoc.data().bannerURL;
                
                // Update the background of profilePanelHeader
                const profileHeader = document.getElementById("profilePanelHeader");
                if (profileHeader) {
                    profileHeader.style.backgroundImage = `url(${bannerImageUrl})`;
                    profileHeader.style.backgroundColor = "transparent";
                }

                updateBannerOnPage(bannerImageUrl);
            }
        }
    });

    bannerSaveBtn.addEventListener("click", updateProfileBanner);








    const solidColorInput = document.getElementById("solid-color-input");
    const gradientColorInput = document.getElementById("gradient-color-input");
    const colorSaveBtn = document.getElementById("color-save-btn");

    const gradientContainer = document.createElement("div");
    gradientContainer.classList.add("gradient-container");
    gradientContainer.innerHTML = `
        <p class="gradient-label">Or create a gradient:</p>
        <div class="gradient-pickers">
            <input type="color" id="gradient-color-1" title="Start color">
            <input type="color" id="gradient-color-2" title="End color">
            <select id="gradient-direction">
                <option value="to right">→ Horizontal</option>
                <option value="to bottom">↓ Vertical</option>
                <option value="to bottom right">↘ Diagonal</option>
                <option value="to bottom left">↙ Diagonal</option>
            </select>
        </div>
    `;


    gradientColorInput.parentNode.insertBefore(gradientContainer, gradientColorInput.nextSibling);


    const gradientStyles = document.createElement("style");
    gradientStyles.textContent = `
        .gradient-container {
            margin-top: 10px;
        }
        .gradient-label {
            margin-bottom: 5px;
            font-size: 0.9rem;
            color: rgba(255, 255, 255, 0.7);
        }
        .gradient-pickers {
            display: flex;
            gap: 10px;
            align-items: center;
        }
        #gradient-color-1, #gradient-color-2 {
            width: 40px;
            height: 40px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            background: transparent;
        }
        #gradient-direction {
            flex: 1;
            padding: 8px;
            border-radius: 8px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.2);
            color: white;
            font-size: 0.95rem;
        }
    `;
    document.head.appendChild(gradientStyles);

    const colorPreviewContainer = document.createElement("div");
    colorPreviewContainer.classList.add("colorPreviewContainer");
    document.getElementById("pp-customization-pane-color").querySelector("fieldset").appendChild(colorPreviewContainer);

    colorPreviewContainer.style.textAlign = "center";
    colorPreviewContainer.style.marginTop = "15px";
    colorPreviewContainer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    colorPreviewContainer.style.padding = "10px";
    colorPreviewContainer.style.borderRadius = "10px";
    colorPreviewContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
    colorPreviewContainer.style.display = "flex";
    colorPreviewContainer.style.justifyContent = "center";
    colorPreviewContainer.style.height = "50px";
    colorPreviewContainer.style.width = "100%";
    colorPreviewContainer.innerHTML = "<span style='color: rgba(255,255,255,0.6); align-self: center;'>Color preview</span>";

    const gradientColor1 = document.getElementById("gradient-color-1");
    const gradientColor2 = document.getElementById("gradient-color-2");
    const gradientDirection = document.getElementById("gradient-direction");

    // Set initial gradient colors
    gradientColor1.value = "#3498db";  // Blue
    gradientColor2.value = "#9b59b6";  // Purple

    // Generate a gradient string from the two color pickers
    function generateGradient() {
        const color1 = gradientColor1.value;
        const color2 = gradientColor2.value;
        const direction = gradientDirection.value;
        return `linear-gradient(${direction}, ${color1}, ${color2})`;
    }

    // Update gradient input and preview when gradient pickers change
    function updateGradientFromPickers() {
        const gradientValue = generateGradient();
        gradientColorInput.value = gradientValue;
        colorPreviewContainer.style.background = gradientValue;
        // Clear the solid color input indicator (without triggering an event)
        solidColorInput.value = "#000000";
    }

    gradientColor1.addEventListener("input", updateGradientFromPickers);
    gradientColor2.addEventListener("input", updateGradientFromPickers);
    gradientDirection.addEventListener("change", updateGradientFromPickers);


    updateGradientFromPickers();


    solidColorInput.addEventListener("input", () => {
        const color = solidColorInput.value.trim();
        
        // Clear gradient input when using solid color
        gradientColorInput.value = "";
        
        colorPreviewContainer.innerHTML = "";
        colorPreviewContainer.style.background = color;
    });

    // Preview color when custom gradient is entered
    gradientColorInput.addEventListener("input", () => {
        const gradient = gradientColorInput.value.trim();
        
        // Update preview
        if (gradient) {
            try {
                colorPreviewContainer.innerHTML = "";
                colorPreviewContainer.style.background = gradient;
            } catch (error) {
                // If gradient syntax is invalid, don't apply it
                console.error("Invalid gradient format:", error);
            }
        } else if (gradient === "") {
            // If gradient is cleared, show solid color
            colorPreviewContainer.style.background = solidColorInput.value;
        }
    });


    async function updateProfileColor() {

        const colorValue = gradientColorInput.value.trim() || solidColorInput.value.trim();
        const user = auth.currentUser;

        if (!colorValue) {
            alert("Please select a color or gradient");
            return;
        }

        if (!user) {
            alert("You must be logged in to update your profile color");
            return;
        }

        try {
            // Store in "profileColor" field
            await db.collection("users").doc(user.uid).set({ profileColor: colorValue }, { merge: true });

            // Update the profile panel background with the new color
            const profilePanel = document.getElementById("profilePanel");
            if (profilePanel) {
                profilePanel.style.background = colorValue;
            }

            alert("Profile color updated successfully!");
        } catch (error) {
            alert("Failed to update profile color: " + error.message);
        }
    }

    // Load the user's color when they log in or reload the page
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            const userDoc = await db.collection("users").doc(user.uid).get();
            if (userDoc.exists && userDoc.data().profileColor) {
                const profileColorValue = userDoc.data().profileColor;
                
                // Update the background of profilePanel
                const profilePanel = document.getElementById("profilePanel");
                if (profilePanel) {
                    profilePanel.style.background = profileColorValue;
                }

                // Update the preview
                colorPreviewContainer.innerHTML = "";
                colorPreviewContainer.style.background = profileColorValue;

                // Update the input fields
                if (profileColorValue.includes("gradient")) {
                    gradientColorInput.value = profileColorValue;
                    
                    // Try to parse the gradient colors to set the pickers
                    try {
                        const matches = profileColorValue.match(/linear-gradient\([^,]+,\s*([^,]+),\s*([^)]+)\)/);
                        if (matches && matches.length === 3) {
                            gradientColor1.value = matches[1].trim();
                            gradientColor2.value = matches[2].trim();
                            
                            // Try to set the direction
                            const dirMatch = profileColorValue.match(/linear-gradient\(([^,]+),/);
                            if (dirMatch && dirMatch.length === 2) {
                                const direction = dirMatch[1].trim();
                                if (["to right", "to bottom", "to bottom right", "to bottom left"].includes(direction)) {
                                    gradientDirection.value = direction;
                                }
                            }
                        }
                    } catch (e) {
                        console.error("Couldn't parse existing gradient:", e);
                    }
                } else {
                    // Try to set the color picker if it's a solid color
                    try {
                        solidColorInput.value = profileColorValue;
                        gradientColorInput.value = "";
                    } catch (e) {
                        // If not a valid hex color for the picker, put it in the gradient field
                        gradientColorInput.value = profileColorValue;
                    }
                }
            }
        }
    });

    colorSaveBtn.addEventListener("click", updateProfileColor);





  
      const usernameInput = document.getElementById("username-input");
      const usernameSaveBtn = document.getElementById("username-save-btn");
      
      async function changeUsername() {
        const newUsername = usernameInput.value;
    
        if (newUsername) {
            const user = auth.currentUser;
            try {
                // Update Firebase Authentication
                await user.updateProfile({ displayName: newUsername });
    
                // Update Firestore for the current user
                await db.collection('users').doc(user.uid).update({
                    username: newUsername
                });
    
                // Fetch all users to find those who have the current user in their friends list
                const allUsersSnapshot = await db.collection('users').get();
                const batch = db.batch();
    
                allUsersSnapshot.forEach(doc => {
                    const friendRef = db.collection('users').doc(doc.id);
                    const friendData = doc.data();
    
                    if (friendData.friends) {
                        // Correct the structure of the friends array
                        const updatedFriends = friendData.friends.map(friend =>
                            friend.userId === user.uid
                                ? { 
                                    userId: user.uid, 
                                    username: newUsername, 
                                    profilePicture: user.photoURL || null 
                                  }
                                : friend
                        );
    
                        // Only update if there's a change
                        if (JSON.stringify(updatedFriends) !== JSON.stringify(friendData.friends)) {
                            batch.update(friendRef, { friends: updatedFriends });
                        }
                    }
                });
    
                await batch.commit();
    
                alert("Username updated successfully!");
                window.location.reload(true);
            } catch (error) {
                console.error("Error updating username:", error);
            }
        } else {
            console.log("Username cannot be empty");
        }
    }
    
    
    
      usernameSaveBtn.addEventListener("click", changeUsername); 
  
  

      const aboutMeInput = document.getElementById("aboutme-input");
      const aboutMeSaveBtn = document.getElementById("aboutme-save-btn");
      const aboutMeOfficialP = document.getElementById("aboutme-official-p");
  
  
      const maxLines = 5;
  
  
      aboutMeInput.addEventListener("input", () => {
          const lines = aboutMeInput.value.split("\n"); // Split the value into lines by newline characters
          
          if (lines.length > maxLines) {
              // If the number of lines exceeds maxLines, limit the textarea to maxLines
              // Only keep the first `maxLines` lines and join them back into a string
              aboutMeInput.value = lines.slice(0, maxLines).join("\n");
          }
      });
  
  
      function saveAboutMe() {
          const aboutMeText = aboutMeInput.value.trim();
          const user = firebase.auth().currentUser;
  
          if (user && aboutMeText) {
              // Save the text to Firestore under the user's document
              db.collection("users").doc(user.uid).set({
                  aboutMe: aboutMeText
              }, { merge: true }) // Use merge to only update the aboutMe field without overwriting the entire document
              .then(() => {
                  alert("About Me saved successfully!");
                  aboutMeOfficialP.textContent = aboutMeText;
              })
              .catch(error => {
                  console.error("Error saving About Me:", error);
              });
          } else {
              console.log("About Me is empty or user not signed in");
          }
      }
  
      aboutMeSaveBtn.addEventListener("click", saveAboutMe);
  
  
  
      const socialsInput = document.getElementById("socials-input");
      const socialsSaveBtn = document.getElementById("socials-save-btn");
      const socialsOfficialP = document.getElementById("socials-official-p");
  
      const maxSocialLines = 5;
  
      socialsInput.addEventListener("input", () => {
          const lines = socialsInput.value.split("\n");
  
          if (lines.length > maxSocialLines) {
              socialsInput.value = lines.slice(0, maxSocialLines).join("\n");
          }
      });
  
      // Function to save the Socials content to Firestore
      function saveSocials() {
          const socialsText = socialsInput.value.trim();
          const user = firebase.auth().currentUser;
  
          if (user && socialsText) {
              db.collection("users").doc(user.uid).set({
                  socials: socialsText
              }, { merge: true }) // Only update socials field without overwriting the whole document
              .then(() => {
                  alert("Socials saved successfully!");
                  socialsOfficialP.innerHTML = socialsText.replace(/\n/g, "<br>");
              })
              .catch(error => {
                  console.error("Error saving Socials:", error);
              });
          } else {
              console.log("Socials is empty or user not signed in");
          }
      }
  
      socialsSaveBtn.addEventListener("click", saveSocials);

      window.addEventListener("load", () => {
        document.body.style.opacity = "1";
    });



        








    var rainParticlesCheck = document.getElementById("particlesButtonRain");
    var snowParticlesCheck = document.getElementById("particlesButtonSnow");
    var stormWeatherCheck = document.getElementById("weatherButtonsStorm");
    var blizzardWeatherCheck = document.getElementById("weatherButtonsBlizzard");
  
    const rainGifImage = document.getElementById("rainGifImage");
    const rainGif = document.getElementById("rainGif");
    const particlesButtonRain = document.getElementById("particlesButtonRain");
    // const snowGifImage = document.getElementById("snowGifImage");
    // const snowGif = document.getElementById("snowGif");
    const particlesButtonSnow = document.getElementById("particlesButtonSnow");
    const blizzardGifImage = document.getElementById("blizzardGifImage");
    const blizzardGif = document.getElementById("blizzardGif");
    const weatherButtonsBlizzard = document.getElementById("weatherButtonsBlizzard");
    const weatherButtonsStorm = document.getElementById("weatherButtonsStorm");


    // ------------- START OF PARTICLES BUTTONS JS ----------------

    function enableRainParticles() {

        if (rainGifImage.style.visibility === "visible") {
            rainGifImage.style.visibility = "hidden";
            rainGif.style.visibility = "hidden";
            particlesButtonRain.textContent = "Enable";

            snowParticlesCheck.disabled = false;
            stormWeatherCheck.disabled = false;
            blizzardWeatherCheck.disabled = false;
        } else {
            rainGifImage.style.visibility = "visible";
            rainGif.style.visibility = "visible";
            particlesButtonRain.textContent = "Disable";

            snowParticlesCheck.disabled = true;
            stormWeatherCheck.disabled = true;
            blizzardWeatherCheck.disabled = true;
        }
    }


    if (particlesButtonRain) {
        particlesButtonRain.addEventListener("click", enableRainParticles);
    }




    let snowParticles = null;

    function createSnowParticle() {
    const particle = document.createElement("div");
    particle.classList.add("snow-particle");

    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;

    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `-5vh`;
    particle.style.animationDuration = `${Math.random() * 8 + 5}s`;

    document.body.appendChild(particle);

    setTimeout(() => {
        particle.remove();
    }, 15000);
    }

    function enableSnowParticles() {
    if (snowParticles) {
        stopSnowParticles();
        particlesButtonSnow.textContent = "Enable";
        rainParticlesCheck.disabled = false;
        stormWeatherCheck.disabled = false;
        blizzardWeatherCheck.disabled = false;
    } else {
        startSnowParticles();
        particlesButtonSnow.textContent = "Disable";
        rainParticlesCheck.disabled = true;
        stormWeatherCheck.disabled = true;
        blizzardWeatherCheck.disabled = true;
    }
    }

    function startSnowParticles() {
    stopSnowParticles();
    snowParticles = setInterval(() => {
        createSnowParticle();
    }, 50);
    }

    function stopSnowParticles() {
    if (snowParticles) {
        clearInterval(snowParticles);
        snowParticles = null;
    }
    
    document.querySelectorAll(".snow-particle").forEach((particle) => {
        particle.style.transition = "opacity 0.5s ease-out";
        particle.style.opacity = "0";
        setTimeout(() => particle.remove(), 500);
    });
    }

    if (particlesButtonSnow) {
    particlesButtonSnow.addEventListener("click", enableSnowParticles);
    }


    // ------------- END OF PARTICLES BUTTONS JS ---------------





    // ------------- START OF WEATHER BUTTONS JS ------------------


    function enableBlizzard() {

        if (blizzardGifImage.style.visibility === "visible") {
            blizzardGifImage.style.visibility = "hidden";
            blizzardGif.style.visibility = "hidden";
            weatherButtonsBlizzard.textContent = "Enable";
            rainParticlesCheck.disabled = false;
            snowParticlesCheck.disabled = false;
            stormWeatherCheck.disabled = false;
        } else {
            blizzardGifImage.style.visibility = "visible";
            blizzardGif.style.visibility = "visible";
            weatherButtonsBlizzard.textContent = "Disable";
            rainParticlesCheck.disabled = true;
            snowParticlesCheck.disabled = true;
            stormWeatherCheck.disabled = true;
        }
    }

    if (weatherButtonsBlizzard) {
        weatherButtonsBlizzard.addEventListener("click", enableBlizzard);
    }



    let stormActive = false;
    let lightningInterval;

    function enableStorm() {
        if (stormActive) {
            // Stop the storm
            clearInterval(lightningInterval);
            rainGifImage.style.visibility = "hidden";
            rainGif.style.visibility = "hidden";
            lightningGifImage.style.visibility = "hidden";
            lightningGif.style.visibility = "hidden";
            weatherButtonsStorm.textContent = "Enable";

            rainParticlesCheck.disabled = false;
            snowParticlesCheck.disabled = false;
            blizzardWeatherCheck.disabled = false;
            stormActive = false;
        } else {
            // Start the storm
            rainGifImage.style.visibility = "visible";
            rainGif.style.visibility = "visible";
            lightningGifImage.style.visibility = "visible";
            lightningGif.style.visibility = "visible";
            weatherButtonsStorm.textContent = "Disable";

            rainParticlesCheck.disabled = true;
            snowParticlesCheck.disabled = true;
            blizzardWeatherCheck.disabled = true;
            stormActive = true;

            // Make the lightning alternate positions continuously
            lightningInterval = setInterval(() => {
                let randomPosition = Math.random();

                if (randomPosition < 0.75) {
                    // 75% chance for left or right
                    let isLeftSide = Math.random() < 0.5; // 50% for left, 50% for right
                    if (isLeftSide) {
                        lightningGifImage.style.left = "10px";
                        lightningGifImage.style.transform = "scaleX(1)";
                    } else {
                        lightningGifImage.style.left = "calc(100% - 100px)";
                        lightningGifImage.style.transform = "scaleX(-1)";
                    }
                } else if (randomPosition < 0.9) {
                    // 15% chance for middle-left or middle-right (split equally)
                    let isMiddleLeft = Math.random() < 0.5; // 50% for middle-left, 50% for middle-right
                    if (isMiddleLeft) {
                        lightningGifImage.style.left = "calc(25% - 50px)";
                        lightningGifImage.style.transform = "scaleX(1)";
                        lightningGifImage.style.transformOrigin = "center";
                    } else {
                        lightningGifImage.style.left = "calc(75% - 50px)";
                        lightningGifImage.style.transform = "scaleX(-1)";
                        lightningGifImage.style.transformOrigin = "center";
                    }
                } else {
                    // 5% chance for pure middle
                    lightningGifImage.style.left = "calc(50% - 50px)";
                    lightningGifImage.style.transform = "scaleX(1)";
                    lightningGifImage.style.transformOrigin = "center";
                }

                lightningGifImage.style.opacity = "1";  // Show
                setTimeout(() => lightningGifImage.style.opacity = "0", 350);
            }, 750); // Every 750ms (0.75s)
        }
    }

    if (weatherButtonsStorm) {
        weatherButtonsStorm.addEventListener("click", enableStorm);
    }

    // ------------ END OF WEATHER BUTTONS JS ------------------


    
    
    
    //----------- CODE FOR BACKGROUND IMAGE CHANGING ------------------
    
    // Default wallpaper URL - used for new users
    const DEFAULT_WALLPAPER = "./assets/default-wallpapers/full/bg1.jpg";

    // Reference to wallpaper buttons
    const wallpaperBg1Btn = document.getElementById("wallpaperBg1Btn");
    const wallpaperBg2Btn = document.getElementById("wallpaperBg2Btn");
    const wallpaperBg3Btn = document.getElementById("wallpaperBg3Btn");
    const wallpaperBg4Btn = document.getElementById("wallpaperBg4Btn");

    // Get custom background elements
    const customBgInput = document.getElementById("custom-bg-url");
    const applyBgButton = document.querySelector(".custom-bg-button");

    // Wallpaper URLs - store these for reference
    const wallpapers = {
        1: "./assets/default-wallpapers/full/bg1.jpg",
        2: "./assets/default-wallpapers/full/bg2.gif",
        3: "./assets/default-wallpapers/full/bg3.jpg",
        4: "./assets/default-wallpapers/full/bg4.png"
    };

    // Create preview container and image element
    const bgPreviewContainer = document.createElement("div");
    bgPreviewContainer.className = "bg-preview-container";
    bgPreviewContainer.style.textAlign = "center";
    bgPreviewContainer.style.marginTop = "10px";
    bgPreviewContainer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    bgPreviewContainer.style.padding = "10px";
    bgPreviewContainer.style.borderRadius = "10px";
    bgPreviewContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";
    bgPreviewContainer.style.display = "none";
    bgPreviewContainer.style.justifyContent = "center";

    // Add the preview container after the input row
    if (document.querySelector(".custom-bg-container")) {
        document.querySelector(".custom-bg-container").appendChild(bgPreviewContainer);
    }

    // Create preview image
    const bgPreview = document.createElement("img");
    bgPreview.id = "bg-preview";
    bgPreview.style.maxWidth = "75%";
    bgPreview.style.maxHeight = "150px";
    bgPreview.style.objectFit = "contain";
    bgPreview.style.borderRadius = "10px";
    bgPreview.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 1)";

    bgPreviewContainer.appendChild(bgPreview);

    // Create blur control container
    const blurControlContainer = document.createElement("div");
    blurControlContainer.className = "blur-control-container";
    blurControlContainer.style.marginTop = "15px";
    blurControlContainer.style.padding = "10px";
    blurControlContainer.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
    blurControlContainer.style.borderRadius = "10px";
    blurControlContainer.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.5)";

    // Create blur slider label
    const blurLabel = document.createElement("label");
    blurLabel.htmlFor = "blur-slider";
    blurLabel.textContent = "Background Blur: 0px";
    blurLabel.style.display = "block";
    blurLabel.style.marginBottom = "5px";
    blurLabel.style.fontWeight = "bold";

    // Create blur slider
    const blurSlider = document.createElement("input");
    blurSlider.type = "range";
    blurSlider.id = "blur-slider";
    blurSlider.min = "0";
    blurSlider.max = "20";
    blurSlider.value = "0";
    blurSlider.style.width = "100%";
    blurSlider.style.cursor = "pointer";

    // Add elements to blur control container
    blurControlContainer.appendChild(blurLabel);
    blurControlContainer.appendChild(blurSlider);

    // Add blur control after the preview container
    if (document.querySelector(".custom-bg-container")) {
        document.querySelector(".custom-bg-container").appendChild(blurControlContainer);
    }

    // Initialize the body with the default wallpaper when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Set default background as initial state
        document.body.style.backgroundImage = `url('${DEFAULT_WALLPAPER}')`;
        
        // Show the body after a slight delay to let background load
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
    });

    // Validate image URL including base64 data URLs
    function isValidImageUrl(url) {
        return /\.(jpg|jpeg|png|gif|webp)$/i.test(url) || url.startsWith("data:image");
    }

    // Function to apply wallpaper and update UI
    function applyWallpaper(wallpaperUrl, wallpaperIndex = null) {
        // Apply the background
        document.body.style.backgroundImage = `url('${wallpaperUrl}')`;
        document.body.style.backgroundSize = "cover";
        document.body.style.backgroundPosition = "center";
        document.body.style.backgroundAttachment = "fixed";
        
        // Reset all buttons first
        [wallpaperBg1Btn, wallpaperBg2Btn, wallpaperBg3Btn, wallpaperBg4Btn].forEach(btn => {
            if (btn) {
                btn.textContent = "Choose";
                btn.disabled = false;
            }
        });
        
        // Update the chosen button if it's one of the predefined wallpapers
        if (wallpaperIndex !== null && wallpaperIndex >= 1 && wallpaperIndex <= 4) {
            const selectedButton = document.getElementById(`wallpaperBg${wallpaperIndex}Btn`);
            if (selectedButton) {
                selectedButton.textContent = "Chosen";
                selectedButton.disabled = true;
            }
            
            // Show preview for predefined wallpaper
            showWallpaperPreview(wallpaperUrl);
            
            // Clear custom background input when using predefined wallpaper
            if (customBgInput) {
                customBgInput.value = "";
            }
        }
        
        // Apply current blur setting
        applyBackgroundBlur();
    }

    // Function to show wallpaper preview
    function showWallpaperPreview(wallpaperUrl) {
        if (bgPreview && bgPreviewContainer) {
            bgPreview.src = wallpaperUrl;
            bgPreviewContainer.style.display = "flex";
            
            // Handle image loading errors
            bgPreview.onerror = () => {
                bgPreviewContainer.style.display = "none";
                console.error("Failed to load preview image");
            };
        }
    }

    // Function to apply background blur
    function applyBackgroundBlur() {
        const blurValue = blurSlider.value;
        document.body.style.backdropFilter = `blur(${blurValue}px)`;
        document.body.style.WebkitBackdropFilter = `blur(${blurValue}px)`; // For Safari
        blurLabel.textContent = `Background Blur: ${blurValue}px`;
    }

    // Save wallpaper preference to Firebase - unified function for both predefined and custom
    async function saveWallpaperPreference(wallpaperUrl, wallpaperIndex = null) {
        const user = auth.currentUser;
        
        if (user) {
            try {
                const userDocRef = db.collection('users').doc(user.uid);
                const userDoc = await userDocRef.get();
                
                const wallpaperData = {
                    currentWallpaper: wallpaperUrl,
                    blurAmount: parseInt(blurSlider.value) // Save blur setting
                };
                
                // Save the index if it's a predefined wallpaper
                if (wallpaperIndex !== null) {
                    wallpaperData.wallpaperPreference = wallpaperIndex;
                    // Clear custom background when using predefined
                    wallpaperData.userSettings = {
                        customBackground: null,
                        blurAmount: parseInt(blurSlider.value)
                    };
                } else {
                    // Mark as custom when using custom background
                    wallpaperData.wallpaperPreference = 'custom';
                    wallpaperData.userSettings = {
                        customBackground: wallpaperUrl,
                        blurAmount: parseInt(blurSlider.value)
                    };
                }
                
                if (userDoc.exists) {
                    // Update existing document with merge to preserve other fields
                    await userDocRef.update(wallpaperData);
                } else {
                    // Create new document if it doesn't exist
                    wallpaperData.username = user.displayName || "User"; // Add default username for new users
                    await userDocRef.set(wallpaperData);
                }
                console.log("Wallpaper preference saved successfully!");
            } catch (error) {
                console.error("Error saving wallpaper preference:", error);
            }
        } else {
            console.log("User not signed in, cannot save preference");
        }
    }

    // Load user's wallpaper preference when auth state changes - unified function
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                
                if (userDoc.exists) {
                    // Load blur setting if available
                    if (userDoc.data().userSettings && userDoc.data().userSettings.blurAmount !== undefined) {
                        blurSlider.value = userDoc.data().userSettings.blurAmount;
                        applyBackgroundBlur();
                    } else if (userDoc.data().blurAmount !== undefined) {
                        blurSlider.value = userDoc.data().blurAmount;
                        applyBackgroundBlur();
                    }
                    
                    // Check for custom background first
                    if (userDoc.data().userSettings && userDoc.data().userSettings.customBackground) {
                        const customBgUrl = userDoc.data().userSettings.customBackground;
                        // Update the input field and preview
                        if (customBgInput) {
                            customBgInput.value = customBgUrl;
                            showWallpaperPreview(customBgUrl);
                        }
                        // Apply the custom background
                        applyWallpaper(customBgUrl, null);
                    } 
                    // Check for predefined wallpaper preference
                    else if (userDoc.data().wallpaperPreference) {
                        const wallpaperPref = userDoc.data().wallpaperPreference;
                        // Handle both numeric index and 'custom' value
                        if (wallpaperPref !== 'custom' && wallpapers[wallpaperPref]) {
                            applyWallpaper(wallpapers[wallpaperPref], wallpaperPref);
                        } else {
                            // Fallback to default if preference is invalid
                            applyWallpaper(wallpapers[1], 1);
                        }
                    } else {
                        // No preference found, use default
                        applyWallpaper(wallpapers[1], 1);
                    }
                } else {
                    // No user doc, use default
                    applyWallpaper(wallpapers[1], 1);
                }
            } catch (error) {
                console.error("Error loading wallpaper preference:", error);
                applyWallpaper(wallpapers[1], 1); // Use default on error
            }
        } else {
            // User is signed out, use default wallpaper
            applyWallpaper(wallpapers[1], 1);
        }
    });

    // Wallpaper transition functions with Firebase saving for predefined wallpapers
    async function background1Transition() {
        applyWallpaper(wallpapers[1], 1);
        await saveWallpaperPreference(wallpapers[1], 1);
    }

    async function background2Transition() {
        applyWallpaper(wallpapers[2], 2);
        await saveWallpaperPreference(wallpapers[2], 2);
    }

    async function background3Transition() {
        applyWallpaper(wallpapers[3], 3);
        await saveWallpaperPreference(wallpapers[3], 3);
    }

    async function background4Transition() {
        applyWallpaper(wallpapers[4], 4);
        await saveWallpaperPreference(wallpapers[4], 4);
    }

    // Preview custom background when URL is entered
    if (customBgInput) {
        customBgInput.addEventListener("input", () => {
            const imageUrl = customBgInput.value.trim();
            
            // Clear previous preview
            bgPreview.src = "";
            bgPreviewContainer.style.display = "none"; 

            if (imageUrl && isValidImageUrl(imageUrl)) {
                showWallpaperPreview(imageUrl);
            }
        });
    }

    // Update custom background
    async function updateCustomBackground() {
        const imageUrl = customBgInput.value.trim();
        const user = auth.currentUser;

        if (!imageUrl || !isValidImageUrl(imageUrl)) {
            alert("Please enter a valid image URL");
            return;
        }

        if (!user) {
            alert("You must be logged in to update your background");
            return;
        }

        try {
            // Use the unified save function instead of direct Firestore update
            await saveWallpaperPreference(imageUrl, null);
            
            // Apply the custom background
            applyWallpaper(imageUrl, null);
            
            alert("Background updated successfully!");
        } catch (error) {
            alert("Failed to update background: " + error.message);
        }
    }

    // Handle blur slider changes
    blurSlider.addEventListener("input", () => {
        applyBackgroundBlur();
    });

    // Save blur setting when slider value is changed and released
    blurSlider.addEventListener("change", async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                // Get current wallpaper information
                const userDoc = await db.collection('users').doc(user.uid).get();
                
                if (userDoc.exists) {
                    let wallpaperUrl;
                    let wallpaperIndex = null;
                    
                    if (userDoc.data().userSettings && userDoc.data().userSettings.customBackground) {
                        wallpaperUrl = userDoc.data().userSettings.customBackground;
                    } else if (userDoc.data().wallpaperPreference && userDoc.data().wallpaperPreference !== 'custom') {
                        wallpaperIndex = userDoc.data().wallpaperPreference;
                        wallpaperUrl = wallpapers[wallpaperIndex];
                    } else {
                        wallpaperIndex = 1;
                        wallpaperUrl = wallpapers[1];
                    }
                    
                    // Save with updated blur setting
                    await saveWallpaperPreference(wallpaperUrl, wallpaperIndex);
                }
            } catch (error) {
                console.error("Error saving blur setting:", error);
            }
        }
    });

    // Add event listeners to buttons
    if (wallpaperBg1Btn) {
        wallpaperBg1Btn.addEventListener("click", background1Transition);
    }

    if (wallpaperBg2Btn) {
        wallpaperBg2Btn.addEventListener("click", background2Transition);
    }

    if (wallpaperBg3Btn) {
        wallpaperBg3Btn.addEventListener("click", background3Transition);
    }

    if (wallpaperBg4Btn) {
        wallpaperBg4Btn.addEventListener("click", background4Transition);
    }

    // Add click event listener to the Apply button for custom backgrounds
    if (applyBgButton) {
        applyBgButton.addEventListener("click", updateCustomBackground);
    }




    //------------- END OF WALLPAPER CODE -------------------

    
    
    // Audio player code
  
    let currentSongIndex = null;
    let isAutoplayEnabled = true;
    let isPlaying = false;
    let firstSelectionMade = false;

    const audio = document.getElementById("audio");
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const progress = document.getElementById("progress");
    const progressBar = document.getElementById("progress-bar");
    const progressThumb = document.getElementById("progress-thumb");
    const currentTime = document.getElementById("current-time");
    const totalDuration = document.getElementById("total-duration");
    const playButton = document.getElementById("play-button");
    const prevButton = document.getElementById("prev-button");
    const nextButton = document.getElementById("next-button");
    const volumeSlider = document.getElementById("volume-slider");
    const playlistDropdown = document.getElementById("playlist-dropdown");
    const autoplayButton = document.getElementById("autoplay-button");
    let isDragging = false;

    // Constants for truncation
    const MAX_TITLE_LENGTH = 20;
    const MAX_ARTIST_LENGTH = 20;
    const MAX_DROPDOWN_LENGTH = 40;

    function truncateText(text, maxLength) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    }

    function populatePlaylist() {
        playlistDropdown.innerHTML = "";
        
        // Make sure we have the updated favorites list
        const favoritedSongs = songs.filter(song => favorites.includes(song.title));
        
        // If there are no favorites, show a message
        if (favoritedSongs.length === 0) {
            const messageOption = document.createElement("option");
            messageOption.value = "-1"; // Invalid index to prevent selection
            messageOption.textContent = "Go to Music Tab to add songs";
            messageOption.disabled = true;
            messageOption.selected = true;
            playlistDropdown.appendChild(messageOption);
            
            // Disable the dropdown if there are no songs
            playlistDropdown.disabled = true;
            
            // Reset audio player state
            songTitle.textContent = "Nothing is playing";
            songArtist.textContent = "";
            audio.src = "";
            currentSongIndex = null;
            
            // Disable player controls
            playButton.disabled = true;
            prevButton.disabled = true;
            nextButton.disabled = true;
        } else {
            // Enable the dropdown and controls if there are songs
            playlistDropdown.disabled = false;
            playButton.disabled = false;
            prevButton.disabled = false;
            nextButton.disabled = false;
            
            // Add all favorited songs to the playlist
            favoritedSongs.forEach((song, index) => {
                const option = document.createElement("option");
                option.value = index; // Use the index in the favorites array
                // Apply truncation to dropdown text
                option.textContent = truncateText(`${song.title} - ${song.artist}`, MAX_DROPDOWN_LENGTH);
                playlistDropdown.appendChild(option);
            });
        }
    }

    // Modify the loadSong function to work with the favorites array
    function loadSong(index) {
        // Get the list of favorited songs
        const favoritedSongs = songs.filter(song => favorites.includes(song.title));
        
        // If index is invalid or there are no favorites, do nothing
        if (index < 0 || index >= favoritedSongs.length || favoritedSongs.length === 0) {
            return;
        }
        
        // Load the selected favorited song
        const song = favoritedSongs[index];
        currentSongIndex = index;
        audio.src = song.src;
        
        // Apply truncation to title and artist
        songTitle.textContent = truncateText(song.title, MAX_TITLE_LENGTH);
        songArtist.textContent = truncateText(song.artist, MAX_ARTIST_LENGTH);
        
        playlistDropdown.value = index;
        audio.currentTime = 0;
        
        // Don't automatically play the song
        isPlaying = false;
        playButton.textContent = "▶";
        
        // Track that a selection has been made
        firstSelectionMade = true;
    }

    function playSong() {
        if (!audio.src) return;
        
        audio.play();
        playButton.textContent = "❚❚";
        isPlaying = true;
    }

    function playPause() {
        if (!audio.src || currentSongIndex === null) {
            // If no song is loaded, load the first one from the dropdown
            if (!firstSelectionMade) {
                loadSong(0);
                playSong();
            }
            return;
        }
        
        if (audio.paused) {
            playSong();
        } else {
            audio.pause();
            playButton.textContent = "▶";
            isPlaying = false;
        }
    }

    // Modify nextSong and prevSong functions to work with favorites
    function nextSong() {
        const favoritedSongs = songs.filter(song => favorites.includes(song.title));
        
        if (favoritedSongs.length === 0 || currentSongIndex === null) {
            // If no favorites or no song is currently selected, don't do anything
            return;
        }
        
        currentSongIndex = (currentSongIndex + 1) % favoritedSongs.length;
        loadSong(currentSongIndex);
        
        if (isPlaying) {
            playSong();
        }
    }

    function prevSong() {
        const favoritedSongs = songs.filter(song => favorites.includes(song.title));
        
        if (favoritedSongs.length === 0 || currentSongIndex === null) {
            // If no favorites or no song is currently selected, don't do anything
            return;
        }
        
        currentSongIndex = (currentSongIndex - 1 + favoritedSongs.length) % favoritedSongs.length;
        loadSong(currentSongIndex);
        
        if (isPlaying) {
            playSong();
        }
    }

    autoplayButton.addEventListener("click", () => {
        isAutoplayEnabled = !isAutoplayEnabled;
        autoplayButton.textContent = `Autoplay: ${isAutoplayEnabled ? "On" : "Off"}`;
    });

    function updateMainPlayerPlaylist() {
        populatePlaylist();
        
        // If a song is currently playing and it's no longer in favorites, stop playback
        if (currentSongIndex !== null) {
            const favoritedSongs = songs.filter(song => favorites.includes(song.title));
            
            // Check if the current song index is still valid for the favorites list
            if (currentSongIndex >= favoritedSongs.length) {
                // Reset player state
                audio.pause();
                audio.src = "";
                songTitle.textContent = "Nothing is playing";
                songArtist.textContent = "";
                playButton.textContent = "▶";
                isPlaying = false;
                currentSongIndex = null;
            }
        }
    }

    audio.addEventListener("ended", () => {
        if (isAutoplayEnabled) {
            nextSong();
        } else {
            playButton.textContent = "▶";
            isPlaying = false;
        }
    });

    playButton.addEventListener("click", playPause);
    nextButton.addEventListener("click", nextSong);
    prevButton.addEventListener("click", prevSong);

    playlistDropdown.addEventListener("change", (e) => {
        // Load the selected song
        loadSong(parseInt(e.target.value));
        playSong(); // Automatically play when a song is selected from dropdown
    });

    audio.addEventListener("timeupdate", () => {
        if (audio.duration) {
            progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
            progressThumb.style.left = `${(audio.currentTime / audio.duration) * 100}%`;
            currentTime.textContent = formatTime(audio.currentTime);
            totalDuration.textContent = formatTime(audio.duration);
        }
    });


    progressThumb.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent default drag behavior
        isDragging = true;
        let wasPlaying = false;
    
        const progressBarRect = progressBar.getBoundingClientRect();
        const initialOffset = progressBarRect.left;
    
        if (!audio.paused) {
            wasPlaying = true;
            audio.pause();
        }
    
        const onMouseMove = (moveEvent) => {
            if (!isDragging) return;
            
            const mouseX = moveEvent.clientX - initialOffset;
            
            const newX = Math.max(0, Math.min(mouseX, progressBarRect.width));
            
            const newProgress = (newX / progressBarRect.width) * 100;
            
            progress.style.width = `${newProgress}%`;
            progressThumb.style.left = `${newProgress}%`;
            
            audio.currentTime = (newX / progressBarRect.width) * audio.duration;
        };
        
        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
    
            if (wasPlaying) {
                audio.play();
            }
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });


    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
    });

    progressBar.addEventListener("click", (e) => {
        if (!audio.src || currentSongIndex === null) return;
        
        const progressBarRect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - progressBarRect.left;
        const width = progressBarRect.width;
        
        const newProgress = (clickX / width) * 100;
        
        progress.style.width = `${newProgress}%`;
        progressThumb.style.left = `${newProgress}%`;
        audio.currentTime = (clickX / width) * audio.duration;
    });

    function formatTime(seconds) {
        if (isNaN(seconds) || seconds === undefined) {
            return "0:00";
        }
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    window.onload = () => {
        // Get user data from Firebase first
        const user = auth.currentUser;
        if (user) {
            db.collection('users').doc(user.uid).get()
                .then(userDoc => {
                    const userData = userDoc.data();
                    if (userData) {
                        favorites = userData.favoriteSongs || [];
                        recentlyPlayed = userData.recentlyPlayed || [];
                    }
                    // Now populate the playlist with favorites
                    populatePlaylist();
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                    populatePlaylist(); // Still call populate with empty favorites
                });
        } else {
            // If not logged in, just use empty favorites
            favorites = [];
            populatePlaylist();
        }
        
        // Initialize with "Nothing is playing" text
        songTitle.textContent = "Nothing is playing";
        songArtist.textContent = "";
        
        // Don't load any song initially
        audio.src = "";
        currentSongIndex = null;
        
        // Set initial values for time displays
        currentTime.textContent = "0:00";
        totalDuration.textContent = "0:00";
        
        // Ensure play button shows "play" initially
        playButton.textContent = "▶";
        
        // Default volume
        audio.volume = volumeSlider.value;
    };

  // ------------- END OF AUDIO PLAYER CODE -----------------


  // ------------- START OF MUSIC PANEL CODE ----------------

  const musicPanel = document.getElementById("musicPanel");
  const musicPanelOpen = document.getElementById("music-sp-btn");
  const musicPanelOverlay = document.getElementById("musicPanelOverlay");

  let currentFilter = 'all';

  if (musicPanelOpen) {
      musicPanelOpen.addEventListener("click", () => {
          if (typeof sideBar !== 'undefined' && sideBar) {
              sideBar.style.transform = "translateX(-100%)";
              sideBar.style.pointerEvents = "none";
          }
          
          if (typeof sidePanelOverlay !== 'undefined' && sidePanelOverlay) {
              sidePanelOverlay.style.display = "none";
          }

          setTimeout(() => {
              musicPanel.style.opacity= "1";
              musicPanel.style.pointerEvents = "auto";
          }, 100);

          musicPanelOverlay.style.display = "block";
      });
  }

  musicPanelOverlay.addEventListener("click", () => {
      // Stop any currently playing preview when closing the panel
      if (currentPreviewIndex !== -1 && !audioPreview.paused) {
          stopCurrentPreview();
          
          // Reset all preview buttons to show play icon
          document.querySelectorAll('.preview-button').forEach(button => {
              button.innerHTML = `
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
              `;
              button.dataset.tooltip = "Preview";
          });
      }
      
      musicPanel.style.opacity= "0";
      musicPanel.style.pointerEvents = "none";
      musicPanelOverlay.style.display = "none";
  });



  // Music Panel Elements
  const musicList = document.getElementById('musicList');
  const searchBar = document.getElementById('searchBar');
  const currentSongTitle = document.getElementById('currentSongTitle');
  const equalizer = document.getElementById('equalizer');
  const filterTabs = document.querySelectorAll('.filter-tab');

  // Audio object for previews
  let audioPreview = new Audio();
  let currentPreviewIndex = -1;
  let previewDuration = 15000; // 15 seconds preview
  let previewTimer;
  let favorites = [];
  let recentlyPlayed = [];

  // Maximum number of recently played songs to store
  const MAX_RECENT_SONGS = 5;

  // Initialize the music list
  async function initializeMusicList() {
      // Get user data from Firebase
      await getUserData();
      
      renderSongList(songs);
      
      // Setup event listeners
      searchBar.addEventListener('input', handleSearch);
      filterTabs.forEach(tab => {
          tab.addEventListener('click', handleFilter);
      });
  }

  // Ensure the audio player's playlist is updated when user data is loaded
  async function getUserData() {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          
          if (userData) {
              favorites = userData.favoriteSongs || [];
              recentlyPlayed = userData.recentlyPlayed || [];
              
              // Update the main player's playlist whenever favorites are loaded
              updateMainPlayerPlaylist();
          }
      } catch (error) {
          console.error("Error fetching user data:", error);
      }
  }

  // Update user data in Firebase
  async function updateUserData(field, data) {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
          await db.collection('users').doc(user.uid).update({
              [field]: data
          });
      } catch (error) {
          // If the document doesn't exist, create it
          if (error.code === 'not-found') {
              await db.collection('users').doc(user.uid).set({
                  [field]: data
              });
          } else {
              console.error(`Error updating ${field}:`, error);
          }
      }
  }

  // Apply the current filter
  function applyCurrentFilter() {
      let filteredSongs = [];
      
      switch(currentFilter) {
          case 'all':
              filteredSongs = songs;
              break;
          case 'favorites':
              filteredSongs = songs.filter(song => favorites.includes(song.title));
              break;
          case 'recent':
              filteredSongs = songs.filter(song => recentlyPlayed.includes(song.title));
              break;
          default:
              filteredSongs = songs.filter(song => song.genre === currentFilter);
      }
      
      renderSongList(filteredSongs);
  }

  // Render song list based on filter
  function renderSongList(songList) {
      musicList.innerHTML = '';
      
      if (songList.length === 0) {
          musicList.innerHTML = `
              <div class="empty-results">
                  <div class="empty-icon">🔍</div>
                  <div>No songs found</div>
              </div>
          `;
          return;
      }
      
      songList.forEach((song, index) => {
          const isFavorite = favorites.includes(song.title);
          const listItem = document.createElement('li');
          listItem.className = 'music-list-item';
          listItem.dataset.index = index;
          listItem.dataset.songTitle = song.title; // Add song title as data attribute
          
          // Determine if this is the currently playing song
          const isPlaying = index === currentPreviewIndex && !audioPreview.paused;
          if (isPlaying) {
              listItem.classList.add('playing');
          }
          
          listItem.innerHTML = `
              <div class="song-info">
                  <div class="song-title">${song.title}</div>
                  <div class="song-artist">${song.artist}</div>
              </div>
              <div class="preview-controls">
                  <div class="preview-progress">
                      <div class="preview-bar" id="preview-bar-${index}"></div>
                  </div>
                  <button class="preview-button tooltip" data-tooltip="${isPlaying ? 'Pause' : 'Preview'}" data-index="${index}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          ${isPlaying ? 
                              `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>` : 
                              `<polygon points="5 3 19 12 5 21 5 3"></polygon>`
                          }
                      </svg>
                  </button>
                  <button class="action-button tooltip" data-tooltip="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}" data-action="favorite" data-song="${song.title}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                  </button>
              </div>
          `;
          
          musicList.appendChild(listItem);
      });
      
      document.querySelectorAll('.preview-button').forEach(button => {
          button.addEventListener('click', handlePreviewClick);
      });
      
      document.querySelectorAll('[data-action="favorite"]').forEach(button => {
          button.addEventListener('click', handleFavoriteClick);
      });
      
      // If there's a currently playing song, update its progress bar
      if (currentPreviewIndex !== -1 && !audioPreview.paused) {
          const previewBar = document.getElementById(`preview-bar-${currentPreviewIndex}`);
          if (previewBar) {
              // Calculate progress based on current time
              const elapsed = Date.now() - (previewStartTime || Date.now());
              const progress = Math.min((elapsed / previewDuration) * 100, 100);
              previewBar.style.width = `${progress}%`;
          }
      }
  }

  // Handle search functionality
  function handleSearch() {
      const searchTerm = searchBar.value.toLowerCase();
      const filteredSongs = songs.filter(song => 
          song.title.toLowerCase().includes(searchTerm) || 
          song.artist.toLowerCase().includes(searchTerm)
      );
      
      renderSongList(filteredSongs);
  }

  // Handle filter tabs
  function handleFilter(e) {
      const filter = e.target.dataset.filter;
      currentFilter = filter;
      
      // Update active class
      filterTabs.forEach(tab => tab.classList.remove('active'));
      e.target.classList.add('active');
      
      applyCurrentFilter();
  }

  function startPreviewProgressUpdate() {
      // Clear any existing timers
      if (previewTimer) {
          clearInterval(previewTimer);
      }
      
      // Update progress bar
      let startTime = Date.now();
      
      previewTimer = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min((elapsed / previewDuration) * 100, 100);
          
          // Find all progress bars for this song in all views
          if (currentPreviewIndex !== -1) {
              // Find in standard view
              const mainViewBar = document.getElementById(`preview-bar-${currentPreviewIndex}`);
              if (mainViewBar) {
                  mainViewBar.style.width = `${progress}%`;
              }
              
              // Get the song title
              const currentSong = songs[currentPreviewIndex]?.title;
              if (currentSong) {
                  // Find progress bars in playlist view by song title attribute
                  document.querySelectorAll(`.music-list-item[data-song-title="${currentSong}"] .preview-bar`).forEach(bar => {
                      bar.style.width = `${progress}%`;
                  });
                  
                  // For playlist views, we need to check by looking at data attributes
                  document.querySelectorAll(`.music-list-item[data-index="${currentPreviewIndex}"] .preview-bar`).forEach(bar => {
                      bar.style.width = `${progress}%`;
                  });
              }
          }
          
          // Stop preview after duration
          if (elapsed >= previewDuration) {
              stopCurrentPreview();
              
              // Reset all play buttons to show play icon
              document.querySelectorAll('.preview-button').forEach(button => {
                  button.innerHTML = `
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                  `;
                  button.dataset.tooltip = "Preview";
              });
          }
      }, 100);
  }

  // Track preview start time
  let previewStartTime;

  function handlePreviewClick(e) {
    const button = e.currentTarget;
    const listItem = button.closest('.music-list-item');
    const songTitle = listItem.dataset.songTitle;
    
    // Find the song in the original songs array by title
    const song = songs.find(s => s.title === songTitle);
    const index = songs.findIndex(s => s.title === songTitle);
    
    if (!song) {
        console.error("Song not found:", songTitle);
        return;
    }
    
    // If clicking the currently playing song, pause it
    if (currentPreviewIndex === index && !audioPreview.paused) {
        pausePreview();
        
        // Update button to show play icon
        button.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
        `;
        button.dataset.tooltip = "Preview";
        return;
    }
    
    // Stop any currently playing preview
    if (currentPreviewIndex !== -1) {
        stopCurrentPreview();
    }
    
    // Pause the main audio player if it's playing and update the icon
    if (audio && !audio.paused) {
        audio.pause();
        // Make sure to update the main player's play button
        document.getElementById("play-button").textContent = "▶";
        isPlaying = false;
    }
    
    // Update current preview index
    currentPreviewIndex = index;
    
    // Start new preview
    startPreview(song);
    
    // Update button to show pause icon
    button.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
        </svg>
    `;
    button.dataset.tooltip = "Pause";
    
    // Update UI
    updatePlayingState(index, songTitle);
    
    addToRecentlyPlayed(song.title);
}

  function startPreview(song) {
      // Set audio source
      audioPreview.src = song.src || "https://example.com/audio/demo.mp3"; // Fallback URL if needed
      
      // Set random start time between 30-60 seconds (for a more interesting preview)
      const randomStart = Math.floor(Math.random() * 30) + 30;
      
      // Update UI
      currentSongTitle.textContent = `Now previewing: ${song.title}`;
      equalizer.classList.add('active-eq');
      
      // Store the preview start time
      previewStartTime = Date.now();
      
      // Try to play immediately without waiting for canplaythrough
      try {
          audioPreview.currentTime = randomStart;
          
          // Force play and handle any errors
          const playPromise = audioPreview.play();
          
          if (playPromise !== undefined) {
              playPromise.then(_ => {
                  // Playback started successfully
                  startPreviewProgressUpdate();
              }).catch(error => {
                  console.error("Playback error:", error);
                  // Try once more with a delay
                  setTimeout(() => {
                      audioPreview.play()
                          .then(() => startPreviewProgressUpdate())
                          .catch(err => console.error("Second attempt failed:", err));
                  }, 300);
              });
          }
      } catch (error) {
          console.error("Error starting preview:", error);
          // Fallback to the event listener approach
          audioPreview.addEventListener('canplaythrough', function() {
              try {
                  audioPreview.currentTime = randomStart;
                  audioPreview.play();
                  startPreviewProgressUpdate();
              } catch (e) {
                  console.error("Error in canplaythrough:", e);
                  stopCurrentPreview();
              }
          }, { once: true });
      }
      
      audioPreview.addEventListener('error', function() {
          console.error("Error loading audio:", audioPreview.error);
          stopCurrentPreview();
      });
  }

  function pausePreview() {
      audioPreview.pause();
      clearInterval(previewTimer);
      equalizer.classList.remove('active-eq');
      
      const playingItem = document.querySelector('.music-list-item.playing');
      if (playingItem) {
          playingItem.classList.remove('playing');
      }
      
      currentSongTitle.textContent = 'Select a track';
  }

  function stopCurrentPreview() {
      pausePreview();
      
      // Reset progress bar for previous song
      if (currentPreviewIndex !== -1) {
          const prevBar = document.getElementById(`preview-bar-${currentPreviewIndex}`);
          if (prevBar) {
              prevBar.style.width = '0%';
          }
      }
      
      currentPreviewIndex = -1;
  }

  // Updated updatePlayingState to handle both index and title
    function updatePlayingState(index, songTitle) {
        // Remove playing class from all items
        document.querySelectorAll('.music-list-item').forEach(item => {
            item.classList.remove('playing');
        });
        
        // Add playing class to items with matching song title
        document.querySelectorAll(`.music-list-item[data-song-title="${songTitle}"]`).forEach(item => {
            item.classList.add('playing');
        });
    }

  async function handleFavoriteClick(e) {
      e.stopPropagation();
      const songTitle = e.currentTarget.dataset.song;
      const songElement = e.currentTarget.closest('.music-list-item');
      const isFavoriteNow = !favorites.includes(songTitle);
      
      // Update favorites array
      if (isFavoriteNow) {
          // Add to favorites
          favorites.push(songTitle);
          e.currentTarget.querySelector('svg').setAttribute('fill', 'currentColor');
          e.currentTarget.dataset.tooltip = 'Remove from favorites';
      } else {
          // Remove from favorites
          favorites = favorites.filter(title => title !== songTitle);
          e.currentTarget.querySelector('svg').setAttribute('fill', 'none');
          e.currentTarget.dataset.tooltip = 'Add to favorites';
      }
      
      // Save to Firebase
      await updateUserData('favoriteSongs', favorites);
      
      // If we're in the favorites tab AND removing a favorite
      if (currentFilter === 'favorites' && !isFavoriteNow) {
          // Find the song in the global songs array for future reference
          const songObj = songs.find(s => s.title === songTitle);
          
          // Animate removal
          if (songElement) {
              songElement.style.transition = 'opacity 0.3s, transform 0.3s';
              songElement.style.opacity = '0';
              songElement.style.transform = 'translateX(20px)';
              
              // Remove after animation
              setTimeout(() => {
                  applyCurrentFilter();
              }, 300);
          } else {
              applyCurrentFilter();
          }
      }
      
      // Update the main player's playlist to reflect the changes
      updateMainPlayerPlaylist();
  }

  // Add song to recently played
  async function addToRecentlyPlayed(songTitle) {
      // Remove if already in list
      recentlyPlayed = recentlyPlayed.filter(title => title !== songTitle);
      
      // Add to beginning
      recentlyPlayed.unshift(songTitle);
      
      // Limit to MAX_RECENT_SONGS items
      if (recentlyPlayed.length > MAX_RECENT_SONGS) {
          recentlyPlayed = recentlyPlayed.slice(0, MAX_RECENT_SONGS);
      }
      
      // Save to Firebase
      await updateUserData('recentlyPlayed', recentlyPlayed);
      
      // Refresh the view if currently on recent tab
      if (currentFilter === 'recent') {
          applyCurrentFilter();
      }
  }

  document.querySelectorAll('.tab-button').forEach(button => {
      button.addEventListener('click', () => {
          // Remove active class from all tab buttons
          document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
          // Add active class to the clicked tab button
          button.classList.add('active');

          // Hide all tab contents
          document.querySelectorAll('.tab-content').forEach(content => content.style.display = 'none');
          // Show the corresponding tab content
          const tabContent = document.getElementById(button.getAttribute('data-tab'));
          if (tabContent) {
              tabContent.style.display = 'block';
          }
      });
  });


  // Add event listener for the My Favorites button
  document.querySelector('.my-favorites-openBtn').addEventListener('click', function() {
      showFavoritesList();
  });

  // Function to reattach event listeners after HTML restoration
  function reattachLibraryEventListeners() {
      // Reattach event listeners for favorites button
      const favoritesBtn = document.querySelector('.my-favorites-openBtn');
      if (favoritesBtn) {
          favoritesBtn.addEventListener('click', function() {
              showFavoritesList();
          });
      }
      
      // Reattach event listeners for create playlist button
      const createPlaylistBtn = document.querySelector('.create-playlist-btn');
      if (createPlaylistBtn) {
          createPlaylistBtn.addEventListener('click', function() {
              showCreatePlaylistDialog();
          });
      }
      
      // Reattach playlist item click listeners
      document.querySelectorAll('.playlist-item').forEach(item => {
          item.addEventListener('click', function(e) {
              if (!e.target.closest('.playlist-actions')) {
                  const playlistId = parseInt(this.dataset.playlistId);
                  openPlaylist(playlistId);
              }
          });
      });
      
      // Reattach edit and delete button listeners
      document.querySelectorAll('.edit-playlist').forEach(button => {
          button.addEventListener('click', function(e) {
              e.stopPropagation();
              const playlistId = parseInt(this.dataset.playlistId);
              showEditPlaylistDialog(playlistId);
          });
      });
      
      document.querySelectorAll('.delete-playlist').forEach(button => {
          button.addEventListener('click', function(e) {
              e.stopPropagation();
              const playlistId = parseInt(this.dataset.playlistId);
              showDeletePlaylistConfirmation(playlistId);
          });
      });
  }

  // Function to display the user's favorite songs (Spotify style)
  function showFavoritesList() {
      const myLibraryContainer = document.querySelector('.my-library-container');
      
      // Store the original content to be restored
      if (!myLibraryContainer.getAttribute('data-original-content')) {
          myLibraryContainer.setAttribute('data-original-content', myLibraryContainer.innerHTML);
      }
      
      // Clear the container
      myLibraryContainer.innerHTML = '';
      
      // Create breadcrumb navigation
      const breadcrumb = document.createElement('div');
      breadcrumb.className = 'library-breadcrumb';
      breadcrumb.innerHTML = `
          <span class="breadcrumb-item" data-action="back-to-library">My Library</span>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-item active">My Favorites</span>
      `;
      myLibraryContainer.appendChild(breadcrumb);
      
      // Add back button functionality
      breadcrumb.querySelector('[data-action="back-to-library"]').addEventListener('click', function() {
          // Don't call updateMyLibraryTab() directly as it rebuilds everything
          // Instead, restore the previous state if available, or rebuild if needed
          if (myLibraryContainer.getAttribute('data-original-content')) {
              myLibraryContainer.innerHTML = myLibraryContainer.getAttribute('data-original-content');
              // Reattach event listeners after restoring HTML
              reattachLibraryEventListeners();
          } else {
              updateMyLibraryTab();
          }
      });
      
      // Create favorites header
      const favoritesHeader = document.createElement('div');
      favoritesHeader.className = 'favorites-header';
      favoritesHeader.innerHTML = `
          <h2>My Favorite Songs</h2>
          <div class="favorites-stats">${favorites.length} songs</div>
      `;
      myLibraryContainer.appendChild(favoritesHeader);
      
      // Create list container
      const favoritesListContainer = document.createElement('div');
      favoritesListContainer.className = 'favorites-content';
      
      // Create the actual list
      const favoritesListEl = document.createElement('ul');
      favoritesListEl.className = 'music-list favorites-list';
      
      // Filter songs to only include favorites
      const favoriteSongs = songs.filter(song => favorites.includes(song.title));
      
      // Check if there are any favorites
      if (favoriteSongs.length === 0) {
          const emptyMessage = document.createElement('div');
          emptyMessage.className = 'empty-favorites';
          emptyMessage.innerHTML = `
              <div class="empty-icon">💔</div>
              <p>You haven't added any favorites yet</p>
              <p>Go to Discover tab and click ♡ on songs you like</p>
          `;
          favoritesListContainer.appendChild(emptyMessage);
      } else {
          // Add each favorite song to the list
          favoriteSongs.forEach((song, index) => {
              const listItem = document.createElement('li');
              listItem.className = 'music-list-item';
              listItem.dataset.index = songs.findIndex(s => s.title === song.title); // Original index in full songs array
              listItem.dataset.songTitle = song.title;
              
              // Check if this song is currently playing
              const songIndex = songs.findIndex(s => s.title === song.title);
              const isPlaying = songIndex === currentPreviewIndex && !audioPreview.paused;
              
              if (isPlaying) {
                  listItem.classList.add('playing');
              }
              
              listItem.innerHTML = `
                  <div class="song-info">
                      <div class="song-title">${song.title}</div>
                      <div class="song-artist">${song.artist}</div>
                  </div>
                  <div class="preview-controls">
                      <div class="preview-progress">
                          <div class="preview-bar" id="preview-bar-fav-${index}"></div>
                      </div>
                      <button class="preview-button tooltip" data-tooltip="${isPlaying ? 'Pause' : 'Preview'}" data-index="${songIndex}">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              ${isPlaying ? 
                                  `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>` : 
                                  `<polygon points="5 3 19 12 5 21 5 3"></polygon>`
                              }
                          </svg>
                      </button>
                      <button class="action-button tooltip" data-tooltip="Remove from favorites" data-action="favorite" data-song="${song.title}">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                          </svg>
                      </button>
                  </div>
              `;
              
              favoritesListEl.appendChild(listItem);
          });
      }
      
      favoritesListContainer.appendChild(favoritesListEl);
      myLibraryContainer.appendChild(favoritesListContainer);
      
      // Add event listeners to preview buttons
      const previewButtons = myLibraryContainer.querySelectorAll('.preview-button');
      previewButtons.forEach(button => {
          button.addEventListener('click', handlePreviewClick);
      });
      
      // Add event listeners to favorite buttons
      const favoriteButtons = myLibraryContainer.querySelectorAll('[data-action="favorite"]');
      favoriteButtons.forEach(button => {
          button.addEventListener('click', function(e) {
              handleFavoriteClick(e);
              // After removing from favorites, check if we need to remove this item from the list
              setTimeout(() => {
                  if (!favorites.includes(e.currentTarget.dataset.song)) {
                      const itemToRemove = e.currentTarget.closest('.music-list-item');
                      if (itemToRemove) {
                          itemToRemove.style.transition = 'opacity 0.3s, transform 0.3s';
                          itemToRemove.style.opacity = '0';
                          itemToRemove.style.transform = 'translateX(20px)';
                          
                          setTimeout(() => {
                              itemToRemove.remove();
                              // If that was the last item, show empty message
                              if (favoritesListEl.children.length === 0) {
                                  // Update the favorites stats to show 0 songs
                                  document.querySelector('.favorites-stats').textContent = '0 songs';
                                  
                                  // Show empty state
                                  const emptyMessage = document.createElement('div');
                                  emptyMessage.className = 'empty-favorites';
                                  emptyMessage.innerHTML = `
                                      <div class="empty-icon">💔</div>
                                      <p>You haven't added any favorites yet</p>
                                      <p>Go to Discover tab and click ♡ on songs you like</p>
                                  `;
                                  favoritesListContainer.innerHTML = '';
                                  favoritesListContainer.appendChild(emptyMessage);
                              } else {
                                  // Update the favorites stats count
                                  document.querySelector('.favorites-stats').textContent = 
                                      `${favoritesListEl.children.length} songs`;
                              }
                          }, 300);
                      }
                  }
              }, 100);
          });
      });
  }



  // Initialize playlists array and current selected playlist
  let userPlaylists = [];
  let currentPlaylist = null;

  // Function to initialize playlists from Firebase or local storage
  async function initializePlaylists() {
      const user = auth.currentUser;
      if (!user) return;
      
      try {
          const userDoc = await db.collection('users').doc(user.uid).get();
          const userData = userDoc.data();
          
          if (userData && userData.playlists) {
              userPlaylists = userData.playlists;
          } else {
              // Default empty playlists array
              userPlaylists = [];
              // Save to Firebase
              await updateUserData('playlists', userPlaylists);
          }
      } catch (error) {
          console.error("Error fetching playlists:", error);
          userPlaylists = [];
      }
      
      // Update the My Library tab to show playlists section
      updatePlaylistsSection();
  }

  // Update the My Library tab to include playlists
  function updateMyLibraryTab() {
      const myLibraryContainer = document.querySelector('.my-library-container');
      
      // Clear existing content
      myLibraryContainer.innerHTML = '';
      
      // Create sections container
      const sectionsContainer = document.createElement('div');
      sectionsContainer.className = 'library-sections-container';
      
      // Add Favorites section
      const favoritesSection = document.createElement('div');
      favoritesSection.className = 'library-section my-favorites-ml-container';
      favoritesSection.innerHTML = `
          <div class="my-favorites-openBtn">♡</div>
          <h4>My Favorites</h4>
      `;
      sectionsContainer.appendChild(favoritesSection);
      
      // Add Playlists section
      const playlistsSection = document.createElement('div');
      playlistsSection.className = 'library-section playlists-section';
      playlistsSection.innerHTML = `
          <div class="playlist-section-header">
              <button class="create-playlist-btn">
                  <img src="./assets/elements/plus.png" alt="Create Playlist" class="plus-icon">
              </button>
          </div>
          <div class="playlists-container"></div>
      `;
      sectionsContainer.appendChild(playlistsSection);
      
      myLibraryContainer.appendChild(sectionsContainer);
      
      // Attach event listeners
      document.querySelector('.my-favorites-openBtn').addEventListener('click', function() {
          showFavoritesList();
      });
      
      document.querySelector('.create-playlist-btn').addEventListener('click', function() {
          showCreatePlaylistDialog();
      });
      
      // Update playlists section
      updatePlaylistsSection();
  }

  // Update the playlists section with current playlists
  function updatePlaylistsSection() {
      const playlistsContainer = document.querySelector('.playlists-container');
      if (!playlistsContainer) return;
      
      playlistsContainer.innerHTML = '';
      
      if (userPlaylists.length === 0) {
          // Show empty state
          const emptyPlaylists = document.createElement('div');
          emptyPlaylists.className = 'empty-playlists';
          emptyPlaylists.innerHTML = `
              <p>No playlists yet. Create your first playlist!</p>
          `;
          playlistsContainer.appendChild(emptyPlaylists);
          return;
      }
      
      // Create playlist list
      const playlistList = document.createElement('ul');
      playlistList.className = 'playlists-list';
      
      userPlaylists.forEach((playlist, index) => {
          const playlistItem = document.createElement('li');
          playlistItem.className = 'playlist-item';
          playlistItem.dataset.playlistId = index;
          
          const songCount = playlist.songs.length;
          
          playlistItem.innerHTML = `
              <div class="playlist-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                  </svg>
              </div>
              <div class="playlist-info">
                  <div class="playlist-name">${playlist.name}</div>
                  <div class="playlist-count">${songCount} ${songCount === 1 ? 'song' : 'songs'}</div>
              </div>
              <div class="playlist-actions">
                  <button class="playlist-action-btn edit-playlist" data-playlist-id="${index}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                  </button>
                  <button class="playlist-action-btn delete-playlist" data-playlist-id="${index}">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                  </button>
              </div>
          `;
          
          playlistList.appendChild(playlistItem);
      });
      
      playlistsContainer.appendChild(playlistList);
      
      // Attach event listeners to playlist items
      document.querySelectorAll('.playlist-item').forEach(item => {
          item.addEventListener('click', function(e) {
              // Only open playlist if not clicking on action buttons
              if (!e.target.closest('.playlist-actions')) {
                  const playlistId = parseInt(this.dataset.playlistId);
                  openPlaylist(playlistId);
              }
          });
      });
      
      // Attach event listeners to edit and delete buttons
      document.querySelectorAll('.edit-playlist').forEach(button => {
          button.addEventListener('click', function(e) {
              e.stopPropagation();
              const playlistId = parseInt(this.dataset.playlistId);
              showEditPlaylistDialog(playlistId);
          });
      });
      
      document.querySelectorAll('.delete-playlist').forEach(button => {
          button.addEventListener('click', function(e) {
              e.stopPropagation();
              const playlistId = parseInt(this.dataset.playlistId);
              showDeletePlaylistConfirmation(playlistId);
          });
      });
  }

  // Show create playlist dialog
  function showCreatePlaylistDialog() {
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'modal-overlay';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalContent.innerHTML = `
          <div class="modal-header">
              <h3>Create New Playlist</h3>
              <button class="modal-close">×</button>
          </div>
          <div class="modal-body">
              <div class="form-group">
                  <label for="playlist-name">Playlist Name</label>
                  <input type="text" id="playlist-name" placeholder="My Awesome Playlist">
              </div>
              <div class="form-group">
                  <label for="playlist-description">Description (optional)</label>
                  <textarea id="playlist-description" placeholder="Describe your playlist..."></textarea>
              </div>
          </div>
          <div class="modal-footer">
              <button class="modal-cancel">Cancel</button>
              <button class="modal-create">Create Playlist</button>
          </div>
      `;
      
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
      
      // Focus the name input
      setTimeout(() => {
          document.getElementById('playlist-name').focus();
      }, 100);
      
      // Event listeners
      modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      modalOverlay.querySelector('.modal-cancel').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      modalOverlay.querySelector('.modal-create').addEventListener('click', async () => {
          const name = document.getElementById('playlist-name').value.trim();
          const description = document.getElementById('playlist-description').value.trim();
          
          if (!name) {
              alert('Please enter a playlist name');
              return;
          }
          
          // Create new playlist
          const newPlaylist = {
              name: name,
              description: description,
              songs: [],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
          };
          
          userPlaylists.push(newPlaylist);
          
          // Save to Firebase
          await updateUserData('playlists', userPlaylists);
          
          // Update UI
          updatePlaylistsSection();
          
          // Remove modal
          modalOverlay.remove();
          
          // Open the new playlist
          openPlaylist(userPlaylists.length - 1);
      });
  }

  // Show edit playlist dialog
  function showEditPlaylistDialog(playlistId) {
      const playlist = userPlaylists[playlistId];
      if (!playlist) return;
      
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'modal-overlay';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalContent.innerHTML = `
          <div class="modal-header">
              <h3>Edit Playlist</h3>
              <button class="modal-close">×</button>
          </div>
          <div class="modal-body">
              <div class="form-group">
                  <label for="playlist-name">Playlist Name</label>
                  <input type="text" id="playlist-name" value="${playlist.name}" placeholder="My Awesome Playlist">
              </div>
              <div class="form-group">
                  <label for="playlist-description">Description (optional)</label>
                  <textarea id="playlist-description" placeholder="Describe your playlist...">${playlist.description || ''}</textarea>
              </div>
          </div>
          <div class="modal-footer">
              <button class="modal-cancel">Cancel</button>
              <button class="modal-save">Save Changes</button>
          </div>
      `;
      
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
      
      // Focus the name input
      setTimeout(() => {
          document.getElementById('playlist-name').focus();
      }, 100);
      
      // Event listeners
      modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      modalOverlay.querySelector('.modal-cancel').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      modalOverlay.querySelector('.modal-save').addEventListener('click', async () => {
          const name = document.getElementById('playlist-name').value.trim();
          const description = document.getElementById('playlist-description').value.trim();
          
          if (!name) {
              alert('Please enter a playlist name');
              return;
          }
          
          // Update playlist
          userPlaylists[playlistId].name = name;
          userPlaylists[playlistId].description = description;
          userPlaylists[playlistId].updatedAt = new Date().toISOString();
          
          // Save to Firebase
          await updateUserData('playlists', userPlaylists);
          
          // Update UI
          updatePlaylistsSection();
          
          // If currently viewing this playlist, update the view
          if (currentPlaylist === playlistId) {
              openPlaylist(playlistId);
          }
          
          // Remove modal
          modalOverlay.remove();
      });
  }

  // Show delete playlist confirmation
  function showDeletePlaylistConfirmation(playlistId) {
      const playlist = userPlaylists[playlistId];
      if (!playlist) return;
      
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'modal-overlay';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      modalContent.innerHTML = `
          <div class="modal-header">
              <h3>Delete Playlist</h3>
              <button class="modal-close">×</button>
          </div>
          <div class="modal-body">
              <p>Are you sure you want to delete "${playlist.name}"?</p>
              <p>This action cannot be undone.</p>
          </div>
          <div class="modal-footer">
              <button class="modal-cancel">Cancel</button>
              <button class="modal-delete">Delete Playlist</button>
          </div>
      `;
      
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
      
      // Event listeners
      modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      modalOverlay.querySelector('.modal-cancel').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      modalOverlay.querySelector('.modal-delete').addEventListener('click', async () => {
          // Remove playlist
          userPlaylists.splice(playlistId, 1);
          
          // Save to Firebase
          await updateUserData('playlists', userPlaylists);
          
          // Update UI
          updatePlaylistsSection();
          
          // If currently viewing this playlist, go back to library
          if (currentPlaylist === playlistId) {
              updateMyLibraryTab();
          }
          
          // Remove modal
          modalOverlay.remove();
      });
  }

  // Open a playlist to view/play songs
  function openPlaylist(playlistId) {
      const playlist = userPlaylists[playlistId];
      if (!playlist) return;
      
      currentPlaylist = playlistId;
      
      // Get the my-library container
      const myLibraryContainer = document.querySelector('.my-library-container');
      
      // Store the original content to be restored
      if (!myLibraryContainer.getAttribute('data-original-content')) {
          myLibraryContainer.setAttribute('data-original-content', myLibraryContainer.innerHTML);
      }
      
      // Clear everything in the my-library container
      myLibraryContainer.innerHTML = '';
      
      // Create breadcrumb navigation
      const breadcrumb = document.createElement('div');
      breadcrumb.className = 'library-breadcrumb';
      breadcrumb.innerHTML = `
          <span class="breadcrumb-item" data-action="back-to-library">My Library</span>
          <span class="breadcrumb-separator">></span>
          <span class="breadcrumb-item active">${playlist.name}</span>
      `;
      myLibraryContainer.appendChild(breadcrumb);
      
      // Add back button functionality
      breadcrumb.querySelector('[data-action="back-to-library"]').addEventListener('click', function() {
          if (myLibraryContainer.getAttribute('data-original-content')) {
              myLibraryContainer.innerHTML = myLibraryContainer.getAttribute('data-original-content');
              // Reattach event listeners after restoring HTML
              reattachLibraryEventListeners();
          } else {
              updateMyLibraryTab();
          }
      });
      
      // Create playlist header
      const playlistHeader = document.createElement('div');
      playlistHeader.className = 'playlist-view-header';
      
      playlistHeader.innerHTML = `
          <div class="playlist-view-info">
              <div class="playlist-view-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 18V5l12-2v13"></path>
                      <circle cx="6" cy="18" r="3"></circle>
                      <circle cx="18" cy="16" r="3"></circle>
                  </svg>
              </div>
              <div>
                  <h2>${playlist.name}</h2>
                  ${playlist.description ? `<p class="playlist-description">${playlist.description}</p>` : ''}
                  <div class="playlist-stats">${playlist.songs.length} ${playlist.songs.length === 1 ? 'song' : 'songs'}</div>
              </div>
          </div>
          <div class="playlist-controls">
              <button class="add-to-playlist-btn">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19"></line>
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Songs
              </button>
          </div>
      `;
      
      myLibraryContainer.appendChild(playlistHeader);
      
      // Create songs container
      const songsContainer = document.createElement('div');
      songsContainer.className = 'playlist-songs-container';
      
      // Check if playlist has songs
      if (playlist.songs.length === 0) {
          // Empty state
          songsContainer.innerHTML = `
              <div class="empty-playlist">
                  <div class="empty-icon">🎵</div>
                  <p>This playlist is empty</p>
                  <p>Click "Add Songs" to start building your playlist</p>
              </div>
          `;
      } else {
          // Create list of songs
          const songsList = document.createElement('ul');
          songsList.className = 'music-list playlist-songs-list';
          
          // Get the songs that are in this playlist
          const playlistSongs = playlist.songs.map(songTitle => {
              return songs.find(song => song.title === songTitle);
          }).filter(song => song); // Filter out any undefined songs (in case songs were removed from the library)
          
          playlistSongs.forEach((song, index) => {
              const songIndex = songs.findIndex(s => s.title === song.title);
              const isPlaying = songIndex === currentPreviewIndex && !audioPreview.paused;
              
              const listItem = document.createElement('li');
              listItem.className = 'music-list-item';
              listItem.dataset.index = songIndex;
              listItem.dataset.songTitle = song.title;
              
              if (isPlaying) {
                  listItem.classList.add('playing');
              }
              
              listItem.innerHTML = `
                  <div class="song-info">
                      <div class="song-number">${index + 1}</div>
                      <div class="song-details">
                          <div class="song-title">${song.title}</div>
                          <div class="song-artist">${song.artist}</div>
                      </div>
                  </div>
                  <div class="preview-controls">
                      <div class="preview-progress">
                          <div class="preview-bar" id="preview-bar-playlist-${index}"></div>
                      </div>
                      <button class="preview-button tooltip" data-tooltip="${isPlaying ? 'Pause' : 'Preview'}" data-index="${songIndex}">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              ${isPlaying ? 
                                  `<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>` : 
                                  `<polygon points="5 3 19 12 5 21 5 3"></polygon>`
                              }
                          </svg>
                      </button>
                      <button class="action-button tooltip" data-tooltip="Remove from playlist" data-action="remove-from-playlist" data-song="${song.title}">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="18" y1="6" x2="6" y2="18"></line>
                              <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                      </button>
                  </div>
              `;
              
              songsList.appendChild(listItem);
          });
          
          songsContainer.appendChild(songsList);
      }
      
      myLibraryContainer.appendChild(songsContainer);
      
      // Add event listeners
      
      // Add Songs button
      const addToPlaylistBtn = myLibraryContainer.querySelector('.add-to-playlist-btn');
      if (addToPlaylistBtn) {
          addToPlaylistBtn.addEventListener('click', function() {
              showAddSongsToPlaylistDialog(playlistId);
          });
      }
      
      // Preview buttons
      const previewButtons = myLibraryContainer.querySelectorAll('.preview-button');
      previewButtons.forEach(button => {
          button.addEventListener('click', handlePreviewClick);
      });
      
      // Remove from playlist buttons
      const removeButtons = myLibraryContainer.querySelectorAll('[data-action="remove-from-playlist"]');
      removeButtons.forEach(button => {
          button.addEventListener('click', async function(e) {
              e.stopPropagation();
              const songTitle = this.dataset.song;
              
              // Remove song from playlist
              const songIndex = userPlaylists[playlistId].songs.indexOf(songTitle);
              if (songIndex !== -1) {
                  userPlaylists[playlistId].songs.splice(songIndex, 1);
                  
                  // Update updatedAt timestamp
                  userPlaylists[playlistId].updatedAt = new Date().toISOString();
                  
                  // Save to Firebase
                  await updateUserData('playlists', userPlaylists);
                  
                  // Animate removal
                  const itemToRemove = this.closest('.music-list-item');
                  if (itemToRemove) {
                      itemToRemove.style.transition = 'opacity 0.3s, transform 0.3s';
                      itemToRemove.style.opacity = '0';
                      itemToRemove.style.transform = 'translateX(20px)';
                      
                      setTimeout(() => {
                          // Refresh playlist view
                          openPlaylist(playlistId);
                      }, 300);
                  }
              }
          });
      });
  }

  // Show dialog to add songs to a playlist
  function showAddSongsToPlaylistDialog(playlistId) {
      const playlist = userPlaylists[playlistId];
      if (!playlist) return;
      
      // Create modal overlay
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'modal-overlay';
      
      // Create modal content
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content add-songs-modal';
      
      // Get songs that are not already in the playlist
      const availableSongs = songs.filter(song => !playlist.songs.includes(song.title));
      
      modalContent.innerHTML = `
          <div class="modal-header">
              <h3>Add Songs to "${playlist.name}"</h3>
              <button class="modal-close">×</button>
          </div>
          <div class="modal-body">
              <div class="search-container">
                  <input type="text" id="add-songs-search" placeholder="Search songs...">
                  <div class="search-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <circle cx="11" cy="11" r="8"></circle>
                          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                  </div>
              </div>
              <div class="add-songs-list-container">
                  ${availableSongs.length === 0 ? 
                      `<div class="empty-results">
                          <div class="empty-icon">🎵</div>
                          <div>No songs available to add</div>
                      </div>` :
                      `<ul class="add-songs-list">
                          ${availableSongs.map(song => `
                              <li class="add-song-item" data-song="${song.title}">
                                  <div class="song-info">
                                      <div class="song-title">${song.title}</div>
                                      <div class="song-artist">${song.artist}</div>
                                  </div>
                                  <div class="add-song-checkbox">
                                      <input type="checkbox" id="song-${song.title.replace(/\s+/g, '-')}" class="song-checkbox">
                                      <label for="song-${song.title.replace(/\s+/g, '-')}"></label>
                                  </div>
                              </li>
                          `).join('')}
                      </ul>`
                  }
              </div>
          </div>
          <div class="modal-footer">
              <button class="modal-cancel">Cancel</button>
              <button class="modal-add-selected">Add Selected</button>
          </div>
      `;
      
      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);
      
      // Event listeners
      modalOverlay.querySelector('.modal-close').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      modalOverlay.querySelector('.modal-cancel').addEventListener('click', () => {
          modalOverlay.remove();
      });
      
      // Search functionality
      const searchInput = modalOverlay.querySelector('#add-songs-search');
      if (searchInput) {
          searchInput.addEventListener('input', function() {
              const searchTerm = this.value.toLowerCase();
              const songItems = modalOverlay.querySelectorAll('.add-song-item');
              
              songItems.forEach(item => {
                  const songTitle = item.querySelector('.song-title').textContent.toLowerCase();
                  const songArtist = item.querySelector('.song-artist').textContent.toLowerCase();
                  
                  if (songTitle.includes(searchTerm) || songArtist.includes(searchTerm)) {
                      item.style.display = 'flex';
                  } else {
                      item.style.display = 'none';
                  }
              });
          });
      }
      
      // Add selected songs
      modalOverlay.querySelector('.modal-add-selected').addEventListener('click', async () => {
          const selectedSongs = [];
          
          modalOverlay.querySelectorAll('.song-checkbox:checked').forEach(checkbox => {
              const songItem = checkbox.closest('.add-song-item');
              if (songItem) {
                  selectedSongs.push(songItem.dataset.song);
              }
          });
          
          if (selectedSongs.length === 0) {
              alert('Please select at least one song to add');
              return;
          }
          
          // Add songs to playlist
          userPlaylists[playlistId].songs = [...userPlaylists[playlistId].songs, ...selectedSongs];
          
          // Update updatedAt timestamp
          userPlaylists[playlistId].updatedAt = new Date().toISOString();
          
          // Save to Firebase
          await updateUserData('playlists', userPlaylists);
          
          // Refresh playlist view
          openPlaylist(playlistId);
          
          // Remove modal
          modalOverlay.remove();
      });
      
      // Make song items clickable to toggle checkboxes
      const songItems = modalOverlay.querySelectorAll('.add-song-item');
      songItems.forEach(item => {
          item.addEventListener('click', function(e) {
              // Don't trigger if clicking directly on the checkbox
              if (e.target.type !== 'checkbox') {
                  const checkbox = this.querySelector('.song-checkbox');
                  checkbox.checked = !checkbox.checked;
              }
          });
      });
  }


  
  // Check if user is authenticated
  auth.onAuthStateChanged(user => {
      if (user) {
          initializeMusicList();
          initializePlaylists();
          updateMyLibraryTab();
      } else {
          // Handle not logged in state - could load defaults or show login prompt
          console.log("User not logged in");
          renderSongList(songs);
      }
  });


  
  // To Do List

  const todoList = document.getElementById('todoList');
  const saveButton = document.getElementById('save-btn');
  const addButton = document.getElementById('add-btn');
  const removeButton = document.getElementById('remove-btn');
  const selectAllButton = document.getElementById('select-all-btn');
  
  // Function to check if the todo list is empty and disable/enable buttons
  function checkIfEmpty() {
      const todoItems = todoList.querySelectorAll('.todo-item');
      
      // Disable the buttons if there are no items
      if (todoItems.length === 0) {
          removeButton.disabled = true;
          selectAllButton.disabled = true;
          removeButton.classList.add('disabled');
          selectAllButton.classList.add('disabled');
      } else {
          removeButton.disabled = false;
          selectAllButton.disabled = false;
          removeButton.classList.remove('disabled');
          selectAllButton.classList.remove('disabled');
      }
  }
  





  // Function to create a new todo item
  function createTodoItem(title = 'New Task', time = '12:00') {
      const todoItem = document.createElement('div');
      todoItem.className = 'todo-item';
      todoItem.id = "todoItem";
      todoItem.draggable = true;
  
      todoItem.innerHTML = `
          <input type="text" value="${title}" />
          <input type="time" value="${time}" />
          <input type="checkbox" class="select-task" />
      `;
  
      todoItem.addEventListener('dragstart', () => {
          todoItem.classList.add('dragging');
      });
  
      todoItem.addEventListener('dragend', () => {
          todoItem.classList.remove('dragging');
      });
  
      return todoItem;
  }




  // Handle drag-and-drop to reorder items
  todoList.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingItem = document.querySelector('.dragging');
      const afterElement = getDragAfterElement(todoList, e.clientY);
      if (afterElement == null) {
          todoList.appendChild(draggingItem);
      } else {
          todoList.insertBefore(draggingItem, afterElement);
      }
  });






  
  // Get the element after the dragged item based on cursor position
  function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('.todo-item:not(.dragging)')];
      return draggableElements.reduce((closest, child) => {
          const box = child.getBoundingClientRect();
          const offset = y - box.top - box.height / 2;
          if (offset < 0 && offset > closest.offset) {
              return { offset: offset, element: child };
          } else {
              return closest;
          }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
  }






  
  // Add a new todo item when the "Add" button is clicked
  addButton.addEventListener('click', () => {
      todoList.appendChild(createTodoItem());
      checkIfEmpty(); // Recheck and disable buttons if necessary
  });





  
  // Remove selected items when the "Remove" button is clicked
  removeButton.addEventListener('click', () => {
      const selectedItems = todoList.querySelectorAll('.select-task:checked');
      
      // Remove the selected items
      selectedItems.forEach(item => {
          todoList.removeChild(item.closest('.todo-item'));
      });
  
      // Reset the "Select All" button to "Select All" if no items are checked
      const checkboxes = todoList.querySelectorAll('.select-task');
      const anyChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
      if (!anyChecked) {
          selectAllButton.textContent = "Select All"; // Reset the button text to "Select All"
      }
  
      removeButton.textContent = "Deleted";
      setTimeout(() => {
          removeButton.textContent = "Delete";
      }, 1000);
  
      checkIfEmpty(); // Recheck and disable buttons if necessary
  });





  
  
  // Toggle select all checkboxes when the "Select All" button is clicked
  selectAllButton.addEventListener('click', () => {
      const allChecked = selectAllButton.textContent === "Deselect";
      const checkboxes = todoList.querySelectorAll('.select-task');
  
      checkboxes.forEach(checkbox => {
          checkbox.checked = !allChecked;
      });
  
      selectAllButton.textContent = allChecked ? "Select All" : "Deselect";
  });
  





  // Save the todo list and set reminders when the "Save" button is clicked
  saveButton.addEventListener('click', () => {
      saveButton.textContent = "Saved";
      setTimeout(() => {
          saveButton.textContent = "Save List";
      }, 1000);
  
      const items = [...todoList.querySelectorAll('.todo-item')].map(item => {
          return {
              element: item,
              title: item.querySelector('input[type="text"]').value,
              time: item.querySelector('input[type="time"]').value
          };
      });
  
      items.forEach(item => {
          const now = new Date();
          const alertTime = new Date();
          const [hours, minutes] = item.time.split(':');
          alertTime.setHours(hours, minutes, 0, 0);
  
          const timeDifference = alertTime.getTime() - now.getTime();
          if (timeDifference > 0) {
              setTimeout(() => {
                  alert(`Reminder: ${item.title} at ${item.time}`);
                  item.element.classList.add('disabled');
                  item.element.querySelector('.select-task').disabled = false;
              }, timeDifference);
          }
      });
  });
  
  // Run the check initially when the page loads to update button states
  checkIfEmpty();

  // ------------- END OF TODOLIST JS ---------------

  
  
  // ----------- START OF GENRE DROPDOWN JS ------------

  const genres = [
      { genre: "Rap" },
      { genre: "Pop" },
  ];
  
  const genreDropdown = document.getElementById("genre-dropdown");
  
  function populateGenreDropdown() {
      genreDropdown.innerHTML = "";
      genres.forEach((genre, index) => { 
          const option = document.createElement("option");
          option.value = index;
          option.textContent = genre.genre;
          genreDropdown.appendChild(option);
      });
  }
  
  populateGenreDropdown();
  
  // ------------ END OF GENRE DROPDOWN JS ---------------




  // --------------------- START OF SIDE-PANEL JS ---------------------

  let openBtn = document.getElementById("hm-icon");
  let sideBar = document.getElementById("mySidebar");
  let sidePanelOverlay = document.getElementById("sidePanelOverlay");

  

  openBtn.addEventListener('click', () => {
      sideBar.style.transform = "translateX(0)";
      sideBar.style.pointerEvents = "auto";
      sidePanelOverlay.style.display = "block";
  });

  sidePanelOverlay.addEventListener('click', () => {
      sideBar.style.transform = "translateX(-100%)";
      sideBar.style.pointerEvents = "none";
      sidePanelOverlay.style.display = "none";
  });
  


  let signOutSpBtn = document.getElementById("sign-out-sp-btn");

  signOutSpBtn.addEventListener('click', () => {
      auth.setPersistence(firebase.auth.Auth.Persistence.NONE).then(() => {
          auth.signOut().then(() => {
              // After setting persistence to NONE, sign out and reset the UI
              window.location.href = "index.html";  // Redirect to index.html after sign-out
          }).catch(error => console.error("Sign-out error:", error));
      }).catch(error => console.error("Error clearing persistence:", error));
  });


  let socialContainerSPBtn = document.getElementById("friends-sp-btn");

  socialContainerSPBtn.addEventListener("click", () => {
      sideBar.style.transform = "translateX(-100%)";
      sideBar.style.pointerEvents = "none";
  
      sidePanelOverlay.style.display = "none"; 
  
      let socialPanelOverlay = document.getElementById("socialPanelOverlay");
      let socialContainer = document.getElementById("socialContainer");
  
      socialPanelOverlay.style.display = "block";
      socialPanelOverlay.style.opacity = "1";
      socialPanelOverlay.style.pointerEvents = "auto";

      document.getElementById("chatContainer").style.display = "none";
      document.getElementById("chatContainer").style.opacity = "0";
      document.getElementById("chatContainer").style.pointerEvents = "none";
  
      setTimeout(() => {
          socialContainer.style.opacity = "1";
          socialContainer.style.pointerEvents = "auto";
      }, 100);
  
      openBtn.style.pointerEvents = "none";
      openBtn.style.opacity = "0.5";
  });
  


  let profileSpBtn = document.getElementById("profile-sp-btn");
  let profilePanel = document.getElementById("profilePanel");
  let profilePanelOverlay = document.getElementById("profilePanelOverlay");

  profileSpBtn.addEventListener('click', () => {
      sideBar.style.transform = "translateX(-100%)";
      sideBar.style.pointerEvents = "none";
  
      sidePanelOverlay.style.display = "none"; 
  
      profilePanelOverlay.style.display = "block";
      profilePanelOverlay.style.opacity = "1";
      profilePanelOverlay.style.pointerEvents = "auto";
  
      setTimeout(() => {
          profilePanel.style.opacity = "1";
          profilePanel.style.pointerEvents = "auto";
      }, 100);
  
      openBtn.style.pointerEvents = "none";
      openBtn.style.opacity = "0.5";
  });
  



  function closeProfilePanel() {
      profilePanel.style.opacity = "0";
      profilePanel.style.pointerEvents = "none";

      profilePanelOverlay.style.opacity = "0";
      profilePanelOverlay.style.pointerEvents = "none";

      profileCustomizationPanel.style.opacity = "0";
      profileCustomizationPanel.style.pointerEvents = "none";

      setTimeout(() => {
          profilePanelOverlay.style.display = "none";
      }, 300);

      openBtn.style.pointerEvents = "auto";
      openBtn.style.opacity = "1";
  }

  profilePanelOverlay.addEventListener('click', closeProfilePanel);
  document.getElementById("profilePanelClose").addEventListener('click', closeProfilePanel);



  let socialContainer = document.getElementById("socialContainer");
  let socialContainerOverlay = document.getElementById("socialPanelOverlay");
  let chatContainer = document.getElementById("chatContainer");
  
  function closeSocialPanelByOverlay() {
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

  socialContainerOverlay.addEventListener('click', closeSocialPanelByOverlay)


  let profileEditBtn = document.getElementById("ppbb-1");
  let profileCustomizationPanel = document.getElementById("profile-customization-panel");

  function openProfileCustomizationPanel() {
      profilePanel.style.opacity = "0";
      profilePanel.style.pointerEvents = "none";

      profilePanelOverlay.style.opacity = "1";
      profilePanelOverlay.style.pointerEvents = "auto";

      profileCustomizationPanel.style.pointerEvents = "auto";

      setTimeout(() => {
          profileCustomizationPanel.style.opacity = "1";
      }, 10);
  }

  profileEditBtn.addEventListener('click', openProfileCustomizationPanel);



  // ---------------- END OF SIDE-PANEL JS ---------------------



  // ---------------- TOOLTIPS START ---------------------


  let mainScreenProfileCustomizationBtn = document.getElementById("profileEditIcon");

  mainScreenProfileCustomizationBtn.addEventListener('mouseenter', () => {
      let tooltipText = mainScreenProfileCustomizationBtn.getAttribute("data-tooltip");
      let tooltip = document.createElement("div");
      tooltip.className = "profileEditMainPageTooltip";
      tooltip.textContent = tooltipText;

      document.body.appendChild(tooltip);

      // Position tooltip above the profile edit icon
      let rect = mainScreenProfileCustomizationBtn.getBoundingClientRect();
      tooltip.style.left = rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2) + "px";
      tooltip.style.top = rect.top + window.scrollY - tooltip.offsetHeight - 5 + "px";

      setTimeout(() => {
          tooltip.classList.add("show");
      }, 10);

      mainScreenProfileCustomizationBtn.tooltipElement = tooltip;
  });

  mainScreenProfileCustomizationBtn.addEventListener('mouseleave', () => {
      if (mainScreenProfileCustomizationBtn.tooltipElement) {
          mainScreenProfileCustomizationBtn.tooltipElement.classList.remove("show");

          setTimeout(() => {
              mainScreenProfileCustomizationBtn.tooltipElement.remove();
          }, 300);
      }
  });

  mainScreenProfileCustomizationBtn.addEventListener('click', () => {
      profilePanelOverlay.style.opacity = "1";
      profilePanelOverlay.style.pointerEvents = "auto";
      profilePanelOverlay.style.display = "block";

      setTimeout(() => {
          profileCustomizationPanel.style.opacity = "1";
          profileCustomizationPanel.style.pointerEvents = "auto";
      }, 50);

      openBtn.style.pointerEvents = "none";
      openBtn.style.opacity = "0.5";
  });

  
  document.getElementById("userInfo").addEventListener("click", (event) => {
      if (event.target.tagName === "P") {
          profilePanelOverlay.style.opacity = "1";
          profilePanelOverlay.style.pointerEvents = "auto";
          profilePanelOverlay.style.display = "block";

      setTimeout(() => {
          profilePanel.style.opacity = "1";
          profilePanel.style.pointerEvents = "auto";
      }, 50);
      }
  });


  let mainScreenProfileSettingsBtn = document.getElementById("profileSettingsIcon");

  mainScreenProfileSettingsBtn.addEventListener('mouseenter', () => {
      let tooltipText = mainScreenProfileSettingsBtn.getAttribute("data-tooltip");
      let tooltip = document.createElement("div");
      tooltip.className = "profileSettingsMainPageTooltip";
      tooltip.textContent = tooltipText;

      document.body.appendChild(tooltip);

      let rect = mainScreenProfileSettingsBtn.getBoundingClientRect();
      tooltip.style.left = rect.left + window.scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2) + "px";
      tooltip.style.top = rect.top + window.scrollY - tooltip.offsetHeight - 5 + "px";

      setTimeout(() => {
          tooltip.classList.add("show");
      }, 10);

      mainScreenProfileSettingsBtn.tooltipElement = tooltip;
  });

  mainScreenProfileSettingsBtn.addEventListener('mouseleave', () => {
      if (mainScreenProfileSettingsBtn.tooltipElement) {
          mainScreenProfileSettingsBtn.tooltipElement.classList.remove("show");

          setTimeout(() => {
              mainScreenProfileSettingsBtn.tooltipElement.remove();
          }, 300);
      }
  });



  let hmMenuBtn = document.getElementById("hm-icon");

  hmMenuBtn.addEventListener('mouseenter', () => {
      let tooltipText = hmMenuBtn.getAttribute("data-tooltip");
      let tooltip = document.createElement("div");
      tooltip.className = "hmBtnTooltip";
      tooltip.textContent = tooltipText;
  
      document.body.appendChild(tooltip);
  
      // Position tooltip to the right of the hmMenuBtn
      let rect = hmMenuBtn.getBoundingClientRect();
      tooltip.style.left = rect.right + window.scrollX + 5 + "px"; // 5px gap to the right
      tooltip.style.top = rect.top + window.scrollY + (rect.height / 2) - (tooltip.offsetHeight / 2) + "px"; // Centered vertically
  
      setTimeout(() => {
          tooltip.classList.add("show");
      }, 10);
  
      hmMenuBtn.tooltipElement = tooltip;
  });
  
  hmMenuBtn.addEventListener('mouseleave', () => {
      if (hmMenuBtn.tooltipElement) {
          hmMenuBtn.tooltipElement.classList.remove("show");

          setTimeout(() => {
              hmMenuBtn.tooltipElement.remove();
          }, 300);
      }
  });




  let infoIconBtn = document.getElementById("info-icon");

  infoIconBtn.addEventListener('mouseenter', () => {
      let tooltipText = infoIconBtn.getAttribute("data-tooltip");
      let tooltip = document.createElement("div");
      tooltip.className = "infoIconTooltip";
      tooltip.textContent = tooltipText;
  
      document.body.appendChild(tooltip);
  
      let rect = hmMenuBtn.getBoundingClientRect();
      tooltip.style.right = rect.right + window.scrollX + 5 + "px";
      tooltip.style.top = rect.top + window.scrollY + (rect.height / 2) - (tooltip.offsetHeight / 2) + "px";
  
      setTimeout(() => {
          tooltip.classList.add("show");
      }, 10);
  
      infoIconBtn.tooltipElement = tooltip;
  });

  infoIconBtn.addEventListener('mouseleave', () => {
      if (infoIconBtn.tooltipElement) {
          infoIconBtn.tooltipElement.classList.remove("show");

          setTimeout(() => {
              infoIconBtn.tooltipElement.remove();
          }, 300);
      }
  });

  
  // ---------------- TOOLTIPS END ---------------------




  // CODE FOR APPEARANCE PANEL


  let apperanceSPBtn = document.getElementById("appearance-sp-btn");

  apperanceSPBtn.addEventListener('click', () => {
      sideBar.style.transform = "translateX(-100%)";
      sideBar.style.pointerEvents = "none";

      sidePanelOverlay.style.display = "none";

      settingsPanel.style.opacity = "1";
      settingsPanel.style.pointerEvents = "auto";
      document.getElementById('appearancePanelOverlay').style.display = "block";
  });


  // Get the settings panel and resize handle elements
  const settingsPanel = document.getElementById('appearancePanel');


  let appearanceCloseBtn = document.getElementById("appearance-panel-close");

  appearanceCloseBtn.addEventListener('click', () => {
      settingsPanel.style.opacity = "0";
      settingsPanel.style.pointerEvents = "none";
      document.getElementById('appearancePanelOverlay').style.display = "none";
  });

  document.getElementById('appearancePanelOverlay').addEventListener('click', () => {
      settingsPanel.style.opacity = "0";
      settingsPanel.style.pointerEvents = "none";
      document.getElementById('appearancePanelOverlay').style.display = "none";
  });


  // ----------------- END OF APPEARANCE PANEL JS -------------------


  // ------------------ STORE JS -----------------------------


    document.getElementById('store-sp-btn').addEventListener('click', function() {
        sideBar.style.transform = "translateX(-100%)";
        sideBar.style.pointerEvents = "none";
        sidePanelOverlay.style.display = 'none';

        document.getElementById('storePanel').style.opacity = '1';
        document.getElementById('storePanel').style.pointerEvents = 'auto';
        document.getElementById('storePanelOverlay').style.display = 'block';
    });


    document.getElementById('closeStoreBtn').addEventListener('click', function() {
        document.getElementById('storePanel').style.opacity = '0';
        document.getElementById('storePanel').style.pointerEvents = 'none';
        document.getElementById('storePanelOverlay').style.display = 'none';
    });

    document.getElementById('storePanelOverlay').addEventListener('click', function() {
        document.getElementById('storePanel').style.opacity = '0';
        document.getElementById('storePanel').style.pointerEvents = 'none';
        document.getElementById('storePanelOverlay').style.display = 'none';
    })

    // ------------------ INVENTORY JS ----------------------

    document.getElementById('inventory-sp-btn').addEventListener('click', function() {
        sideBar.style.transform = "translateX(-100%)";
        sideBar.style.pointerEvents = "none";
        sidePanelOverlay.style.display = 'none';

        document.getElementById('inventoryPanel').style.opacity = '1';
        document.getElementById('inventoryPanel').style.pointerEvents = 'auto';
        document.getElementById('inventoryPanelOverlay').style.display = 'block';
    });

    document.getElementById('closeInventoryBtn').addEventListener('click', function() {
        document.getElementById('inventoryPanel').style.opacity = '0';
        document.getElementById('inventoryPanel').style.pointerEvents = 'none';
        document.getElementById('inventoryPanelOverlay').style.display = 'none';
    });

    document.getElementById('inventoryPanelOverlay').addEventListener('click', function() {
        document.getElementById('inventoryPanel').style.opacity = '0';
        document.getElementById('inventoryPanel').style.pointerEvents = 'none';
        document.getElementById('inventoryPanelOverlay').style.display = 'none';
    });


  // --------------- START OF CLOCK JS ---------------------

  let hrs = document.getElementById("hrs");
  let min = document.getElementById("min");
  let sec = document.getElementById("sec");
  let ampm = document.getElementById("ampm");

  setInterval(() => {
      let currentTime = new Date(); // Get the current time
      let hours = currentTime.getHours();
      let minutes = currentTime.getMinutes();
      let seconds = currentTime.getSeconds();

      // Determine AM or PM
      let meridian = hours >= 12 ? "PM" : "AM";

      // Convert to 12-hour format
      let displayHours = hours % 12 || 12; // Show 12 for midnight/noon

      // Update the clock elements
      hrs.innerHTML = String(displayHours).padStart(2, '0');
      min.innerHTML = String(minutes).padStart(2, '0');
      sec.innerHTML = String(seconds).padStart(2, '0');
      ampm.innerHTML = meridian;
  }, 1000);


  // ------------------ END OF CLOCK JS -----------------------


});

