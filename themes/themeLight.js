export function applyLightTheme() {
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
    
    // Apply styles with null checks
    if (appearancePanel) appearancePanel.style.backgroundColor = '#ffffff';
    
    if (timeContainer1) {
        timeContainer1.style.background = "linear-gradient(90deg, #7341a9, #00ffa6)";
        timeContainer1.style.backgroundSize = "200% 100%";
        timeContainer1.style.color = "black"; // Dark brown for contrast
    }

    if (particleContainer) {
        particleContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Warm beige
        particleContainer.style.color = 'black';
    }
    if (particlesButtonRain) {
        particlesButtonRain.style.backgroundColor = 'transparent'; // Muted brown
        particlesButtonRain.style.color = 'black';
    }
    if (particlesButtonSnow) {
        particlesButtonSnow.style.backgroundColor = 'transparent';
        particlesButtonSnow.style.color = 'black';
    }

    if (weatherContainer) {
        weatherContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        weatherContainer.style.color = 'black';
    }
    if (weatherButtonsStorm) {
        weatherButtonsStorm.style.backgroundColor = 'transparent'; // Muted red
        weatherButtonsStorm.style.color = 'black';
    }
    if (weatherButtonsBlizzard) {
        weatherButtonsBlizzard.style.backgroundColor = 'transparent';
        weatherButtonsBlizzard.style.color = 'black';
    }

    if (wallpaperContainer) {
        wallpaperContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        wallpaperContainer.style.color = 'black';
    }

    if (wallpaperBg1Btn) {
        wallpaperBg1Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Muted teal
        wallpaperBg1Btn.style.color = 'black';
    }
    if (wallpaperBg2Btn) {
        wallpaperBg2Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        wallpaperBg2Btn.style.color = 'black';
    }
    if (wallpaperBg3Btn) {
        wallpaperBg3Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        wallpaperBg3Btn.style.color = 'black';
    }
    if (wallpaperBg4Btn) {
        wallpaperBg4Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
        wallpaperBg4Btn.style.color = 'black';
    }

    if (audioPlayer) audioPlayer.style.backgroundColor = '#3c3c3c';

    const songTitle = document.getElementById("song-title");
    const songArtist = document.getElementById("song-artist");
    const currentTime = document.getElementById("current-time");
    const totalDuration = document.getElementById("total-duration");
    
    if (songTitle) songTitle.style.color = "white";
    if (songArtist) songArtist.style.color = "#b3b3b3"; // Added # prefix that was missing
    if (currentTime) currentTime.style.color = "white";
    if (totalDuration) totalDuration.style.color = "white";
    if (volumeTag) volumeTag.style.color = "white";

    if (profileContainer) profileContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';

    const userInfoDiv = document.getElementById('userInfo');
    if (userInfoDiv && userInfoDiv.children && userInfoDiv.children.length > 1) {
        const pTag = userInfoDiv.children[1];
        pTag.style.color = "black";
    }

    if (profileEditBtnContainer) profileEditBtnContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    if (profileEditIcon) profileEditIcon.style.filter = "invert(0)";

    if (profileSettingsBtnContainer) profileSettingsBtnContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    if (profileSettingsIcon) profileSettingsIcon.style.filter = "invert(0)";

    if (tdContainer) tdContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    if (tdHeader) tdHeader.style.color = "#3b2f2f";
    if (todoList) {
        todoList.style.backgroundColor = "#f7f9fc";
        todoList.style.border = "2px solid #e8eaf6";
    }

    if (gsContainer) {
        gsContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
        gsContainer.style.color = "black";
    }
}
