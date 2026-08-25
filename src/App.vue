<template>
  <div class="layout">
    <CollectionTabs />
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
  height: var(--app-height, 100dvh);
  margin: 0 auto;
  max-width: 800px;
  grid-template-rows:
    auto
    1fr
    auto
    env(keyboard-inset-height, 0px);
}

.content {
  min-height: 0;
  overflow-y: auto;
}

.menu {
  align-items: flex-end;
  display: flex;
  gap: var(--spacing-lg);
  justify-content: space-between;
  padding: var(--spacing-lg);
  padding-bottom: calc(var(--spacing-lg) + env(safe-area-inset-bottom, 0px));
}
</style>

<script setup>
import { onMounted } from "vue";

import { tracks } from "./stores/tracks.js";
import { collections, DEFAULT_COLLECTION_ID } from "./stores/collections.js";
import { loadSavedTracks, saveTracks, loadSavedCollections } from "./services/storage.js";
import { fetchVideoMetadata } from "./services/youtube.js";

import AddTrack from "./components/AddTrack.vue";
import TrackList from "./components/TrackList.vue";
import ActionsMenu from "./components/ActionsMenu.vue";
import CollectionTabs from "./components/CollectionTabs.vue";

onMounted(async () => {
  const savedCollections = loadSavedCollections();
  collections.set(savedCollections.collections, savedCollections.activeId);

  const savedTracks = loadSavedTracks();
  let migrated = false;
  for (const track of Object.values(savedTracks)) {
    if (!track.collectionId) {
      track.collectionId = DEFAULT_COLLECTION_ID;
      migrated = true;
    }
  }
  tracks.set(savedTracks);
  if (migrated) {
    saveTracks(tracks.asMap);
  }

  await getTracksFromUrlParams();
});

async function getTracksFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  const youtubeVideos = params.getAll("yt");
  const customTitles = params.getAll("t");

  for (const [index, videoId] of youtubeVideos.entries()) {
    const existingTrack = tracks.asList.find(t => t.videoId === videoId);
    if (existingTrack) {
      const customTitle = customTitles[index];
      if (customTitle) {
        tracks.update(existingTrack.id, { title: customTitle });
      }
      continue;
    }

    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const trackData = await fetchVideoMetadata(url);
    trackData.collectionId = collections.activeId;
    const customTitle = customTitles[index];
    if (customTitle) {
      trackData.title = customTitle;
    }
    tracks.add(trackData);
  }

  saveTracks(tracks.asMap);

  const newUrl = new URL(window.location.href);
  newUrl.search = "";
  window.history.replaceState(null, "", newUrl.toString());
}
</script>
