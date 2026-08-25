<template>
  <div ref="container" class="add-track">
    <div class="input-row">
      <input
        ref="urlInput"
        type="url"
        placeholder="Paste YouTube URL..."
        class="input"
        @keypress.enter="handleAddTrack"
        @paste="handlePaste"
      />
      <button @click="handleAddTrack" class="accent" title="Add Track">
        <img :src="PlusIcon" alt="Add" />
      </button>
    </div>

    <Transition name="fade">
      <p v-if="errorMessage" ref="errorEl" :class="{ error: true, above: showAbove }">
        {{ errorMessage }}
      </p>
    </Transition>
  </div>
</template>

<style scoped>
.add-track {
  flex-grow: 1;
  position: relative;
}

.input-row {
  display: flex;
  gap: var(--spacing-md);
}

.error {
  background: var(--color-negative);
  border: 1px solid var(--color-negative-strong);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
  left: 0;
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 10;

  &.above {
    bottom: 100%;
    margin-bottom: var(--spacing-md);
    margin-top: 0;
    top: auto;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<script setup>
import { ref, nextTick } from "vue";

import { tracks } from "../stores/tracks.js";
import { saveTracks } from "../services/storage.js";
import { extractVideoId, fetchVideoMetadata } from "../services/youtube.js";

import PlusIcon from "../../assets/icons/plus.svg";

const container = ref(null);
const urlInput = ref(null);
const errorEl = ref(null);
const errorMessage = ref("");
const showAbove = ref(false);
let errorTimeoutId = null;

async function showError(message) {
  errorMessage.value = message;
  await nextTick();

  const containerRect = container.value.getBoundingClientRect();
  const errorMargin = parseFloat(getComputedStyle(errorEl.value).marginTop);
  const errorSpace = errorEl.value.offsetHeight + errorMargin;
  showAbove.value = containerRect.bottom + errorSpace > window.innerHeight;

  clearTimeout(errorTimeoutId);
  errorTimeoutId = setTimeout(() => (errorMessage.value = ""), 3000);
}

async function addTrack(rawUrl) {
  if (!rawUrl) return;

  const videoId = extractVideoId(rawUrl);

  if (!videoId) {
    showError("This doesn't look like a valid YouTube URL.");
    return;
  }

  const trackData = await fetchVideoMetadata(rawUrl);
  tracks.add(trackData);
  saveTracks(tracks.asMap);
  urlInput.value.value = "";
}

async function handleAddTrack() {
  await addTrack(urlInput.value.value.trim());
}

async function handlePaste(event) {
  const pastedText = event.clipboardData.getData("text").trim();
  await addTrack(pastedText);
}
</script>
