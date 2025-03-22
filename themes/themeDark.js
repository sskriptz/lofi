export function applyDarkTheme() {

    if (appearancePanel) appearancePanel.style.backgroundColor = '#1e293b';

    if (timeContainer1) {
        timeContainer1.style.background = "linear-gradient(90deg, #1a1a2e, #16213e, #0f3460)";
        timeContainer1.style.color = "rgb(195, 192, 192)";
    }

    if (particleContainer) particleContainer.style.backgroundColor = '#1a1a1a';
    if (particleContainer) particleContainer.style.color = '#ffffff';
    if (particlesButtonRain) particlesButtonRain.style.backgroundColor = '#333333';
    if (particlesButtonRain) particlesButtonRain.style.color = '#ffffff';
    if (particlesButtonSnow) particlesButtonSnow.style.backgroundColor = '#333333';
    if (particlesButtonSnow) particlesButtonSnow.style.color = '#ffffff';

    if (weatherContainer) {
        weatherContainer.style.backgroundColor = '#1a1a1a';
        weatherContainer.style.color = '#ffffff';
        weatherContainer.style.borderColor = '#333333';
    }
    if (weatherButtonsStorm) {
        weatherButtonsStorm.style.backgroundColor = '#333333';
        weatherButtonsStorm.style.color = '#ffffff';
    }
    if (weatherButtonsBlizzard) {
        weatherButtonsBlizzard.style.backgroundColor = '#333333';
        weatherButtonsBlizzard.style.color = '#ffffff';
    }

    if (wallpaperContainer) {
        wallpaperContainer.style.backgroundColor = '#1a1a1a';
        wallpaperContainer.style.color = '#ffffff';
    }
    if (wallpaperBg1Btn) {
        wallpaperBg1Btn.style.backgroundColor = '#333333';
        wallpaperBg1Btn.style.color = '#ffffff';
    }
    if (wallpaperBg2Btn) {
        wallpaperBg2Btn.style.backgroundColor = '#333333';
        wallpaperBg2Btn.style.color = '#ffffff';
    }
    if (wallpaperBg3Btn) {
        wallpaperBg3Btn.style.backgroundColor = '#333333';
        wallpaperBg3Btn.style.color = '#ffffff';
    }
    if (wallpaperBg4Btn) {
        wallpaperBg4Btn.style.backgroundColor = '#333333';
        wallpaperBg4Btn.style.color = '#ffffff';
    }

    if (audioPlayer) audioPlayer.style.backgroundColor = '#1a1a1a';

    if (profileContainer) profileContainer.style.backgroundColor = '#1a1a1a';


    if (profileEditBtnContainer) profileEditBtnContainer.style.backgroundColor = "#1a1a1a";
    if (profileEditIcon) profileEditIcon.style.filter = "invert(1)";
    
    if (profileSettingsBtnContainer) profileSettingsBtnContainer.style.backgroundColor = "#1a1a1a";
    if (profileSettingsIcon) profileSettingsIcon.style.filter = "invert(1)";

    if (tdContainer) tdContainer.style.backgroundColor = "#1a1a1a";
    if (tdHeader) tdHeader.style.color = "#ffffff";
    if (todoList) {
        todoList.style.backgroundColor = "rgb(56, 55, 55)";
        todoList.style.border = "none";
    }
    
    if (gsContainer) {
        gsContainer.style.backgroundColor = "#1a1a1a";
        gsContainer.style.color = "#ffffff";
    }

    if (spMainSection) {
        spMainSection.style.backgroundColor = "#1a1a1a";
    }

    if (userUsername) {
        userUsername.style.color = "#ffffff";
    }

    if (socialPanelCloseBtn) {
        socialPanelCloseBtn.style.color = "#ffffff";
    }

    if (socialPanelSearchTitle) {
        socialPanelSearchTitle.style.color = "#ffffff";
    }

    const searchInput = document.getElementById('searchInputFriends');
    searchInput.style.backgroundColor = "#2a2a2a";
    searchInput.style.color = " #f5f5f5";

    if (frNotifications) {
        frNotifications.style.backgroundColor = "#2a2a2a";
    }

    if (frSectionTitle) {
        frSectionTitle.style.color = "#ffffff";
    }

    if (friendsList) {
        friendsList.style.backgroundColor = "#2a2a2a";
    }


    const observer = new MutationObserver(function(mutations) {
        const spans = document.querySelectorAll('.friend-item span');
        
        spans.forEach(span => {
            span.style.color = "#ffffff";
        });

        const friendItems = document.querySelectorAll('.friend-item');

        friendItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.backgroundColor = '#333';
            });

            item.addEventListener('mouseleave', () => {
                item.style.backgroundColor = '';
            });
        });

        chatMessages.style.backgroundColor = "#1a1a1a";

        chatInput.style.backgroundColor = "#1a1a1a";
        
        messageInput.style.backgroundColor = "#2a2a2a";
        messageInput.style.color = "#f5f5f5";

        homepageUserDisplayName.style.color = 'white';

        welcomePanel.style.backgroundColor = "#1a1a1a";
        welcomeMessage.style.color = "white";

    });
    
    observer.observe(friendsList, { childList: true, subtree: true });



}
