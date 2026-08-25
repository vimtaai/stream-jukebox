import { reactive } from "vue";
import { tracks } from "../stores/tracks";

const players = {};
let actionHandlersSetup = false;

export const state = reactive({
  currentTrackId: null,
  isPlaying: false,
});

function getCurrentTrack() {
  if (state.currentTrackId === null) return null;
  return tracks._tracks[state.currentTrackId] || null;
}

function getTrackList() {
  return Object.values(tracks._tracks);
}

function updateMediaSession() {
  if (!("mediaSession" in navigator)) return;

  const track = getCurrentTrack();

  if (track) {
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title || "Unknown",
      artist: "Jukebox",
      artwork: track.thumbnail
        ? [
            {
              src: track.thumbnail,
              sizes: "480x360",
              type: "image/jpeg",
            },
          ]
        : [],
    });
  } else {
    navigator.mediaSession.metadata = null;
  }

  navigator.mediaSession.playbackState = state.isPlaying
    ? "playing"
    : state.currentTrackId
      ? "paused"
      : "none";
}

export function setupActionHandlers() {
  if (actionHandlersSetup) return;
  if (!("mediaSession" in navigator)) return;
  actionHandlersSetup = true;

  navigator.mediaSession.setActionHandler("play", () => {
    const player = players[state.currentTrackId];
    if (player) {
      player.playVideo();
      state.isPlaying = true;
      updateMediaSession();
    }
  });

  navigator.mediaSession.setActionHandler("pause", () => {
    const player = players[state.currentTrackId];
    if (player) {
      player.pauseVideo();
      state.isPlaying = false;
      updateMediaSession();
    }
  });

  navigator.mediaSession.setActionHandler("previoustrack", () => {
    prevTrack();
  });

  navigator.mediaSession.setActionHandler("nexttrack", () => {
    nextTrack();
  });
}

let wakeLock = null;

async function acquireWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => {
      wakeLock = null;
    });
  } catch {
    wakeLock = null;
  }
}

async function releaseWakeLock() {
  if (wakeLock) {
    await wakeLock.release();
    wakeLock = null;
  }
}

export function registerPlayer(trackId, controls) {
  players[trackId] = controls;
}

export function unregisterPlayer(trackId) {
  delete players[trackId];
  if (state.currentTrackId === trackId) {
    state.currentTrackId = null;
    state.isPlaying = false;
    updateMediaSession();
  }
}

export function play(trackId) {
  if (state.currentTrackId && state.currentTrackId !== trackId) {
    const current = players[state.currentTrackId];
    if (current) current.pauseVideo();
  }

  state.currentTrackId = trackId;

  const player = players[trackId];
  if (player) player.playVideo();

  state.isPlaying = true;
  updateMediaSession();
  acquireWakeLock();
}

export function pause() {
  const player = players[state.currentTrackId];
  if (player) player.pauseVideo();
  state.isPlaying = false;
  updateMediaSession();
  releaseWakeLock();
}

export function togglePlay(trackId) {
  if (state.currentTrackId === trackId && state.isPlaying) {
    pause();
  } else {
    play(trackId);
  }
}

export function nextTrack() {
  const list = getTrackList();
  if (list.length === 0) return;
  const idx = list.findIndex((t) => t.id === state.currentTrackId);
  const next = list[(idx + 1) % list.length];
  play(next.id);
}

export function prevTrack() {
  const list = getTrackList();
  if (list.length === 0) return;
  const idx = list.findIndex((t) => t.id === state.currentTrackId);
  const prev = list[(idx - 1 + list.length) % list.length];
  play(prev.id);
}

export function syncState(trackId, playerState) {
  if (trackId !== state.currentTrackId) return;
  state.isPlaying = playerState === 1;
  updateMediaSession();

  if (playerState === 0) {
    nextTrack();
  }
}

let wasPlayingBeforeHide = false;

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    if (state.isPlaying) {
      wasPlayingBeforeHide = true;
    }
    releaseWakeLock();
    return;
  }

  if (wasPlayingBeforeHide) {
    wasPlayingBeforeHide = false;
    const player = players[state.currentTrackId];
    if (player) player.playVideo();
    updateMediaSession();
    acquireWakeLock();
  }
});
