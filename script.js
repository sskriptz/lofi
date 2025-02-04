document.addEventListener("DOMContentLoaded", () => {


    function createPopup() {
        const popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.padding = '20px';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        popup.style.color = 'white';
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        popup.style.textAlign = 'center';
        popup.style.zIndex = '1000';
    
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter your username';
        input.style.padding = '5px';
        input.style.marginTop = '10px';
        input.style.borderRadius = '5px';
        input.style.border = 'none';
    
        const button = document.createElement('button');
        button.textContent = 'Submit';
        button.style.marginTop = '10px';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
    
        button.onclick = function () {
            const username = input.value.trim();
            if (username) {
                try {
                    localStorage.setItem('username', username);
                    console.log("Username saved:", username);
                    document.body.removeChild(popup);
                    showGreeting(username);
                } catch (error) {
                    console.error("Error accessing localStorage:", error);
                    alert("Local storage is not accessible. Try a different browser or disable incognito mode.");
                }
            } else {
                alert('Please enter a valid username.');
            }
        };
    
        popup.appendChild(input);
        popup.appendChild(button);
        document.body.appendChild(popup);
    }
    
    function showGreeting(username) {
        const greetingDiv = document.createElement('div');
        greetingDiv.style.position = 'fixed';
        greetingDiv.style.top = '50%';
        greetingDiv.style.left = '50%';
        greetingDiv.style.transform = 'translate(-50%, -50%)';
        greetingDiv.style.padding = '20px';
        greetingDiv.style.backgroundColor = 'rgba(0, 128, 0, 0.8)';
        greetingDiv.style.color = 'white';
        greetingDiv.style.borderRadius = '10px';
        greetingDiv.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
        greetingDiv.style.textAlign = 'center';
        greetingDiv.style.zIndex = '1000';
        greetingDiv.style.fontSize = '20px';
    
        greetingDiv.textContent = `Welcome, ${username}!`;
    
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.border = 'none';
        closeButton.style.backgroundColor = '#FF6347';
        closeButton.style.color = 'white';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
    
        closeButton.onclick = function () {
            document.body.removeChild(greetingDiv);
        };
    
        greetingDiv.appendChild(closeButton);
        document.body.appendChild(greetingDiv);
    }
    
    function checkUsername() {
        try {
            const storedUsername = localStorage.getItem('username');
            console.log("Checking stored username:", storedUsername);
    
            if (storedUsername) {
                showGreeting(storedUsername);
            } else {
                createPopup();
            }
        } catch (error) {
            console.error("LocalStorage is blocked:", error);
            alert("Local storage is not accessible. Please check your browser settings.");
            createPopup();
        }
    }
    
    checkUsername();
    
    

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

        // Check the current visibility of the rainGifImage element
        if (rainGifImage.style.visibility === "visible") {
            // Hide the rain GIFs and change button text to "Enable"
            rainGifImage.style.visibility = "hidden";
            rainGif.style.visibility = "hidden";
            particlesButtonRain.textContent = "Enable";

            snowParticlesCheck.disabled = false;
            stormWeatherCheck.disabled = false;
            blizzardWeatherCheck.disabled = false;
        } else {
            // Show the rain GIFs and change button text to "Disable"
            rainGifImage.style.visibility = "visible";
            rainGif.style.visibility = "visible";
            particlesButtonRain.textContent = "Disable";

            snowParticlesCheck.disabled = true;
            stormWeatherCheck.disabled = true;
            blizzardWeatherCheck.disabled = true;
        }
    }

    // Set up the event listener on the particles button
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
            // Change document title to song title when playing
            const song = songs[currentSongIndex];
        } else {
            audio.pause();
            playButton.textContent = "▶";
            // Change document title to "Spotify Clone" when paused
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
            nextSong(); // Go to next song when current ends
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
            removeButton.classList.add('disabled');  // Add a class for styling
            selectAllButton.classList.add('disabled');  // Add a class for styling
        } else {
            removeButton.disabled = false;
            selectAllButton.disabled = false;
            removeButton.classList.remove('disabled');  // Remove the class
            selectAllButton.classList.remove('disabled');  // Remove the class
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
        genres.forEach((genre, index) => {  // Changed from `songs` to `genres` and simplified variable names
            const option = document.createElement("option");  // Corrected the element name to "option"
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
        morePanelOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Dark semi-transparent
        morePanelOverlay.style.zIndex = "400"; // Ensure it's behind the panel
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
