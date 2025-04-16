// focus-mode.js
// This file contains the focus mode functionality that can be imported into main.js

// Variables for focus mode
let focusModeContainer;
let focusTimer;
let focusSound;
let alarmSound;
let activeWallpaper = '/api/placeholder/1920/1080';

// Create and inject the necessary styles for the focus mode
function injectFocusModeStyles() {
  const style = document.createElement('style');
  style.textContent = `
  .focus-mode-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #121212;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.5s ease;
    padding: 2rem;
    box-sizing: border-box;
    color: white;
    font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  }
  
  .focus-wallpaper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    z-index: -1;
    transition: opacity 0.5s ease;
  }
  
  .focus-content {
    background-color: rgba(18, 18, 18, 0.7);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 800px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .focus-mode-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .focus-title {
    font-size: 1.8rem;
    font-weight: 700;
    letter-spacing: -0.5px;
    margin: 0;
  }
  
  .exit-focus-btn {
    background-color: rgba(255, 59, 48, 0.9);
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .exit-focus-btn:hover {
    background-color: rgba(255, 59, 48, 1);
    transform: translateY(-1px);
  }
  
  .exit-focus-btn:active {
    transform: translateY(1px);
  }
  
  .focus-timer {
    font-size: 7rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: white;
    letter-spacing: -2px;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  
  .focus-goal {
    font-size: 1.5rem;
    margin-bottom: 2rem;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    max-width: 600px;
    font-weight: 500;
  }
  
  .focus-settings {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 2rem;
  }
  
  .focus-setting-group {
    display: flex;
    flex-direction: column;
  }
  
  .focus-setting-label {
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .focus-setting-input {
    padding: 12px 16px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 1rem;
    transition: all 0.2s ease;
    font-family: inherit;
  }
  
  .focus-setting-input:focus {
    outline: none;
    border-color: rgba(100, 210, 255, 0.5);
    box-shadow: 0 0 0 2px rgba(100, 210, 255, 0.2);
  }
  
  .focus-sounds {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
    flex-wrap: wrap;
  }
  
  .sound-btn {
    background-color: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    padding: 6px 12px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
  }
  
  .sound-btn:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .sound-btn.active {
    background-color: rgba(52, 199, 89, 0.8);
    color: white;
    border-color: transparent;
  }
  
  .start-focus-btn {
    background-color: rgba(10, 132, 255, 0.9);
    color: white;
    border: none;
    padding: 14px 28px;
    border-radius: 30px;
    cursor: pointer;
    font-size: 1.1rem;
    font-weight: 600;
    margin-top: 1rem;
    transition: all 0.3s ease;
    width: auto;
    min-width: 200px;
    box-shadow: 0 4px 12px rgba(10, 132, 255, 0.3);
  }
  
  .start-focus-btn:hover {
    background-color: rgba(10, 132, 255, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(10, 132, 255, 0.4);
  }
  
  .start-focus-btn:active {
    transform: translateY(1px);
    box-shadow: 0 2px 8px rgba(10, 132, 255, 0.3);
  }
  
  .wallpaper-selector {
    margin-top: 2rem;
    width: 100%;
  }
  
  .wallpaper-label {
    font-size: 0.9rem;
    margin-bottom: 1rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
  }
  
  .wallpaper-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 1rem;
    width: 100%;
  }
  
  .wallpaper-option {
    position: relative;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.2s ease;
    border: 2px solid transparent;
  }
  
  .wallpaper-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .wallpaper-option.active {
    border-color: rgba(10, 132, 255, 1);
    box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.4);
  }
  
  .wallpaper-option img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .focus-active .focus-content {
    background-color: rgba(18, 18, 18, 0.5);
  }
  
  .focus-active .focus-timer {
    font-size: 9rem;
  }
  
  .focus-active .focus-goal {
    font-size: 1.8rem;
    margin-bottom: 0;
  }
  
  .focus-active .focus-settings, 
  .focus-active .wallpaper-selector, 
  .focus-active .start-focus-btn {
    display: none;
  }
  
  @media (max-width: 768px) {
    .focus-content {
      padding: 1.5rem;
    }
    
    .focus-timer {
      font-size: 5rem;
    }
    
    .focus-active .focus-timer {
      font-size: 6rem;
    }
    
    .focus-goal {
      font-size: 1.3rem;
    }
    
    .focus-active .focus-goal {
      font-size: 1.5rem;
    }
    
    .wallpaper-grid {
      grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    }
  }
  `;
  document.head.appendChild(style);
}

// Create the focus mode container and add it to the body
function createFocusMode() {
  const focusModeContainer = document.createElement('div');
  focusModeContainer.id = 'focusModeContainer';
  focusModeContainer.className = 'focus-mode-container';
  
  // Wallpaper background
  const wallpaper = document.createElement('img');
  wallpaper.className = 'focus-wallpaper';
  wallpaper.id = 'focusWallpaper';
  wallpaper.src = "https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1";
  wallpaper.alt = 'Focus mode wallpaper';
  focusModeContainer.appendChild(wallpaper);
  
  // Main content container
  const content = document.createElement('div');
  content.className = 'focus-content';
  
  // Header with title and exit button
  const header = document.createElement('div');
  header.className = 'focus-mode-header';
  
  const title = document.createElement('h1');
  title.className = 'focus-title';
  title.textContent = 'Focus Mode';
  
  const exitButton = document.createElement('button');
  exitButton.className = 'exit-focus-btn';
  exitButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Exit';
  exitButton.addEventListener('click', exitFocusMode);
  
  header.appendChild(title);
  header.appendChild(exitButton);
  content.appendChild(header);
  
  // Timer display
  const timer = document.createElement('div');
  timer.className = 'focus-timer';
  timer.id = 'focusTimer';
  timer.textContent = '25:00';
  content.appendChild(timer);
  
  // Goal display
  const goal = document.createElement('div');
  goal.className = 'focus-goal';
  goal.id = 'focusGoal';
  goal.textContent = 'What will you accomplish today?';
  content.appendChild(goal);
  
  // Settings section
  const settings = document.createElement('div');
  settings.className = 'focus-settings';
  
  // Time setting
  const timeGroup = document.createElement('div');
  timeGroup.className = 'focus-setting-group';
  
  const timeLabel = document.createElement('div');
  timeLabel.className = 'focus-setting-label';
  timeLabel.textContent = 'Duration (minutes)';
  
  const timeInput = document.createElement('input');
  timeInput.className = 'focus-setting-input';
  timeInput.id = 'focusTimeInput';
  timeInput.type = 'number';
  timeInput.min = '1';
  timeInput.max = '120';
  timeInput.value = '25';

  timeInput.addEventListener('input', function() {
    const minutes = parseInt(this.value, 10) || 25;
    document.getElementById('focusTimer').textContent = `${minutes.toString().padStart(2, '0')}:00`;
  });
  
  timeGroup.appendChild(timeLabel);
  timeGroup.appendChild(timeInput);
  settings.appendChild(timeGroup);
  
  // Goal setting
  const goalGroup = document.createElement('div');
  goalGroup.className = 'focus-setting-group';
  
  const goalLabel = document.createElement('div');
  goalLabel.className = 'focus-setting-label';
  goalLabel.textContent = 'Focus Goal';
  
  const goalInput = document.createElement('input');
  goalInput.className = 'focus-setting-input';
  goalInput.id = 'focusGoalInput';
  goalInput.type = 'text';
  goalInput.placeholder = 'E.g., Complete project proposal';
  
  goalGroup.appendChild(goalLabel);
  goalGroup.appendChild(goalInput);
  settings.appendChild(goalGroup);
  
  // Sound setting
  const soundGroup = document.createElement('div');
  soundGroup.className = 'focus-setting-group';
  
  const soundLabel = document.createElement('div');
  soundLabel.className = 'focus-setting-label';
  soundLabel.textContent = 'Ambient Sound';
  
  const sounds = document.createElement('div');
  sounds.className = 'focus-sounds';
  
  const soundOptions = ['None', 'Rain', 'Forest', 'Ocean'];
  
  soundOptions.forEach(sound => {
    const soundBtn = document.createElement('button');
    soundBtn.className = 'sound-btn';
    soundBtn.textContent = sound;
    soundBtn.dataset.sound = sound.toLowerCase();
    soundBtn.addEventListener('click', () => {
      document.querySelectorAll('.sound-btn').forEach(btn => btn.classList.remove('active'));
      soundBtn.classList.add('active');
    });
    
    if (sound === 'None') {
      soundBtn.classList.add('active');
    }
    
    sounds.appendChild(soundBtn);
  });
  
  soundGroup.appendChild(soundLabel);
  soundGroup.appendChild(sounds);
  settings.appendChild(soundGroup);
  
  content.appendChild(settings);
  
  // Wallpaper selector
  const wallpaperSection = document.createElement('div');
  wallpaperSection.className = 'wallpaper-selector';
  
  const wallpaperLabel = document.createElement('div');
  wallpaperLabel.className = 'wallpaper-label';
  wallpaperLabel.textContent = 'Select Wallpaper';
  wallpaperSection.appendChild(wallpaperLabel);
  
  const wallpaperGrid = document.createElement('div');
  wallpaperGrid.className = 'wallpaper-grid';
  
  // Sample wallpapers - replace with your actual images
  const wallpapers = [
    { src: 'https://images.pexels.com/photos/346529/pexels-photo-346529.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', name: 'Mountains' },
    { src: 'https://wallpapers.com/images/hd/calm-aesthetic-desktop-em3zhejov40rr4yj.jpg', name: 'Ocean' },
    { src: 'https://wallpaperboat.com/wp-content/uploads/2021/04/08/74011/forest-waterfall-19.jpg', name: 'Forest' },
    { src: 'https://wallpapers.com/images/hd/desert-background-6rh4lne85uzkue8w.jpg', name: 'Desert' },
    { src: 'https://i.postimg.cc/j5Hhk4Xk/nightsky.jpg', name: 'Night Sky' }
  ];
  
  wallpapers.forEach((wallpaper, index) => {
    const option = document.createElement('div');
    option.className = index === 0 ? 'wallpaper-option active' : 'wallpaper-option';
    option.dataset.wallpaper = wallpaper.src;
    
    const img = document.createElement('img');
    img.src = wallpaper.src;
    img.alt = wallpaper.name;
    
    option.appendChild(img);
    option.addEventListener('click', () => {
      document.querySelectorAll('.wallpaper-option').forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      activeWallpaper = wallpaper.src;
      document.getElementById('focusWallpaper').src = activeWallpaper;
    });
    
    wallpaperGrid.appendChild(option);
  });
  
  wallpaperSection.appendChild(wallpaperGrid);
  content.appendChild(wallpaperSection);
  
  // Start button
  const startButton = document.createElement('button');
  startButton.className = 'start-focus-btn';
  startButton.textContent = 'Start Focusing';
  startButton.addEventListener('click', startFocusSession);
  content.appendChild(startButton);
  
  focusModeContainer.appendChild(content);
  document.body.appendChild(focusModeContainer);
  
  return focusModeContainer;
}

// Show focus mode
function showFocusMode() {
  if (!focusModeContainer) {
    focusModeContainer = createFocusMode();
  }
  
  // Hide main content
  const mainContent = document.querySelector('main');
  if (mainContent) {
    mainContent.style.display = 'none';
  }
  
  // Show focus mode with fade-in effect
  focusModeContainer.style.display = 'flex';
  setTimeout(() => {
    focusModeContainer.style.opacity = '1';
  }, 10);
}

function exitFocusMode() {
  // Stop timer if running
  if (focusTimer) {
    clearInterval(focusTimer);
    focusTimer = null;
  }
  
  // Stop ambient sound if playing
  if (focusSound) {
    focusSound.pause();
    focusSound = null;
  }
  
  // Stop alarm sound if playing
  if (alarmSound) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    alarmSound = null;
  }

  document.title = "The Chill Zone";
  
  // Hide focus mode with fade-out effect
  focusModeContainer.style.opacity = '0';
  setTimeout(() => {
    focusModeContainer.style.display = 'none';
    
    // Show main content again
    const mainContent = document.querySelector('main');
    if (mainContent) {
      mainContent.style.display = '';
    }
    
    // Reset UI to settings mode
    focusModeContainer.classList.remove('focus-active');
    document.getElementById('focusTimer').textContent = document.getElementById('focusTimeInput').value + ':00';
    document.getElementById('focusGoal').textContent = 'What will you accomplish today?';
  }, 500);
}

// Start the focus session
function startFocusSession() {

  if (focusTimer) {
    clearInterval(focusTimer);
    focusTimer = null;
  }
  
  if (focusSound) {
    focusSound.pause();
    focusSound = null;
  }

  // Get values from inputs
  const minutes = parseInt(document.getElementById('focusTimeInput').value, 10) || 25;
  const goal = document.getElementById('focusGoalInput').value || 'Focus Session';
  
  // Set goal text
  document.getElementById('focusGoal').textContent = goal;
  
  // Calculate end time
  let timeLeft = minutes * 60;
  updateTimerDisplay(timeLeft);
  
  // Switch to active focus mode
  focusModeContainer.classList.add('focus-active');
  
  // Start timer
  focusTimer = setInterval(() => {
    timeLeft--;
    
    if (timeLeft <= 0) {
      clearInterval(focusTimer);
      focusTimer = null;
      
      // Alert user that time is up
      alarmSound = new Audio('./assets/sounds/musical_alarm.mp3');
      alarmSound.play();
      
      // Show completion message
      document.getElementById('focusTimer').textContent = 'Done!';
      document.title = "TCZ | Focus Mode - Done!";
      
      return;
    }
    
    updateTimerDisplay(timeLeft);
  }, 1000);
  
  // Play selected ambient sound
  // Play selected ambient sound with fade-in
const selectedSound = document.querySelector('.sound-btn.active');
if (selectedSound && selectedSound.dataset.sound !== 'none') {
  const soundMap = {
    'rain': './assets/sounds/rain.mp3',
    'forest': './assets/sounds/forest.mp3',
    'ocean': './assets/sounds/ocean.mp3'
  };

  if (soundMap[selectedSound.dataset.sound]) {
    focusSound = new Audio(soundMap[selectedSound.dataset.sound]);
    focusSound.loop = true;
    focusSound.volume = 0; // start silent
    focusSound.play();

    // Fade in over 3 seconds
    const fadeDuration = 5000; // milliseconds
    const intervalTime = 100; // how often we increase the volume
    const targetVolume = 0.3;
    let currentVolume = 0;
    const volumeStep = targetVolume / (fadeDuration / intervalTime);

    const fadeIn = setInterval(() => {
      currentVolume += volumeStep;
      if (currentVolume >= targetVolume) {
        currentVolume = targetVolume;
        clearInterval(fadeIn);
      }
      focusSound.volume = currentVolume;
    }, intervalTime);
  }
}

}

// Update timer display
function updateTimerDisplay(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const timeDisplay = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  document.getElementById('focusTimer').textContent = timeDisplay;
  document.title = `TCZ | Focus Mode - ${timeDisplay}`;
}

// Initialize focus mode system
export function initializeFocusMode() {
  // Inject styles
  injectFocusModeStyles();
  
  // Find focus button and attach event listener
  const focusButton = document.getElementById('taskbarFocusBtn');
  if (focusButton) {
    focusButton.addEventListener('click', showFocusMode);
  } else {
    console.warn("Focus button with ID 'taskbarFocusBtn' not found");
  }
}

// Initialize on DOM content loaded
export function initFocusModeOnLoad() {
  window.addEventListener('DOMContentLoaded', initializeFocusMode);
}

// Export any functions or variables that might be needed externally
export {
  showFocusMode,
  exitFocusMode
};
