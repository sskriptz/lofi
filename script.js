
document.addEventListener("DOMContentLoaded", () => {

    let hrs = document.getElementById("hrs");
    let min = document.getElementById("min");
    let sec = document.getElementById("sec");
    let ampm = document.getElementById("ampm");

    // Function to enable or disable the particles
    function enableRainParticles() {
        const rainGifImage = document.getElementById("rainGifImage");
        const rainGif = document.getElementById("rainGif");
        const particlesButtonRain = document.getElementById("particlesButtonRain");

        var snowParticlesCheck = document.getElementById("particlesButtonSnow");
        var stormWeatherCheck = document.getElementById("weatherButtonsStorm");
        var blizzardWeatherCheck = document.getElementById("weatherButtonsBlizzard");

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
    let particlesButtonRain = document.getElementById("particlesButtonRain");
    if (particlesButtonRain) {
        particlesButtonRain.addEventListener("click", enableRainParticles);
    }

    function enableSnowParticles () {
        var rainParticlesCheck = document.getElementById("particlesButtonRain");
        var stormWeatherCheck = document.getElementById("weatherButtonsStorm");
        var blizzardWeatherCheck = document.getElementById("weatherButtonsBlizzard");

        const snowGifImage = document.getElementById("snowGifImage");
        const snowGif = document.getElementById("snowGif");
        const particlesButtonSnow = document.getElementById("particlesButtonSnow");

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

    let particlesButtonSnow = document.getElementById("particlesButtonSnow");
    if (particlesButtonSnow) {
        particlesButtonSnow.addEventListener("click", enableSnowParticles);
    }

    function enableBlizzard() {
        const blizzardGifImage = document.getElementById("blizzardGifImage");
        const blizzardGif = document.getElementById("blizzardGif");
        const weatherButtonsBlizzard = document.getElementById("weatherButtonsBlizzard");

        var rainParticlesCheck = document.getElementById("particlesButtonRain");
        var snowParticlesCheck = document.getElementById("particlesButtonSnow");
        var stormWeatherCheck = document.getElementById("weatherButtonsStorm");

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

    let weatherButtonsBlizzard = document.getElementById("weatherButtonsBlizzard");
    if (weatherButtonsBlizzard) {
        weatherButtonsBlizzard.addEventListener("click", enableBlizzard);
    }

    function enableStorm() {
        const rainGifImage = document.getElementById("rainGifImage");
        const rainGif = document.getElementById("rainGif");

        var rainParticlesCheck = document.getElementById("particlesButtonRain");
        var snowParticlesCheck = document.getElementById("particlesButtonSnow");
        var blizzardWeatherCheck = document.getElementById("weatherButtonsBlizzard");

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

    let weatherButtonsStorm = document.getElementById("weatherButtonsStorm");
    if (weatherButtonsStorm) {
        weatherButtonsStorm.addEventListener("click", enableStorm);
    }
    
    function background1Transition() {
        var wallpaperBg1Btn = document.getElementById("wallpaperBg1Btn");
        var wallpaperBg2Btn = document.getElementById("wallpaperBg2Btn");
        var wallpaperBg3Btn = document.getElementById("wallpaperBg3Btn");
        var wallpaperBg4Btn = document.getElementById("wallpaperBg4Btn");

        document.body.style.backgroundImage = "url('https://wallpapers.com/images/featured/lo-fi-mvqzjym6ie17firw.jpg')";

        wallpaperBg1Btn.textContent = "Chosen";
        wallpaperBg1Btn.disabled = true;
        wallpaperBg2Btn.disabled = false;
        wallpaperBg3Btn.disabled = false;
        wallpaperBg4Btn.disabled = false;
    }

    let wallpaperBg1Btn = document.getElementById("wallpaperBg1Btn");
    if (wallpaperBg1Btn) {
        wallpaperBg1Btn.addEventListener("click", background1Transition);
    }

    function background2Transition() {
        var wallpaperBg1Btn = document.getElementById("wallpaperBg1Btn");
        var wallpaperBg2Btn = document.getElementById("wallpaperBg2Btn");
        var wallpaperBg3Btn = document.getElementById("wallpaperBg3Btn");
        var wallpaperBg4Btn = document.getElementById("wallpaperBg4Btn");

        document.body.style.backgroundImage = "url('https://i.pinimg.com/originals/66/29/ac/6629ac69eee96adbe0880b4f06afdc26.gif')";
    
        wallpaperBg1Btn.disabled = false;
        wallpaperBg2Btn.textContent = "Chosen";
        wallpaperBg2Btn.disabled = true;
        wallpaperBg3Btn.disabled = false;
        wallpaperBg4Btn.disabled = false;
    }

    let wallpaperBg2Btn = document.getElementById("wallpaperBg2Btn");
    if (wallpaperBg2Btn) {
        wallpaperBg2Btn.addEventListener("click", background2Transition);
    }

    function background3Transition() {
        var wallpaperBg1Btn = document.getElementById("wallpaperBg1Btn");
        var wallpaperBg2Btn = document.getElementById("wallpaperBg2Btn");
        var wallpaperBg3Btn = document.getElementById("wallpaperBg3Btn");
        var wallpaperBg4Btn = document.getElementById("wallpaperBg4Btn");

        document.body.style.backgroundImage = "url('https://s.widget-club.com/images/YyiR86zpwIMIfrCZoSs4ulVD9RF3/293280da671a76a539b89abbce741e3c/309059649f6c758fb2223a2fea97527d.jpg')";
    
        wallpaperBg1Btn.disabled = false;
        wallpaperBg2Btn.disabled = false;
        wallpaperBg3Btn.textContent = "Chosen";
        wallpaperBg3Btn.disabled = true;
        wallpaperBg4Btn.disabled = false;
    }

    let wallpaperBg3Btn = document.getElementById("wallpaperBg3Btn");
    if (wallpaperBg3Btn) {
        wallpaperBg3Btn.addEventListener("click", background3Transition);
    }

    function background4Transition() {
        var wallpaperBg1Btn = document.getElementById("wallpaperBg1Btn");
        var wallpaperBg2Btn = document.getElementById("wallpaperBg2Btn");
        var wallpaperBg3Btn = document.getElementById("wallpaperBg3Btn");
        var wallpaperBg4Btn = document.getElementById("wallpaperBg4Btn");

        document.body.style.backgroundImage = "url('https://i.postimg.cc/fWGb9PSP/Untitled-design-2.png')";

        wallpaperBg1Btn.disabled = false;
        wallpaperBg2Btn.disabled = false;
        wallpaperBg3Btn.disabled = false;
        wallpaperBg4Btn.textContent = "Chosen";
        wallpaperBg4Btn.disabled = true;
    }

    let wallpaperBg4Btn = document.getElementById("wallpaperBg4Btn");
    if (wallpaperBg4Btn) {
        wallpaperBg4Btn.addEventListener("click", background4Transition);
    }

    if (document.getElementById("wallpaperBg1Btn").textContent=="Chosen") {
        var wallpaperBg1Button = document.getElementById("wallpaperBg1Btn");

        wallpaperBg1Button.disabled = true;
    } else if (document.getElementById("wallpaperBg2Btn").textContent=="Chosen") {
        var wallpaperBg2Button = document.getElementById("wallpaperBg2Btn");

        wallpaperBg2Button.disabled = true;
    } else if (document.getElementById("wallpaperBg3Btn").textContent=="Chosen") {
        var wallpaperBg3Button = document.getElementById("wallpaperBg3Btn");

        wallpaperBg3Button.disabled = true;
    } else if (document.getElementById("wallpaperBg4Btn").textContent=="Chosen") {
        var wallpaperBg4Button = document.getElementById("wallpaperBg4Btn");

        wallpaperBg4Button.disabled = true;
    }

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
});
