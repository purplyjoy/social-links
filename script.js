const song = document.getElementById("song");
const playBtn = document.getElementById("play-btn");
const volumeBtn = document.getElementById("volume-btn");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("current-time");
const duration = document.getElementById("duration");

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return minutes + ":" + String(remainingSeconds).padStart(2, "0");
}

playBtn.addEventListener("click", function () {
    if (song.paused) {
        song.play();
    } else {
        song.pause();
    }
});

song.addEventListener("play", function () {
    playBtn.textContent = "❚❚";
    playBtn.setAttribute("aria-label", "Pause song");
});

song.addEventListener("pause", function () {
    playBtn.textContent = "▶";
    playBtn.setAttribute("aria-label", "Play song");
});

song.addEventListener("loadedmetadata", function () {
    duration.textContent = formatTime(song.duration);
});

song.addEventListener("timeupdate", function () {
    currentTime.textContent = formatTime(song.currentTime);

    if (song.duration) {
        progress.value = (song.currentTime / song.duration) * 100;
        duration.textContent = "-" + formatTime(song.duration - song.currentTime);
    }
});

progress.addEventListener("input", function () {
    if (song.duration) {
        song.currentTime = (progress.value / 100) * song.duration;
    }
});

volumeBtn.addEventListener("click", function () {
    song.muted = !song.muted;
    volumeBtn.style.background = song.muted ? "#62417e" : "#9563c4";
    volumeBtn.setAttribute(
        "aria-label",
        song.muted ? "Unmute song" : "Mute song"
    );
});

const userId = "931599631702446132";

async function updateActivity() {

    try {
        const response = await fetch(
            `https://api.lanyard.rest/v1/users/${userId}`
        );

        const result = await response.json();

        if (!result.success) {
            throw new Error("Unable to get Discord activity.");
        }

        const data = result.data;

        document.getElementById("discord-name").textContent =
        data.discord_user.username;

        const statusText = document.getElementById("discord-status");
        const statusDot = document.querySelector(".status-dot");

        statusText.textContent = data.discord_status;

        if (data.discord_status === "online") {
            statusDot.style.backgroundColor = "#a8e6b0";
        } else {
            statusDot.style.backgroundColor = "#808080";
        }

        const gameElement = document.getElementById("game-activity");
        const spotifyElement = document.getElementById("spotify-activity");

        gameElement.innerHTML = "";
        spotifyElement.innerHTML = "";

        const game = data.activities.find(
            activity => activity.type === 0
        );

        if (game) {
            gameElement.textContent = "   🎮    " + game.name;
        }

        if (data.listening_to_spotify && data.spotify) {
            const song = data.spotify;

            const artwork = document.createElement("img");
            artwork.src = song.album_art_url;
            artwork.alt = "Album artwork";
            artwork.width = 50;

            const songInfo = document.createElement("div");

            const songTitle = document.createElement("p");
            songTitle.textContent = song.song;

            const artist = document.createElement("p");
            artist.textContent = song.artist;
            artist.style.fontWeight = "bold";

            songInfo.append(songTitle, artist);
            spotifyElement.append(artwork, songInfo);
        } else {
            spotifyElement.textContent = "";
        }

        if (!game) {
            gameElement.textContent = "No game detected";
        }

    } catch (error) {
        console.error("Discord activity error:", error);

        document.getElementById("discord-status").textContent =
            "Status unavailable";
    }
}

updateActivity();
setInterval(updateActivity, 15000);
