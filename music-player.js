document.addEventListener("DOMContentLoaded", () => {
  const bgMusic = document.getElementById("bgMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playIcon = document.getElementById("playIcon");
  const pauseIcon = document.getElementById("pauseIcon");
  const playerWidget = document.querySelector(".otf-music-player");

  if (!bgMusic || !playPauseBtn) return;

  bgMusic.volume = 0.5;

  const isPlaying = sessionStorage.getItem("otf_music_playing") === "true";
  if (isPlaying) {
    playAudio();
  }

  playPauseBtn.addEventListener("click", () => {
    if (bgMusic.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  });

  function playAudio() {
    bgMusic.play().then(() => {
      playerWidget.classList.add("playing");
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
      sessionStorage.setItem("otf_music_playing", "true");
    }).catch(err => {
      pauseAudio();
    });
  }

  function pauseAudio() {
    bgMusic.pause();
    playerWidget.classList.remove("playing");
    playIcon.style.display = "block";
    pauseIcon.style.display = "none";
    sessionStorage.setItem("otf_music_playing", "false");
  }
});