<template>
  <div class="add-track">
    <input
      ref="urlInput"
      type="url"
      placeholder="Paste YouTube URL..."
      class="input"
      @keypress.enter="handleAddTrack"
      @paste="handleAddTrack"
    />
    <button @click="handleAddTrack" class="accent" title="Add Track">
      <img :src="PlusIcon" alt="Add" />
    </button>
  </div>
</template>

<style scoped>
.add-track {
  display: flex;
  flex-grow: 1;
  gap: var(--spacing-md);
}
</style>

<script setup>
import { ref } from "vue";

import { tracks } from "../stores/tracks.js";
import { saveTracks } from "../services/storage.js";
import { extractVideoId, fetchVideoMetadata } from "../services/youtube.js";

import PlusIcon from "../../assets/icons/plus.svg";

const urlInput = ref(null);

async function handleAddTrack() {
  const rawUrl = urlInput.value.value.trim();
  const videoId = extractVideoId(rawUrl);

  if (rawUrl && videoId) {
    const trackData = await fetchVideoMetadata(rawUrl);
    tracks.add(trackData);
    saveTracks(tracks.asMap);
    urlInput.value.value = "";
  }
}
</script>
