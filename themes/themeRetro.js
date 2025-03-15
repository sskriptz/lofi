export function applyRetroTheme() {
    // Base colors - using a more consistent palette
    const baseBackground = '#f7e8d4'; // Warmer, softer beige
    const accentColor1 = '#d4a373'; // Warm caramel
    const accentColor2 = '#e9c46a'; // Golden yellow
    const accentColor3 = '#84a59d'; // Muted sage green
    const accentColor4 = '#ca6d6d'; // Muted vintage red
    const textColor = '#453030'; // Rich brown for text
    const secondaryTextColor = '#6d5e5e'; // Lighter brown for secondary text
    
    // Apply base styling
    appearancePanel.style.backgroundColor = baseBackground;
    
    // Time container with a smoother gradient
    timeContainer1.style.background = `linear-gradient(90deg, ${accentColor2}, #e7b355, ${accentColor1})`;
    timeContainer1.style.color = textColor;

    // Particle container
    particleContainer.style.backgroundColor = baseBackground;
    particleContainer.style.color = textColor;
    particlesButtonRain.style.backgroundColor = accentColor1;
    particlesButtonRain.style.color = textColor;
    particlesButtonSnow.style.backgroundColor = accentColor1;
    particlesButtonSnow.style.color = textColor;

    // Weather container
    weatherContainer.style.backgroundColor = baseBackground;
    weatherContainer.style.color = textColor;
    weatherContainer.style.borderColor = accentColor1;
    weatherButtonsStorm.style.backgroundColor = accentColor4;
    weatherButtonsStorm.style.color = textColor;
    weatherButtonsBlizzard.style.backgroundColor = accentColor4;
    weatherButtonsBlizzard.style.color = textColor;

    // Wallpaper container
    wallpaperContainer.style.backgroundColor = baseBackground;
    wallpaperContainer.style.color = textColor;
    wallpaperBg1Btn.style.backgroundColor = accentColor3;
    wallpaperBg1Btn.style.color = textColor;
    wallpaperBg2Btn.style.backgroundColor = accentColor3;
    wallpaperBg2Btn.style.color = textColor;
    wallpaperBg3Btn.style.backgroundColor = accentColor3;
    wallpaperBg3Btn.style.color = textColor;
    wallpaperBg4Btn.style.backgroundColor = accentColor3;
    wallpaperBg4Btn.style.color = textColor;

    // Audio player
    audioPlayer.style.backgroundColor = baseBackground;
    document.getElementById("song-title").style.color = textColor;
    document.getElementById("song-artist").style.color = secondaryTextColor;
    document.getElementById("current-time").style.color = textColor;
    document.getElementById("total-duration").style.color = textColor;
    volumeTag.style.color = textColor;

    document.getElementById("playlist-dropdown").style.backgroundColor = "white";
    document.getElementById("playlist-dropdown").style.color = "black";

    document.getElementById("autoplay-button").style.backgroundColor = "white";
    document.getElementById("autoplay-button").style.color = "black";

    // Profile container
    profileContainer.style.backgroundColor = baseBackground;
    const userInfoDiv = document.getElementById('userInfo');
    const pTag = userInfoDiv.children[1];
    pTag.style.color = textColor;

    profileEditBtnContainer.style.backgroundColor = baseBackground;
    profileEditIcon.style.filter = "invert(20%) sepia(10%) saturate(1500%) hue-rotate(330deg)";

    profileSettingsBtnContainer.style.backgroundColor = baseBackground;
    profileSettingsIcon.style.filter = "invert(20%) sepia(10%) saturate(1500%) hue-rotate(330deg)";

    // To-do container
    tdContainer.style.backgroundColor = baseBackground;
    tdHeader.style.color = textColor;
    todoList.style.backgroundColor = accentColor1 + '40'; // Adding transparency
    todoList.style.border = `1px solid ${accentColor1}`;

    // GS container
    gsContainer.style.backgroundColor = baseBackground;
    gsContainer.style.color = textColor;
}
