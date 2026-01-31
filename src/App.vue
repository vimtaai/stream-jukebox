<template>
  <main class="layout">
    <TrackList />
    <section class="menu">
      <AddTrack />
      <ActionsMenu />
    </section>
  </main>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 800px;
  min-height: 100dvh;
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
  console.log(youtubeVideos);

  for (const videoId of youtubeVideos) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const trackData = await fetchVideoMetadata(url);
    tracks.add(trackData);
  }
}
</script>
