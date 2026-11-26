if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

if (window.location.hash) {
  history.replaceState(null, "", window.location.href.split("#")[0]);
}

window.scrollTo(0, 0);

const menuButton = document.querySelector(".menu-button");
const siteNav = document.querySelector(".site-nav");

menuButton?.addEventListener("click", () => {
  const isOpen = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!isOpen));
  siteNav?.classList.toggle("open", !isOpen);
});

siteNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuButton?.setAttribute("aria-expanded", "false");
    siteNav.classList.remove("open");
  });
});

const musicPlayer = document.querySelector(".music-player");
const musicToggle = document.querySelector(".music-toggle");
let youtubePlayer;
let featuredVideoPlayer;
let isVideoPlaying = false;
let isPlaying = false;

function updateMusicButton() {
  musicPlayer?.classList.toggle("playing", isPlaying);
  musicToggle?.setAttribute("aria-pressed", String(isPlaying));
  musicToggle?.setAttribute("aria-label", isPlaying ? "音楽を停止" : "音楽を再生");
  if (musicToggle) musicToggle.disabled = isVideoPlaying;
}

function handleVideoState(event) {
  if (event.data === window.YT.PlayerState.PLAYING) {
    youtubePlayer?.pauseVideo();
    isPlaying = false;
  }

  isVideoPlaying = event.data === window.YT.PlayerState.PLAYING;
  updateMusicButton();
}

window.onYouTubeIframeAPIReady = () => {
  youtubePlayer = new window.YT.Player("youtube-player", {
    width: "1",
    height: "1",
    videoId: "5DtvdLKZRog",
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: "5DtvdLKZRog",
      controls: 0,
      playsinline: 1
    },
    events: {
      onReady: (event) => {
        event.target.setVolume(35);
        if (isVideoPlaying) {
          event.target.pauseVideo();
        } else {
          event.target.playVideo();
        }
        isPlaying = !isVideoPlaying;
        updateMusicButton();
      },
      onStateChange: (event) => {
        const wantsToPlay = event.data === window.YT.PlayerState.PLAYING;
        if (wantsToPlay && isVideoPlaying) {
          event.target.pauseVideo();
          isPlaying = false;
        } else {
          isPlaying = wantsToPlay;
        }
        updateMusicButton();
      }
    }
  });

  featuredVideoPlayer = new window.YT.Player("featured-video-player", {
    videoId: "ZfSvrdZseOA",
    playerVars: {
      autoplay: 0,
      controls: 1,
      playsinline: 1,
      rel: 0
    },
    events: {
      onStateChange: handleVideoState
    }
  });
};

const youtubeApi = document.createElement("script");
youtubeApi.src = "https://www.youtube.com/iframe_api";
document.head.appendChild(youtubeApi);

musicToggle?.addEventListener("click", () => {
  if (!youtubePlayer || isVideoPlaying) return;

  if (isPlaying) {
    youtubePlayer.pauseVideo();
  } else {
    youtubePlayer.playVideo();
  }
});
