export function applyRetroTheme() {
    // Base colors - using a more consistent palette
    const baseBackground = '#f7e8d4'; // Warmer, softer beige
    const accentColor1 = '#d4a373'; // Warm caramel
    const accentColor2 = '#e9c46a'; // Golden yellow
    const accentColor3 = '#84a59d'; // Muted sage green
    const accentColor4 = '#ca6d6d'; // Muted vintage red
    const textColor = '#453030'; // Rich brown for text
    const secondaryTextColor = '#6d5e5e'; // Lighter brown for secondary text
    
    // Get all the DOM elements first
    const appearancePanel = document.getElementById('appearancePanel');
    const timeContainer1 = document.getElementById('timeContainer1');
    const particleContainer = document.getElementById('particleContainer');
    const particlesButtonRain = document.getElementById('particlesButtonRain');
    const particlesButtonSnow = document.getElementById('particlesButtonSnow');
    const weatherContainer = document.getElementById('weatherContainer');
    const weatherButtonsStorm = document.getElementById('weatherButtonsStorm');
    const weatherButtonsBlizzard = document.getElementById('weatherButtonsBlizzard');
    const wallpaperContainer = document.getElementById('wallpaperContainer');
    const wallpaperBg1Btn = document.getElementById('wallpaperBg1Btn');
    const wallpaperBg2Btn = document.getElementById('wallpaperBg2Btn');
    const wallpaperBg3Btn = document.getElementById('wallpaperBg3Btn');
    const wallpaperBg4Btn = document.getElementById('wallpaperBg4Btn');
    const audioPlayer = document.getElementById('audioPlayer');
    const volumeTag = document.getElementById('volumeTag');
    const profileContainer = document.getElementById('profileContainer');
    const profileEditBtnContainer = document.getElementById('profileEditBtnContainer');
    const profileEditIcon = document.getElementById('profileEditIcon');
    const profileSettingsBtnContainer = document.getElementById('profileSettingsBtnContainer');
    const profileSettingsIcon = document.getElementById('profileSettingsIcon');
    const tdContainer = document.getElementById('tdContainer');
    const tdHeader = document.getElementById('tdHeader');
    const todoList = document.getElementById('todoList');
    const gsContainer = document.getElementById('gsContainer');
    
    // Apply base styling - Add null checks before accessing properties
    if (appearancePanel) appearancePanel.style.backgroundColor = baseBackground;
    
    // Time container with a smoother gradient
    if (timeContainer1) timeContainer1.style.background = `linear-gradient(90deg, ${accentColor2}, #e7b355, ${accentColor1})`;
    if (timeContainer1) timeContainer1.style.color = textColor;

    // Particle container
    if (particleContainer) particleContainer.style.backgroundColor = baseBackground;
    if (particleContainer) particleContainer.style.color = textColor;
    if (particlesButtonRain) particlesButtonRain.style.backgroundColor = accentColor1;
    if (particlesButtonRain) particlesButtonRain.style.color = textColor;
    if (particlesButtonSnow) particlesButtonSnow.style.backgroundColor = accentColor1;
    if (particlesButtonSnow) particlesButtonSnow.style.color = textColor;

    // Weather container
    if (weatherContainer) {
        weatherContainer.style.backgroundColor = baseBackground;
        weatherContainer.style.color = textColor;
        weatherContainer.style.borderColor = accentColor1;
    }
    if (weatherButtonsStorm) {
        weatherButtonsStorm.style.backgroundColor = accentColor4;
        weatherButtonsStorm.style.color = textColor;
    }
    if (weatherButtonsBlizzard) {
        weatherButtonsBlizzard.style.backgroundColor = accentColor4;
        weatherButtonsBlizzard.style.color = textColor;
    }

    // Wallpaper container
    if (wallpaperContainer) {
        wallpaperContainer.style.backgroundColor = baseBackground;
        wallpaperContainer.style.color = textColor;
    }
    if (wallpaperBg1Btn) {
        wallpaperBg1Btn.style.backgroundColor = accentColor3;
        wallpaperBg1Btn.style.color = textColor;
    }
    if (wallpaperBg2Btn) {
        wallpaperBg2Btn.style.backgroundColor = accentColor3;
        wallpaperBg2Btn.style.color = textColor;
    }
    if (wallpaperBg3Btn) {
        wallpaperBg3Btn.style.backgroundColor = accentColor3;
        wallpaperBg3Btn.style.color = textColor;
    }
    if (wallpaperBg4Btn) {
        wallpaperBg4Btn.style.backgroundColor = accentColor3;
        wallpaperBg4Btn.style.color = textColor;
    }

    // Audio player
    if (audioPlayer) audioPlayer.style.backgroundColor = baseBackground;
    
    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const currentTime = document.getElementById("current-time");
    const totalDuration = document.getElementById("total-duration");
    const playlistDropdown = document.getElementById("playlist-dropdown");
    const autoplayButton = document.getElementById("autoplay-button");
    
    if (songTitle) songTitle.style.color = textColor;
    if (songArtist) songArtist.style.color = secondaryTextColor;
    if (currentTime) currentTime.style.color = textColor;
    if (totalDuration) totalDuration.style.color = textColor;
    if (volumeTag) volumeTag.style.color = textColor;

    if (playlistDropdown) {
        playlistDropdown.style.backgroundColor = "white";
        playlistDropdown.style.color = "black";
    }

    if (autoplayButton) {
        autoplayButton.style.backgroundColor = "white";
        autoplayButton.style.color = "black";
    }

    // Profile container
    if (profileContainer) profileContainer.style.backgroundColor = baseBackground;
    
    const userInfoDiv = document.getElementById('userInfo');
    if (userInfoDiv && userInfoDiv.children && userInfoDiv.children.length > 1) {
        const pTag = userInfoDiv.children[1];
        pTag.style.color = textColor;
    }

    if (profileEditBtnContainer) profileEditBtnContainer.style.backgroundColor = baseBackground;
    if (profileEditIcon) profileEditIcon.style.filter = "invert(20%) sepia(10%) saturate(1500%) hue-rotate(330deg)";

    if (profileSettingsBtnContainer) profileSettingsBtnContainer.style.backgroundColor = baseBackground;
    if (profileSettingsIcon) profileSettingsIcon.style.filter = "invert(20%) sepia(10%) saturate(1500%) hue-rotate(330deg)";

    // To-do container
    if (tdContainer) tdContainer.style.backgroundColor = baseBackground;
    if (tdHeader) tdHeader.style.color = textColor;
    if (todoList) {
        todoList.style.backgroundColor = accentColor1 + '40'; // Adding transparency
        todoList.style.border = `1px solid ${accentColor1}`;
    }

    // GS container
    if (gsContainer) {
        gsContainer.style.backgroundColor = baseBackground;
        gsContainer.style.color = textColor;
    }
}
