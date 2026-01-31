<template>
  <div class="layout">
    <main class="content">
      <TrackList />
    </main>
    <section class="menu">
      <AddTrack />
      <ActionsMenu />
    </section>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  margin: 0 auto;
  max-width: 800px;
  min-height: 100dvh;
  grid-template-rows:
    1fr
    auto
    env(keyboard-inset-height, 0px);
}

.menu {
  align-items: flex-end;
  display: flex;
  gap: var(--spacing-lg);
  justify-content: space-between;
  padding: var(--spacing-lg);
}
</style>

<script setup>
import { onMounted } from "vue";

import { tracks } from "./stores/tracks.js";
import { loadSavedTracks } from "./services/storage.js";
import { fetchVideoMetadata } from "./services/youtube.js";

import AddTrack from "./components/AddTrack.vue";
import TrackList from "./components/TrackList.vue";
import ActionsMenu from "./components/ActionsMenu.vue";

onMounted(async () => {
  const savedTracks = loadSavedTracks();
  tracks.set(savedTracks);
  await getTracksFromUrlParams();
});

async function getTracksFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const youtubeVideos = params.getAll("yt");

  for (const videoId of youtubeVideos) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const trackData = await fetchVideoMetadata(url);
    tracks.add(trackData);
  }

  const newUrl = new URL(window.location.href);
  newUrl.search = "";
  window.history.replaceState(null, "", newUrl.toString());
}
</script>
