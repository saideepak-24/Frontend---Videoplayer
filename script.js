// Videos array with YouTube IDs only
const videos = [
  { title: "Ne yadhalo", videoId: "6l9lr6AWBUM" },
  { title: "Ruba Ruba", videoId: "hgQeo55s4So" },
  { title: "Hello rammante", videoId: "QntqP3PrW3c" },
  { title: "Nanne Nanne Chusthu", videoId: "QPD2C2aNkSA" }, 
  { title: "Manasaa", videoId: "_CJwhrSTUEE" }// your link
];


let currentVideo = 0;
let isShuffle = false;
let isRepeat = false;
let player;

const videoTitle = document.getElementById("video-title");
const playlist = document.getElementById("playlist");
const playBtn = document.getElementById("play");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");
const shuffleBtn = document.getElementById("shuffle");
const repeatBtn = document.getElementById("repeat");
const fullscreenBtn = document.getElementById("fullscreen");

// Initialize YouTube Player
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video', {
    height: '100%',
    width: '100%',
    videoId: videos[currentVideo].videoId,
    playerVars: { 'autoplay': 1, 'controls': 1 },
    events: { 'onReady': onPlayerReady, 'onStateChange': onPlayerStateChange }
  });
}

// Player ready
function onPlayerReady() {
  updatePlaylist();
  loadVideo(currentVideo);
}

// Build playlist dynamically with YouTube thumbnails
function updatePlaylist() {
  playlist.innerHTML = '';
  videos.forEach((vid, index) => {
    const li = document.createElement("li");
    const img = document.createElement("img");
    // YouTube thumbnail URL
    img.src = `https://img.youtube.com/vi/${vid.videoId}/0.jpg`;
    const span = document.createElement("span");
    span.textContent = vid.title;
    li.appendChild(img);
    li.appendChild(span);

    li.addEventListener("click", () => {
      currentVideo = index;
      loadVideo(currentVideo);
    });

    playlist.appendChild(li);
  });
}

// Load video
function loadVideo(index) {
  player.loadVideoById(videos[index].videoId);
  videoTitle.textContent = videos[index].title;
  highlightVideo(index);
}

// Highlight current video
function highlightVideo(index) {
  const items = document.querySelectorAll("#playlist li");
  items.forEach((item, i) => {
    item.classList.toggle("active", i === index);
  });
}

// Video ended        
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    if (isRepeat) loadVideo(currentVideo);
    else nextTrack();
  }
}

// Next track
function nextTrack() {
  if (isShuffle) currentVideo = Math.floor(Math.random() * videos.length);
  else currentVideo = (currentVideo + 1) % videos.length;
  loadVideo(currentVideo);
}

// Controls
playBtn.addEventListener("click", () => {
  const state = player.getPlayerState();
  if (state === YT.PlayerState.PLAYING) {
    player.pauseVideo();
    playBtn.textContent = "▶️";
  } else {
    player.playVideo();
    playBtn.textContent = "⏸️";
  }
});

prevBtn.addEventListener("click", () => {
  currentVideo = (currentVideo - 1 + videos.length) % videos.length;
  loadVideo(currentVideo);
});

nextBtn.addEventListener("click", nextTrack);

shuffleBtn.addEventListener("click", () => {
  isShuffle = !isShuffle;
  shuffleBtn.style.color = isShuffle ? "#1db954" : "white";
});

repeatBtn.addEventListener("click", () => {
  isRepeat = !isRepeat;
  repeatBtn.style.color = isRepeat ? "#1db954" : "white";
});

fullscreenBtn.addEventListener("click", () => {
  const container = document.querySelector('.video-container');
  if (!document.fullscreenElement) container.requestFullscreen();
  else document.exitFullscreen();
});
