document.addEventListener("DOMContentLoaded", () => {


    // ------------------ START OF INITIALIZATION CODE FOR NEWCOMERS --------------------

    // Injecting keyframes into the document
    function injectKeyframes() {
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes fadeInPopup {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(style);
    }

    injectKeyframes();

    function createBackdrop() {
        const backdrop = document.createElement("div");
        backdrop.id = "backdrop";
        backdrop.style = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 1); /* Fully Pitch Black */
            z-index: 998;
            display: block;
            opacity: 0;
            animation: fadeIn 0s forwards;
        `;
        document.body.appendChild(backdrop);
    }

    function removeBackdrop() {
        const backdrop = document.getElementById("backdrop");
        if (backdrop) {
            backdrop.style.animation = "fadeOut 0.5s forwards";
            setTimeout(() => {
                document.body.removeChild(backdrop);
            }, 500);
        }
    }

    function createUsernamePopup() {
        createBackdrop(); 

        const popup = document.createElement('div');
        popup.style = popupContainerStyle();

        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your username';
        input.style = inputFieldStyle();

        const button = document.createElement('button');
        button.textContent = 'Submit';
        button.style = submitButtonStyle('#4CAF50');

        button.onclick = function () {
            const username = input.value.trim();
            if (username) {
                localStorage.setItem('username', username);
                document.body.removeChild(popup);
                removeBackdrop(); 
                showProfileSelection();
            } else {
                alert('Please enter a valid username.');
            }
        };

        popup.appendChild(input);
        popup.appendChild(button);
        document.body.appendChild(popup);
        popup.style.animation = "fadeInPopup 0.5s forwards";
    }

    function showProfileSelection() {
        createBackdrop(); 

        const profilePopup = document.createElement('div');
        profilePopup.style = profileSelectionPopupStyle();

        const title = document.createElement('h3');
        title.textContent = 'Select Your Profile Picture';
        title.style = `color: #333; margin-bottom: 20px;`;

        const imgContainer = document.createElement('div');
        imgContainer.style = `display: flex; justify-content: center; gap: 15px;`;

        const img1 = createProfileImage("https://static-00.iconduck.com/assets.00/profile-circle-icon-256x256-cm91gqm2.png");
        const img2 = createProfileImage("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b8d517e6-2c88-453b-8d3a-3f79ff39b7c0/dgmmn3s-46371f14-ee56-425a-9cfc-a2d565bf192f.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2I4ZDUxN2U2LTJjODgtNDUzYi04ZDNhLTNmNzlmZjM5YjdjMFwvZGdtbW4zcy00NjM3MWYxNC1lZTU2LTQyNWEtOWNmYy1hMmQ1NjViZjE5MmYucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BI_m7F3HyOW5hmcwfrEFDj63TlBcx5sDXlUgCO6K3YQ");
        const img3 = createProfileImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfYJBRF3wwyf2PDriXg1j7FqXLEX2MWmOzgQ&s");
        const img4 = createProfileImage("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDqGvrz8GusNuKYmFFR6YjHsmkwJiI_AHR3w&s");

        imgContainer.appendChild(img1);
        imgContainer.appendChild(img2);
        imgContainer.appendChild(img3);
        imgContainer.appendChild(img4);

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.style = submitButtonStyle('#007bff');

        let selectedImage = null;

        function createProfileImage(src) {
            const img = document.createElement('img');
            img.src = src;
            img.style = profileImageStyle();

            img.onclick = function () {
                selectedImage = src;
                img1.style.border = '2px solid transparent';
                img2.style.border = '2px solid transparent';
                img3.style.border = '2px solid transparent';
                img4.style.border = '2px solid transparent';
                img.style.border = '2px solid blue';
            };

            return img;
        }

        saveButton.onclick = function () {
            if (selectedImage) {
                localStorage.setItem('profilePicture', selectedImage);
                document.body.removeChild(profilePopup);
                removeBackdrop();
                updateProfileUI();
            } else {
                alert('Please select a profile picture.');
            }
        };

        profilePopup.appendChild(title);
        profilePopup.appendChild(imgContainer);
        profilePopup.appendChild(saveButton);
        document.body.appendChild(profilePopup);
        profilePopup.style.animation = "fadeInPopup 0.5s forwards";
    }

    function updateProfileUI() {
        const username = localStorage.getItem('username');
        const profilePicture = localStorage.getItem('profilePicture');

        let usernameElement = document.getElementById("username");
        let profileImage = document.getElementById("profileIcon");

        if (usernameElement) usernameElement.textContent = `${username}`;
        if (profileImage && profilePicture) profileImage.src = profilePicture;
    }

    function checkUserProfile() {
        const storedUsername = localStorage.getItem('username');
        const storedProfilePicture = localStorage.getItem('profilePicture');

        if (storedUsername && storedProfilePicture) {
            updateProfileUI();
        } else if (storedUsername) {
            showProfileSelection();
        } else {
            createUsernamePopup();
        }
    }

    // Styles
    function popupContainerStyle() {
        return `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 40px;
            background-color: rgba(255, 255, 255, 1);
            color: black;
            border-radius: 12px;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            opacity: 0;
            animation: fadeInPopup 0.5s forwards;
        `;
    }

    function profileSelectionPopupStyle() {
        return `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 40px;
            background-color: white;
            border-radius: 12px;
            text-align: center;
            z-index: 1000;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            opacity: 0;
            animation: fadeInPopup 0.5s forwards;
        `;
    }

    function submitButtonStyle(color) {
        return `
            margin-top: 20px;
            padding: 15px 25px;
            background-color: ${color};
            color: white;
            border-radius: 8px;
            cursor: pointer;
            border: none;
            font-size: 16px;
            transition: all 0.3s ease;
        `;
    }

    function inputFieldStyle() {
        return `
            padding: 12px 15px;
            font-size: 16px;
            border-radius: 8px;
            border: 2px solid #ccc;
            outline: none;
            margin-bottom: 20px;
            transition: all 0.3s ease-in-out;
        `;
    }

    function profileImageStyle() {
        return `
            width: 80px;
            height: 80px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            border-radius: 50%;
        `;
    }

    checkUserProfile();

    
    // ------------------ END OF INITIALIZATION CODE FOR NEWCOMERS -------------------------
    

    var rainParticlesCheck = document.getElementById("particlesButtonRain");
    var snowParticlesCheck = document.getElementById("particlesButtonSnow");
    var stormWeatherCheck = document.getElementById("weatherButtonsStorm");
    var blizzardWeatherCheck = document.getElementById("weatherButtonsBlizzard");

    const rainGifImage = document.getElementById("rainGifImage");
    const rainGif = document.getElementById("rainGif");
    const particlesButtonRain = document.getElementById("particlesButtonRain");
    const snowGifImage = document.getElementById("snowGifImage");
    const snowGif = document.getElementById("snowGif");
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




    function enableSnowParticles () {

        if (snowGifImage.style.visibility === "visible") {
            snowGifImage.style.visibility = "hidden";
            snowGif.style.visibility = "hidden";
            particlesButtonSnow.textContent = "Enable";

            rainParticlesCheck.disabled = false;
            stormWeatherCheck.disabled = false;
            blizzardWeatherCheck.disabled = false;
        } else {
            snowGifImage.style.visibility = "visible";
            snowGif.style.visibility = "visible";
            particlesButtonSnow.textContent = "Disable";

            rainParticlesCheck.disabled = true;
            stormWeatherCheck.disabled = true;
            blizzardWeatherCheck.disabled = true;
        }
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





    function enableStorm() {

        if (rainGifImage.style.visibility === "visible") {
            // Hide the rain GIFs and change button text to "Enable"
            rainGifImage.style.visibility = "hidden";
            rainGif.style.visibility = "hidden";
            lightningGifImage.style.visibility = "hidden";
            lightningGif.style.visibility = "hidden";
            weatherButtonsStorm.textContent = "Enable";

            rainParticlesCheck.disabled = false;
            snowParticlesCheck.disabled = false;
            blizzardWeatherCheck.disabled = false;
        } else {
            // Show the rain GIFs and change button text to "Disable"
            rainGifImage.style.visibility = "visible";
            rainGif.style.visibility = "visible";
            lightningGifImage.style.visibility = "visible";
            lightningGif.style.visibility = "visible";
            weatherButtonsStorm.textContent = "Disable";

            rainParticlesCheck.disabled = true;
            snowParticlesCheck.disabled = true;
            blizzardWeatherCheck.disabled = true;
        }
    }

    if (weatherButtonsStorm) {
        weatherButtonsStorm.addEventListener("click", enableStorm);
    }

    // ------------ END OF WEATHER BUTTONS JS ------------------






    //----------- CODE FOR BACKGROUND IMAGE CHANGING ------------------

    
    var wallpaperBg1Btn = document.getElementById("wallpaperBg1Btn");
    var wallpaperBg2Btn = document.getElementById("wallpaperBg2Btn");
    var wallpaperBg3Btn = document.getElementById("wallpaperBg3Btn");
    var wallpaperBg4Btn = document.getElementById("wallpaperBg4Btn");




    
    function background1Transition() {

        document.body.style.backgroundImage = "url('https://wallpapers.com/images/featured/lo-fi-mvqzjym6ie17firw.jpg')";

        wallpaperBg1Btn.textContent = "Chosen";
        wallpaperBg1Btn.disabled = true;
        wallpaperBg2Btn.disabled = false;
        wallpaperBg2Btn.textContent = "Choose";
        wallpaperBg3Btn.disabled = false;
        wallpaperBg3Btn.textContent = "Choose";
        wallpaperBg4Btn.disabled = false;
        wallpaperBg4Btn.textContent = "Choose";
    }

    if (wallpaperBg1Btn) {
        wallpaperBg1Btn.addEventListener("click", background1Transition);
    }








    function background2Transition() {

        document.body.style.backgroundImage = "url('https://i.pinimg.com/originals/66/29/ac/6629ac69eee96adbe0880b4f06afdc26.gif')";
    
        wallpaperBg1Btn.disabled = false;
        wallpaperBg1Btn.textContent = "Choose";
        wallpaperBg2Btn.textContent = "Chosen";
        wallpaperBg2Btn.disabled = true;
        wallpaperBg3Btn.disabled = false;
        wallpaperBg3Btn.textContent = "Choose";
        wallpaperBg4Btn.disabled = false;
        wallpaperBg4Btn.textContent = "Choose";
    }

    if (wallpaperBg2Btn) {
        wallpaperBg2Btn.addEventListener("click", background2Transition);
    }





    function background3Transition() {

        document.body.style.backgroundImage = "url('https://s.widget-club.com/images/YyiR86zpwIMIfrCZoSs4ulVD9RF3/293280da671a76a539b89abbce741e3c/309059649f6c758fb2223a2fea97527d.jpg')";
    
        wallpaperBg1Btn.disabled = false;
        wallpaperBg1Btn.textContent = "Choose";
        wallpaperBg2Btn.disabled = false;
        wallpaperBg2Btn.textContent = "Choose";
        wallpaperBg3Btn.textContent = "Chosen";
        wallpaperBg3Btn.disabled = true;
        wallpaperBg4Btn.disabled = false;
        wallpaperBg4Btn.textContent = "Choose";
    }

    if (wallpaperBg3Btn) {
        wallpaperBg3Btn.addEventListener("click", background3Transition);
    }





    function background4Transition() {

        document.body.style.backgroundImage = "url('https://i.postimg.cc/fWGb9PSP/Untitled-design-2.png')";

        wallpaperBg1Btn.disabled = false;
        wallpaperBg1Btn.textContent = "Choose";
        wallpaperBg2Btn.disabled = false;
        wallpaperBg2Btn.textContent = "Choose";
        wallpaperBg3Btn.disabled = false;
        wallpaperBg3Btn.textContent = "Choose";
        wallpaperBg4Btn.textContent = "Chosen";
        wallpaperBg4Btn.disabled = true;
    }

    if (wallpaperBg4Btn) {
        wallpaperBg4Btn.addEventListener("click", background4Transition);
    }

    if (document.getElementById("wallpaperBg1Btn").textContent=="Chosen") {

        wallpaperBg1Btn.disabled = true;

        wallpaperBg2Btn.textContent = "Choose";
        wallpaperBg3Btn.textContent = "Choose";
        wallpaperBg4Btn.textContent = "Choose";
    } else if (document.getElementById("wallpaperBg2Btn").textContent=="Chosen") {

        wallpaperBg2Btn.disabled = true;

        wallpaperBg1Btn.textContent = "Choose";
        wallpaperBg3Btn.textContent = "Choose";
        wallpaperBg4Btn.textContent = "Choose";
    } else if (document.getElementById("wallpaperBg3Btn").textContent=="Chosen") {

        wallpaperBg3Btn.disabled = true;

        wallpaperBg1Btn.textContent = "Choose";
        wallpaperBg2Btn.textContent = "Choose";
        wallpaperBg4Btn.textContent = "Choose";
    } else if (document.getElementById("wallpaperBg4Btn").textContent=="Chosen") {

        wallpaperBg4Btn.disabled = true;

        wallpaperBg1Btn.textContent = "Choose";
        wallpaperBg2Btn.textContent = "Choose";
        wallpaperBg3Btn.textContent = "Choose";
    }

    //------------- END OF WALLPAPER CODE -------------------





    // Audio player code

    const songs = [
        { title: "", artist: "", src: ""},
        { title: "CARNIVAL", artist: "Kanye West, Ty Dolla $ign", src: "https://www.dropbox.com/scl/fi/jdm2pc5i0z4tssbtf6t2c/12-Carnival.mp3?rlkey=n9ncc8egcnwes2a9bw5660dky&st=cn0g5e0o&raw=1" },
        { title: "BURN", artist: "Kanye West, Ty Dolla $ign", src: "https://www.dropbox.com/scl/fi/kptzdit2rgx87d1uizdzb/09-Burn.mp3?rlkey=ukc7xnuxbvr1epg27ps2dg5be&st=py6tbav3&raw=1" },
        { title: "Magnolia", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/91dvrw5bzro2p89fddcyf/spotifydown.com-Magnolia-Playboi-Carti.mp3?rlkey=z6zq0vva6dimgy39ywilvtuwf&st=3l1tw5pz&raw=1" },
        { title: "IDGAF", artist: "BoyWithUke, blackbear", src: "https://www.dropbox.com/scl/fi/5c858z7y3ouz8nqem6jxd/spotifydown.com-IDGAF-with-blackbear-BoyWithUke.mp3?rlkey=1fa4hysag7ggge2u6sh5nyawh&st=m0l0ao9o&raw=1" },
        { title: "Save Your Tears", artist: "The Weeknd", src: "https://www.dropbox.com/scl/fi/20acf6hqe3zrbb4ywg9v4/spotifydown.com-Save-Your-Tears-The-Weeknd.mp3?rlkey=klhtvkr7f4wwuzwnui1a2bwzi&st=edx0mba0&raw=1" },
        { title: "Kerosene", artist: "Crystal Castles", src: "https://www.dropbox.com/scl/fi/pssm1vnhnf6yfbkzuz9yf/spotifydown.com-Kerosene-Crystal-Castles.mp3?rlkey=xzbkqsfjxhq8eyrv91nbchiv3&st=05674r11&raw=1"},
        { title: "3D OUTRO", artist: "LUCKI", src: "https://www.dropbox.com/scl/fi/gh1o71q4315gzhof9l45l/spotifydown.com-3D-Outro-LUCKI.mp3?rlkey=bfrc47lgyt4d1y6w7mc1pfw2q&st=fndbxgh7&raw=1"},
        { title: "Diamonds (feat. Gunna)", artist: "Young Thug, Gunna", src: "https://www.dropbox.com/scl/fi/q0sexnbnjgssrwy6xqack/spotifydown.com-Diamonds-feat.-Gunna-Young-Thug.mp3?rlkey=x7v1rwuc3j5tu12xt7u0riwps&st=bdwwpevw&raw=1" },
        { title: "ILoveUIHateU", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/t0cypq0lvqe0xiehfhai4/spotifydown.com-ILoveUIHateU-Playboi-Carti.mp3?rlkey=6utr3gxwy2ggdhb9rxghxtm3e&st=cn00wqkv&raw=1" },
        { title: "New N3on", artist: "Playboi Carti", src: "https://www.dropbox.com/scl/fi/wi1sae8fogv4bgdk5ei8y/spotifydown.com-New-N3on-Playboi-Carti.mp3?rlkey=0qkhbb16iy1iqxep7jzfa32o6&st=ehj7wx21&raw=1" },
        { title: "Our Time", artist: "Lil Tecca", src: "https://www.dropbox.com/scl/fi/adiktphs5yqeweepi3p29/spotifydown.com-Our-Time-Lil-Tecca.mp3?rlkey=h521ror9j3s5asc9ewbcx5diw&st=p9xkgdnj&raw=1" },
        { title: "Gang Baby", artist: "NLE Choppa", src: "https://www.dropbox.com/scl/fi/yqxibbvz1b4a4edv7ojr0/spotifydown.com-Gang-Baby-NLE-Choppa.mp3?rlkey=pd51n0sxphvyi2ets34bnddjt&st=8enciim4&raw=1" },
    ];

    let currentSongIndex = 0;
    let isAutoplayEnabled = true; // Default to autoplay ON
    let isDragging = false;

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

    function populatePlaylist() {
        playlistDropdown.innerHTML = "";
        songs.forEach((song, index) => {
            const option = document.createElement("option");
            option.value = index;
            option.textContent = `${song.title} - ${song.artist}`;
            playlistDropdown.appendChild(option);
        });
    }

    function loadSong(index) {
        if (index === 0) { // Check if the first item (empty) is selected
            songTitle.textContent = "Nothing is selected";
            songArtist.textContent = "";
            audio.src = ""; // Clear audio source
            audio.pause();
            playButton.textContent = "▶";
            return;
        }
    
        currentSongIndex = index;
        const song = songs[index];
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        audio.src = song.src;
        playlistDropdown.value = currentSongIndex; // Update dropdown selection
        audio.currentTime = 0; // Reset the progress bar
    
        audio.play(); // Play the song immediately
        playButton.textContent = audio.paused ? "▶" : "❚❚";
    }
    

    function playPause() {
        if (audio.paused) {
            audio.play();
            playButton.textContent = "❚❚";
            const song = songs[currentSongIndex];
        } else {
            audio.pause();
            playButton.textContent = "▶";
        }
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
    }

    autoplayButton.addEventListener("click", () => {
        isAutoplayEnabled = !isAutoplayEnabled;
        autoplayButton.textContent = `Autoplay: ${isAutoplayEnabled ? "On" : "Off"}`;
    });

    audio.addEventListener("ended", () => {
        if (isAutoplayEnabled) {
            nextSong();
        }
    });

    playButton.addEventListener("click", playPause);
    nextButton.addEventListener("click", nextSong);
    prevButton.addEventListener("click", prevSong);

    playlistDropdown.addEventListener("change", (e) => {
        loadSong(parseInt(e.target.value)); // Load the selected song
    });

    audio.addEventListener("timeupdate", () => {
        progress.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
        progressThumb.style.left = `${(audio.currentTime / audio.duration) * 100}%`;
        currentTime.textContent = formatTime(audio.currentTime);
        totalDuration.textContent = formatTime(audio.duration);
    });

    volumeSlider.addEventListener("input", () => {
        audio.volume = volumeSlider.value;
    });

    progressBar.addEventListener("click", (e) => {
        const clickX = e.offsetX;
        const width = progressBar.clientWidth;
        audio.currentTime = (clickX / width) * audio.duration;

        playButton.textContent = "❚❚";
    });

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    window.onload = () => {
        populatePlaylist();
        loadSong(0); // Load the first song

        songTitle.textContent = "Nothing is playing";
        
    };


    // ------------- END OF AUDIO PLAYER CODE -----------------



    // To Do List

    const todoList = document.getElementById('todo-list');
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



    // ---------------- START OF MORE BUTTON JS ---------------

    const moreBtn = document.getElementById("more-btn");

    moreBtn.addEventListener('click', () => {

        const morePanelOverlay = document.createElement('div');
        morePanelOverlay.style.position = "fixed";
        morePanelOverlay.style.top = "0";
        morePanelOverlay.style.left = "0";
        morePanelOverlay.style.width = "100vw";
        morePanelOverlay.style.height = "100vh";
        morePanelOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // dark semi-transparent eh
        morePanelOverlay.style.zIndex = "400"; // making sure it is behind the panel
        morePanelOverlay.style.transition = "opacity 0.3s ease-in-out";


        const morePanel = document.createElement('div');
        morePanel.style.height = "70vh";
        morePanel.style.width = "70vw";
        morePanel.style.zIndex = "500";
        morePanel.style.backgroundColor = "black";
        morePanel.style.position = "absolute";
        morePanel.style.top = "50%";
        morePanel.style.left = "50%";
        morePanel.style.display = "flex";
        morePanel.style.justifyContent = "center";
        morePanel.style.alignItems = "center";
        morePanel.style.transform = "translate(-50%, -50%)";
        morePanel.style.borderRadius = "15px";
        morePanel.style.transition = "transform 0.3s ease-in-out";


        morePanel.addEventListener("mouseover", () => {
            morePanel.style.transform = "translate(-50%, -50%) scale(1.02)";
        });

        morePanel.addEventListener("mouseout", () => {
            morePanel.style.transform = "translate(-50%, -50%) scale(1)";
        });



        const morePanelClose = document.createElement('button');
        morePanelClose.style.height = "30px";
        morePanelClose.style.width = "50px";
        morePanelClose.innerHTML = "&times";
        morePanelClose.style.fontSize = "20px";
        morePanelClose.style.border = "none";
        morePanelClose.style.transition = "transform 0.3s ease-in-out";
        morePanelClose.style.cursor = "pointer";
        morePanelClose.style.borderRadius = "10px";
        
        morePanelClose.addEventListener("mouseover", () => {
            morePanelClose.style.transform = "scale(1.15)";
        });

        morePanelClose.addEventListener("mouseout", () => {
            morePanelClose.style.transform = "scale(1)";
        });

        morePanelClose.addEventListener('click', () => {
            morePanel.remove();
            morePanelOverlay.remove();
        });


        document.body.appendChild(morePanel);
        document.body.appendChild(morePanelOverlay);
        morePanel.appendChild(morePanelClose);
    });



    // ------------------ END OF MORE BUTTON JS-------------------


    // ------------------ START OF SETTINGS BUTTON JS -----------------

    const settingsBtn = document.getElementById("settings-btn");

    settingsBtn.addEventListener('click', () => {
        const settingsPanelOverlay = document.createElement('div');
        settingsPanelOverlay.style.position = "fixed";
        settingsPanelOverlay.style.top = "0";
        settingsPanelOverlay.style.left = "0";
        settingsPanelOverlay.style.width = "100vw";
        settingsPanelOverlay.style.height = "100vh";
        settingsPanelOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        settingsPanelOverlay.style.zIndex = "400"; 
        settingsPanelOverlay.style.opacity = "0"; // Start hidden
        settingsPanelOverlay.style.transition = "opacity 0.3s ease-in-out";

        const settingsPanel = document.createElement('div');
        settingsPanel.style.height = "75vh";
        settingsPanel.style.width = "70vw";
        settingsPanel.style.zIndex = "500";
        settingsPanel.style.position = "absolute";
        settingsPanel.style.top = "50%";
        settingsPanel.style.left = "50%";
        settingsPanel.style.display = "flex";
        settingsPanel.style.justifyContent = "center";
        settingsPanel.style.alignItems = "center";
        settingsPanel.style.transform = "translate(-50%, -50%) scale(0.95)";
        settingsPanel.style.borderRadius = "15px";
        settingsPanel.style.overflow = "hidden";
        settingsPanel.style.border = "8px solid black";
        settingsPanel.style.opacity = "0"; // Start hidden
        settingsPanel.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";

        const settingsPanelBg = document.createElement('div');
        settingsPanelBg.style.position = "absolute";
        settingsPanelBg.style.top = "0";
        settingsPanelBg.style.left = "0";
        settingsPanelBg.style.width = "100%";
        settingsPanelBg.style.height = "100%";
        settingsPanelBg.style.backgroundImage = "url('https://i.postimg.cc/hvwphNzQ/ezgif-com-resize.gif')";
        settingsPanelBg.style.backgroundSize = "cover";
        settingsPanelBg.style.backgroundPosition = "center";
        settingsPanelBg.style.backgroundRepeat = "no-repeat";
        settingsPanelBg.style.filter = "blur(5px)"; 
        settingsPanelBg.style.zIndex = "-1"; 

        const settingsPanelClose = document.createElement('button');
        settingsPanelClose.style.height = "30px";
        settingsPanelClose.style.width = "50px";
        settingsPanelClose.innerHTML = "&times;";
        settingsPanelClose.style.fontSize = "20px";
        settingsPanelClose.style.border = "none";
        settingsPanelClose.style.cursor = "pointer";
        settingsPanelClose.style.borderRadius = "10px";
        settingsPanelClose.style.zIndex = "1";
        settingsPanelClose.style.transition = "transform 0.2s ease-in-out";

        settingsPanelClose.addEventListener("mouseenter", () => {
            settingsPanelClose.style.transform = "scale(1.15)";
        });

        settingsPanelClose.addEventListener("mouseleave", () => {
            settingsPanelClose.style.transform = "scale(1)";
        });

        settingsPanelClose.addEventListener('click', () => {
            settingsPanel.style.opacity = "0";
            settingsPanel.style.transform = "translate(-50%, -50%) scale(0.95)";
            settingsPanelOverlay.style.opacity = "0";
            
            // Remove elements after fade-out
            setTimeout(() => {
                settingsPanel.remove();
                settingsPanelOverlay.remove();
            }, 300);
        });

        document.body.appendChild(settingsPanelOverlay);
        document.body.appendChild(settingsPanel);
        settingsPanel.appendChild(settingsPanelBg);
        settingsPanel.appendChild(settingsPanelClose);

        // Use a slight delay to allow the transition to take effect
        setTimeout(() => {
            settingsPanel.style.opacity = "1";
            settingsPanel.style.transform = "translate(-50%, -50%) scale(1)";
            settingsPanelOverlay.style.opacity = "1";
        }, 10);
    });



    // ----------------- END OF SETTINGS BUTTON JS -----------------


    // ------------------- START OF PROFILE ICON JS -----------------

    // Load the profile picture from localStorage when the page loads
window.addEventListener('load', () => {
    const profileIcon = document.getElementById("profileIcon");
    const storedProfilePic = localStorage.getItem("profilePic");

    if (storedProfilePic) {
        profileIcon.src = storedProfilePic;
    }
});

const profileIconBtn = document.getElementById("profileIcon");

profileIconBtn.addEventListener('click', () => {
    const pfpPanelOverlay = document.createElement('div');
    pfpPanelOverlay.id = "pfpPanelOverlay";
    pfpPanelOverlay.style.position = "fixed";
    pfpPanelOverlay.style.top = "0";
    pfpPanelOverlay.style.left = "0";
    pfpPanelOverlay.style.width = "100vw";
    pfpPanelOverlay.style.height = "100vh";
    pfpPanelOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    pfpPanelOverlay.style.zIndex = "400";
    pfpPanelOverlay.style.opacity = "0";
    pfpPanelOverlay.style.transition = "opacity 0.3s ease-in-out";

    const pfpPanel = document.createElement('div');
    pfpPanel.style.height = "47vh";
    pfpPanel.style.width = "40vw";
    pfpPanel.style.zIndex = "500";
    pfpPanel.style.position = "absolute";
    pfpPanel.style.top = "50%";
    pfpPanel.style.left = "50%";
    pfpPanel.style.display = "flex";
    pfpPanel.style.flexDirection = "column";
    pfpPanel.style.alignItems = "center";
    pfpPanel.style.transform = "translate(-50%, -50%) scale(0.95)";
    pfpPanel.style.borderRadius = "15px";
    pfpPanel.style.overflow = "hidden";
    pfpPanel.style.border = "8px solid black";
    pfpPanel.style.opacity = "0";
    pfpPanel.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";

    const pfpPanelBg = document.createElement('div');
    pfpPanelBg.style.position = "absolute";
    pfpPanelBg.style.top = "0";
    pfpPanelBg.style.left = "0";
    pfpPanelBg.style.width = "100%";
    pfpPanelBg.style.height = "100%";
    pfpPanelBg.style.backgroundImage = "url('https://img.freepik.com/free-vector/gradient-black-background-with-wavy-lines_23-2149146012.jpg?semt=ais_hybrid')";
    pfpPanelBg.style.backgroundSize = "cover";
    pfpPanelBg.style.backgroundPosition = "center";
    pfpPanelBg.style.backgroundRepeat = "no-repeat";
    pfpPanelBg.style.zIndex = "-1";

    const pfpPanelHeader = document.createElement('div');
    pfpPanelHeader.style.display = "flex";
    pfpPanelHeader.style.justifyContent = "center";
    pfpPanelHeader.style.alignItems = "center";
    pfpPanelHeader.style.width = "100%";
    pfpPanelHeader.style.padding = "0 15px";

    const pfpPanelTitle = document.createElement('h2');
    pfpPanelTitle.style.fontSize = "25px";
    pfpPanelTitle.style.color = "white";
    pfpPanelTitle.style.textAlign = "center";
    pfpPanelTitle.textContent = "Change Profile Picture";
    pfpPanelTitle.style.fontFamily = "'IBM Plex Mono', serif";
    pfpPanelTitle.style.textAlign = "center";

    // Close button
    const closeButton = document.createElement("button");
    closeButton.style.height = "100%";
    closeButton.style.width = "7vw";
    closeButton.textContent = "Cancel";
    closeButton.style.backgroundColor = "transparent";
    closeButton.style.borderRadius = "10px";
    closeButton.style.border = "3px solid white";
    closeButton.style.fontSize = "15px";
    closeButton.style.color = "white";
    closeButton.style.cursor = "pointer";
    closeButton.style.transition = "transform 0.3s ease-in-out";

    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.transform = "scale(1.1)";
    });

    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.transform = "scale(1)";
    });

    closeButton.addEventListener("click", () => {
        pfpPanel.style.opacity = "0";
        pfpPanelOverlay.style.opacity = "0";
    
        setTimeout(() => {
            pfpPanelOverlay.remove();
            pfpPanel.remove();
        }, 300);
    });

    const pfpPanelContainers = document.createElement('div');
    pfpPanelContainers.style.width = "85%";
    pfpPanelContainers.style.height = "27vh";
    pfpPanelContainers.style.display = "flex";
    pfpPanelContainers.style.justifyContent = "center";
    pfpPanelContainers.style.alignItems = "center";
    pfpPanelContainers.style.gap = "2%";
    // pfpPanelContainers.style.backgroundColor = "red";

    const pfpPanelItemContainer = document.createElement('div');
    pfpPanelItemContainer.style.display = "flex";
    pfpPanelItemContainer.style.flexDirection = "column";
    pfpPanelItemContainer.style.justifyContent = "center";
    pfpPanelItemContainer.style.alignItems = "center";
    pfpPanelItemContainer.style.width = "70%";
    pfpPanelItemContainer.style.height = "27vh";
    pfpPanelItemContainer.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    pfpPanelItemContainer.style.border = "5px solid white";
    pfpPanelItemContainer.style.borderRadius = "10px";

    const pfpPanelCurrentPfpContainer = document.createElement('div');
    pfpPanelCurrentPfpContainer.style.display = "flex";
    pfpPanelCurrentPfpContainer.style.flexDirection = "column";
    pfpPanelCurrentPfpContainer.style.justifyContent = "center";
    pfpPanelCurrentPfpContainer.style.alignItems = "center";
    pfpPanelCurrentPfpContainer.style.width = "30%";
    pfpPanelCurrentPfpContainer.style.height = "27vh";
    pfpPanelCurrentPfpContainer.style.backgroundColor = "rgba(255, 255, 255, 0.3)";
    pfpPanelCurrentPfpContainer.style.border = "5px solid white";
    pfpPanelCurrentPfpContainer.style.borderRadius = "10px";

    const pfpPanelRow1Container = document.createElement('div');
    pfpPanelRow1Container.style.display = "flex";
    pfpPanelRow1Container.style.justifyContent = "center";
    pfpPanelRow1Container.style.alignItems = "center";
    pfpPanelRow1Container.style.width = "90%";
    pfpPanelRow1Container.style.height = "10vh";
    // pfpPanelRow1Container.style.backgroundColor = "blue";

    const pfpPanelIcon1 = document.createElement('img');
    pfpPanelIcon1.id = "currentPfp";
    pfpPanelIcon1.style.width = "70px";
    pfpPanelIcon1.style.height = "70px";
    pfpPanelIcon1.style.borderRadius = "50%";
    pfpPanelIcon1.style.padding = "10px";
    // pfpPanelIcon1.style.border = "5px solid black";
    pfpPanelIcon1.src = localStorage.getItem("profilePicture");
    pfpPanelIcon1.style.transition = "transform 0.3s ease-in-out";

    pfpPanelIcon1.addEventListener('mouseenter', () => {
        pfpPanelIcon1.style.transform = "scale(1.05)";
    });

    pfpPanelIcon1.addEventListener('mouseleave', () => {
        pfpPanelIcon1.style.transform = "scale(1)";
    });

    const pfpPanelBtnContainer = document.createElement('div');
    pfpPanelBtnContainer.style.display = "flex";
    pfpPanelBtnContainer.style.justifyContent = "center";
    pfpPanelBtnContainer.style.alignItems = "center";
    pfpPanelBtnContainer.style.width = "80%";
    pfpPanelBtnContainer.style.height = "5vh";
    pfpPanelBtnContainer.style.marginTop = "20px";
    pfpPanelBtnContainer.style.gap = "1vw";
    pfpPanelBtnContainer.style.marginBottom = "2.5vh";

    const pfpPanelSelectBtn = document.createElement('button');
    pfpPanelSelectBtn.disabled = true;
    pfpPanelSelectBtn.style.height = "100%";
    pfpPanelSelectBtn.style.width = "7vw";
    pfpPanelSelectBtn.textContent = "Select";
    pfpPanelSelectBtn.style.backgroundColor = "#ccc";
    pfpPanelSelectBtn.style.borderRadius = "10px";
    pfpPanelSelectBtn.style.border = "3px solid white";
    pfpPanelSelectBtn.style.fontSize = "15px";
    pfpPanelSelectBtn.style.color = "white";
    pfpPanelSelectBtn.style.cursor = "not-allowed";
    pfpPanelSelectBtn.style.transition = "transform 0.3s ease-in-out";

    pfpPanelSelectBtn.addEventListener('mouseenter', () => {
        pfpPanelSelectBtn.style.transform = "scale(1.05)";
    });

    pfpPanelSelectBtn.addEventListener('mouseleave', () => {
        pfpPanelSelectBtn.style.transform = "scale(1)";
    });

    const pfpPanelUploadBtn = document.createElement('button');
    pfpPanelUploadBtn.style.height = "100%";
    pfpPanelUploadBtn.style.width = "8vw";
    pfpPanelUploadBtn.textContent = "Upload Image";
    pfpPanelUploadBtn.style.backgroundColor = "transparent";
    pfpPanelUploadBtn.style.borderRadius = "10px";
    pfpPanelUploadBtn.style.border = "3px solid white";
    pfpPanelUploadBtn.style.fontSize = "15px";
    pfpPanelUploadBtn.style.color = "white";
    pfpPanelUploadBtn.style.cursor = "pointer";
    pfpPanelUploadBtn.style.transition = "transform 0.3s ease-in-out";

    pfpPanelUploadBtn.addEventListener('mouseenter', () => {
        pfpPanelUploadBtn.style.transform = "scale(1.05)";
    });

    pfpPanelUploadBtn.addEventListener('mouseleave', () => {
        pfpPanelUploadBtn.style.transform = "scale(1)";
    });

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.style.display = "none";

    pfpPanelUploadBtn.addEventListener("click", () => {
        pfpPanel.remove();

        const uploadImgPanel = document.createElement('div');
        uploadImgPanel.id = "uploadImgPanel";
        uploadImgPanel.style.height = "37vh";
        uploadImgPanel.style.width = "30vw";
        uploadImgPanel.style.zIndex = "500";
        uploadImgPanel.style.position = "absolute";
        uploadImgPanel.style.top = "50%";
        uploadImgPanel.style.left = "50%";
        uploadImgPanel.style.display = "flex";
        uploadImgPanel.style.flexDirection = "column";
        uploadImgPanel.style.alignItems = "center";
        uploadImgPanel.style.transform = "translate(-50%, -50%) scale(0.95)";
        uploadImgPanel.style.borderRadius = "15px";
        uploadImgPanel.style.overflow = "hidden";
        uploadImgPanel.style.border = "8px solid black";
        uploadImgPanel.style.opacity = "1";
        uploadImgPanel.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";

        const uploadPanelBg = document.createElement('div');
        uploadPanelBg.style.position = "absolute";
        uploadPanelBg.style.top = "0";
        uploadPanelBg.style.left = "0";
        uploadPanelBg.style.width = "100%";
        uploadPanelBg.style.height = "100%";
        uploadPanelBg.style.backgroundImage = "url('https://img.freepik.com/free-vector/gradient-black-background-with-wavy-lines_23-2149146012.jpg?semt=ais_hybrid')";
        uploadPanelBg.style.backgroundSize = "cover";
        uploadPanelBg.style.backgroundPosition = "center";
        uploadPanelBg.style.backgroundRepeat = "no-repeat";
        uploadPanelBg.style.zIndex = "-1";


        const uploadImgHeader = document.createElement('div');
        uploadImgHeader.style.display = "flex";
        uploadImgHeader.style.justifyContent = "center";
        uploadImgHeader.style.alignItems = "center";
        uploadImgHeader.style.width = "100%";
        uploadImgHeader.style.height = "10vh";
        // uploadImgHeader.style.backgroundColor = "green";
        uploadImgHeader.style.padding = "0 15px";

        const uploadPanelTitle = document.createElement('h2');
        uploadPanelTitle.style.fontSize = "25px";
        uploadPanelTitle.style.color = "white";
        uploadPanelTitle.style.textAlign = "center";
        uploadPanelTitle.textContent = "Upload Picture";
        uploadPanelTitle.style.fontFamily = "'IBM Plex Mono', serif";
        uploadPanelTitle.style.textAlign = "center";


        const uploadImgPlaceholder = document.createElement('img');
        uploadImgPlaceholder.id = "uploadImgPlaceholder";
        uploadImgPlaceholder.style.width = "60px";
        uploadImgPlaceholder.style.height = "60px";
        uploadImgPlaceholder.style.padding = "10px";
        uploadImgPlaceholder.style.backgroundColor = "white";
        uploadImgPlaceholder.src = "https://static-00.iconduck.com/assets.00/upload-icon-2048x2048-eu9n5hco.png";
        uploadImgPlaceholder.style.border = "5px solid white";
        uploadImgPlaceholder.style.borderRadius = "10px";
        uploadImgPlaceholder.style.marginTop = "2%";
        uploadImgPlaceholder.style.cursor = "pointer";
        uploadImgPlaceholder.style.transition = "transform 0.3s ease-in-out";

        uploadImgPlaceholder.addEventListener('mouseenter', () => {
            uploadImgPlaceholder.style.transform = "scale(1.05)";
        });

        uploadImgPlaceholder.addEventListener('mouseleave', () => {
            uploadImgPlaceholder.style.transform = "scale(1)";
        });



        const uploadImgBtnContainer = document.createElement('div');
        uploadImgBtnContainer.style.display = "flex";
        uploadImgBtnContainer.style.justifyContent = "center";
        uploadImgBtnContainer.style.alignItems = "center";
        uploadImgBtnContainer.style.width = "80%";
        uploadImgBtnContainer.style.height = "5vh";
        uploadImgBtnContainer.style.marginTop = "7%";
        uploadImgBtnContainer.style.gap = "1vw";
        uploadImgBtnContainer.style.marginBottom = "2.5vh";


        const upCloseBtn = document.createElement('button');
        upCloseBtn.style.height = "100%";
        upCloseBtn.style.width = "7vw";
        upCloseBtn.textContent = "Cancel";
        upCloseBtn.style.borderRadius = "10px";
        upCloseBtn.style.border = "3px solid white";
        upCloseBtn.style.backgroundColor = "transparent";
        upCloseBtn.style.fontSize = "15px";
        upCloseBtn.style.color = "white";
        upCloseBtn.style.cursor = "pointer";
        upCloseBtn.style.transition = "transform 0.3s ease-in-out";

        upCloseBtn.addEventListener('mouseenter', () => {
            upCloseBtn.style.transform = "scale(1.1)";
        });
    
        upCloseBtn.addEventListener('mouseleave', () => {
            upCloseBtn.style.transform = "scale(1)";
        });

        upCloseBtn.addEventListener("click", () => {
            uploadImgPanel.style.opacity = "0";
            pfpPanelOverlay.style.opacity = "0";
        
            setTimeout(() => {
                pfpPanelOverlay.remove();
                uploadImgPanel.remove();
            }, 300);
        });


        document.body.appendChild(uploadImgPanel);
        uploadImgPanel.appendChild(uploadImgHeader);
        uploadImgHeader.appendChild(uploadPanelTitle);
        uploadImgPanel.appendChild(uploadPanelBg);
        uploadImgPanel.appendChild(uploadImgPlaceholder);
        uploadImgPanel.appendChild(uploadImgBtnContainer);
        uploadImgBtnContainer.appendChild(upCloseBtn);


        uploadImgPlaceholder.addEventListener("click", () => {
            fileInput.click();
        });
    });

    fileInput.addEventListener("change", (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imageUrl = e.target.result;
    
                // Create an image element to load the selected file
                const img = new Image();
                img.src = imageUrl;
    
                img.onload = function () {
                    // Create a canvas to resize the image
                    const canvas = document.createElement("canvas");
                    const ctx = canvas.getContext("2d");
    
                    // Set the canvas size to 90px by 90px
                    canvas.width = 90;
                    canvas.height = 90;
    
                    // Draw the image on the canvas with the new dimensions
                    ctx.drawImage(img, 0, 0, 90, 90);
    
                    // Get the resized image data URL
                    const resizedImageUrl = canvas.toDataURL();
    
                    // Save the resized image URL to localStorage
                    localStorage.setItem("profilePicture", resizedImageUrl);
    
                    // Update the profileIcon and currentPfp with the new image URL
                    document.getElementById("profileIcon").src = resizedImageUrl;
    
                    // Update the uploadImgPlaceholder with the new image
                    const uploadImgPanel = document.getElementById("uploadImgPanel");
                    uploadImgPanel.style.display = "none";
    
                    const successPanelImg = document.createElement('div');
                    successPanelImg.id = "uploadImgPanel";
                    successPanelImg.style.height = "25vh";
                    successPanelImg.style.width = "30vw";
                    successPanelImg.style.zIndex = "500";
                    successPanelImg.style.position = "absolute";
                    successPanelImg.style.top = "50%";
                    successPanelImg.style.left = "50%";
                    successPanelImg.style.display = "flex";
                    successPanelImg.style.flexDirection = "column";
                    successPanelImg.style.alignItems = "center";
                    successPanelImg.style.justifyContent = "center";
                    successPanelImg.style.transform = "translate(-50%, -50%) scale(0.95)";
                    successPanelImg.style.borderRadius = "15px";
                    successPanelImg.style.overflow = "hidden";
                    successPanelImg.style.border = "8px solid black";
                    successPanelImg.style.opacity = "1";
                    successPanelImg.style.transition = "opacity 0.3s ease-in-out, transform 0.3s ease-in-out";
    
                    const successPanelImgBg = document.createElement('div');
                    successPanelImgBg.style.position = "absolute";
                    successPanelImgBg.style.top = "0";
                    successPanelImgBg.style.left = "0";
                    successPanelImgBg.style.width = "100%";
                    successPanelImgBg.style.height = "100%";
                    successPanelImgBg.style.backgroundImage = "url('https://img.freepik.com/free-vector/gradient-black-background-with-wavy-lines_23-2149146012.jpg?semt=ais_hybrid')";
                    successPanelImgBg.style.backgroundSize = "cover";
                    successPanelImgBg.style.backgroundPosition = "center";
                    successPanelImgBg.style.backgroundRepeat = "no-repeat";
                    successPanelImgBg.style.zIndex = "-1";
    
                    const successPanelImgMsg = document.createElement('h2');
                    successPanelImgMsg.style.fontSize = "22px";
                    successPanelImgMsg.style.color = "white";
                    successPanelImgMsg.style.textAlign = "center";
                    successPanelImgMsg.textContent = "Image changed successfully!";
                    successPanelImgMsg.style.fontFamily = "'IBM Plex Mono', serif";
                    successPanelImgMsg.style.textAlign = "center";
    
                    const successPanelImgCloseBtn = document.createElement('button');
                    successPanelImgCloseBtn.style.height = "20%";
                    successPanelImgCloseBtn.style.width = "30%";
                    successPanelImgCloseBtn.textContent = "Close";
                    successPanelImgCloseBtn.style.backgroundColor = "transparent";
                    successPanelImgCloseBtn.style.borderRadius = "10px";
                    successPanelImgCloseBtn.style.border = "3px solid white";
                    successPanelImgCloseBtn.style.marginTop = "2%";
                    successPanelImgCloseBtn.style.fontSize = "15px";
                    successPanelImgCloseBtn.style.color = "white";
                    successPanelImgCloseBtn.style.cursor = "pointer";
                    successPanelImgCloseBtn.style.transition = "transform 0.3s ease-in-out";
    
                    successPanelImgCloseBtn.addEventListener('mouseenter', () => {
                        successPanelImgCloseBtn.style.transform = "scale(1.05)";
                    });
    
                    successPanelImgCloseBtn.addEventListener('mouseleave', () => {
                        successPanelImgCloseBtn.style.transform = "scale(1)";
                    });
    
                    successPanelImgCloseBtn.addEventListener("click", () => {
                        successPanelImg.style.opacity = "0";
    
                        setTimeout(() => {
                            successPanelImg.remove();
                            uploadImgPanel.remove();
                            const pfpPanelOverlay = document.getElementById("pfpPanelOverlay");
                            pfpPanelOverlay.remove();
                        }, 300);
                    });
    
                    document.body.appendChild(successPanelImg);
                    successPanelImg.appendChild(successPanelImgBg);
                    successPanelImg.appendChild(successPanelImgMsg);
                    successPanelImg.appendChild(successPanelImgCloseBtn);
                };
            };
            reader.readAsDataURL(file);
        }
    });
    
    

    document.body.appendChild(pfpPanelOverlay);
    document.body.appendChild(pfpPanel);
    pfpPanel.appendChild(pfpPanelBg);
    pfpPanel.appendChild(pfpPanelHeader);
    pfpPanelHeader.appendChild(pfpPanelTitle);
    pfpPanel.appendChild(pfpPanelContainers);
    pfpPanelContainers.appendChild(pfpPanelItemContainer);
    pfpPanelContainers.appendChild(pfpPanelCurrentPfpContainer);
    pfpPanelItemContainer.appendChild(pfpPanelRow1Container);
    pfpPanelCurrentPfpContainer.appendChild(pfpPanelIcon1);
    pfpPanel.appendChild(pfpPanelBtnContainer);
    pfpPanelBtnContainer.appendChild(pfpPanelUploadBtn);
    pfpPanelBtnContainer.appendChild(pfpPanelSelectBtn);
    pfpPanelBtnContainer.appendChild(closeButton);
    document.body.appendChild(fileInput);

    setTimeout(() => {
        pfpPanel.style.opacity = "1";
        pfpPanel.style.transform = "translate(-50%, -50%) scale(1)";
        pfpPanelOverlay.style.opacity = "1";
    }, 10);
});


    // -------------------- END OF PROFILE ICON JS -------------------


    // --------------- START OF CLOCK JS ---------------------

    let hrs = document.getElementById("hrs");
    let min = document.getElementById("min");
    let sec = document.getElementById("sec");
    let ampm = document.getElementById("ampm");

    // Update the clock every second
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
    }, 1000); // Refresh every second


    // ------------------ END OF CLOCK JS -----------------------

    window.addEventListener("load", () => {
        document.body.style.opacity = "1"; // Trigger fade-in
    });


});
