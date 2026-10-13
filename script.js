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