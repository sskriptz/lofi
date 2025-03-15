export function applyLightTheme() {
    appearancePanel.style.backgroundColor = '#ffffff';
    
    timeContainer1.style.background = "linear-gradient(90deg, #7341a9, #00ffa6)";
    timeContainer1.style.backgroundSize = "200% 100%";
    timeContainer1.style.color = "black"; // Dark brown for contrast

    particleContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)'; // Warm beige
    particleContainer.style.color = 'black';
    particlesButtonRain.style.backgroundColor = 'transparent'; // Muted brown
    particlesButtonRain.style.color = 'black';
    particlesButtonSnow.style.backgroundColor = 'transparent';
    particlesButtonSnow.style.color = 'black';

    weatherContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    weatherContainer.style.color = 'black';
    weatherButtonsStorm.style.backgroundColor = 'transparent'; // Muted red
    weatherButtonsStorm.style.color = 'black';
    weatherButtonsBlizzard.style.backgroundColor = 'transparent';
    weatherButtonsBlizzard.style.color = 'black';

    wallpaperContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    wallpaperContainer.style.color = 'black';

    wallpaperBg1Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'; // Muted teal
    wallpaperBg1Btn.style.color = 'black';
    wallpaperBg2Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    wallpaperBg2Btn.style.color = 'black';
    wallpaperBg3Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    wallpaperBg3Btn.style.color = 'black';
    wallpaperBg4Btn.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
    wallpaperBg4Btn.style.color = 'black';

    audioPlayer.style.backgroundColor = '#3c3c3c';

    document.getElementById("song-title").style.color = "white";
    document.getElementById("song-artist").style.color = "b3b3b3";
    document.getElementById("current-time").style.color = "white";
    document.getElementById("total-duration").style.color = "white";
    volumeTag.style.color = "white";

    profileContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';

    const userInfoDiv = document.getElementById('userInfo');
    const pTag = userInfoDiv.children[1];
    pTag.style.color = "black";

    profileEditBtnContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    profileEditIcon.style.filter = "invert(0)";

    profileSettingsBtnContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    profileSettingsIcon.style.filter = "invert(0)";

    tdContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    tdHeader.style.color = "#3b2f2f";
    todoList.style.backgroundColor = "#f7f9fc";
    todoList.style.border = "2px solid #e8eaf6";

    gsContainer.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    gsContainer.style.color = "black";

}
