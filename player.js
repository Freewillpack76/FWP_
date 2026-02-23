const playlist = [
  { src: "tracks/track1.mp3", title: "Ghost Hardware", artist: "Burial", cover: "covers/BurialUntrue.jpg" },
  { src: "tracks/Olson_128k.mp3", title: "Olson", artist: "Boards of Canada", cover: "covers/mhtrtc.jpg" },
  { src: "tracks/Angel_128k.mp3", title: "Angel", artist: "Massive Attack", cover: "covers/Mezzanine.png" },
  { src: "tracks/Hiders_128k.mp3", title: "Hiders", artist: "Burial", cover: "covers/rival.jpg" },
  { src: "tracks/EverythingRP.mp3", title: "Everything In Its Right Place ", artist: "Radiohead", cover: "covers/Radioheadkida.png" },
  { src: "tracks/AAA.mp3", title: "AAA Powerline", artist: "Ecco2k", cover: "covers/E.png" },
  { src: "tracks/Unity.mp3", title: "Unity", artist: "Frank Ocean", cover: "covers/endless.jpeg" },
];

const audio = document.getElementById("audio");
const playBtn = document.querySelector(".btn.play");
const prevBtn = document.querySelector(".btn.prev");
const nextBtn = document.querySelector(".btn.next");
const titleEl = document.querySelector(".meta .title");
const artistEl = document.querySelector(".meta .artist");
const coverEl = document.querySelector(".cover");
const progressBar = document.querySelector(".progress-bar");
const progress = document.querySelector(".progress");
const currentTimeEl = document.querySelector(".time.current");
const durationEl = document.querySelector(".time.duration");
const volSlider = document.querySelector(".vol");
const repeatBtn = document.querySelector(".btn.repeat");

let idx = 0;
let isPlaying = false;
let repeat = false;

function loadTrack(i){
  const t = playlist[i];
  audio.src = t.src;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  coverEl.src = t.cover || "cover.jpg";
  audio.load();
}

function play(){
  audio.volume = 0.35; 
  audio.play();
  isPlaying = true;
  playBtn.innerHTML = '<i class="fas fa-pause"></i>';
}
function pause(){
  audio.pause();
  isPlaying = false;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

playBtn.addEventListener("click", ()=> isPlaying ? pause() : play());
prevBtn.addEventListener("click", ()=> { idx = (idx-1+playlist.length)%playlist.length; loadTrack(idx); play(); });
nextBtn.addEventListener("click", ()=> { idx = (idx+1)%playlist.length; loadTrack(idx); play(); });

audio.addEventListener("timeupdate", ()=>{
  if (audio.duration) {
    const pct = (audio.currentTime / audio.duration) * 100;
    progress.style.width = pct + "%";
    currentTimeEl.textContent = formatTime(audio.currentTime);
  }
});

audio.addEventListener("loadedmetadata", ()=>{
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener("ended", ()=>{
  if (repeat) { audio.currentTime = 0; play(); }
  else { nextBtn.click(); }
});

progressBar.addEventListener("click", (e)=>{
  const rect = progressBar.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const pct = x / rect.width;
  audio.currentTime = pct * audio.duration;
});

volSlider.addEventListener("input", (e)=>{
  audio.volume = e.target.value;
});

repeatBtn.addEventListener("click", ()=>{
  repeat = !repeat;
  repeatBtn.style.opacity = repeat ? 1 : 0.6;
});

function formatTime(t){
  if (!t || isNaN(t)) return "0:00";
  const m = Math.floor(t/60);
  const s = Math.floor(t%60).toString().padStart(2,"0");
  return `${m}:${s}`;
}

window.addEventListener("keydown", (e)=> { if (e.code === "Space") { e.preventDefault(); isPlaying ? pause() : play(); } });



loadTrack(idx);