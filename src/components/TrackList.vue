<template>
  <section :class="{ tracks: true, [settings.layout]: true }">
    <TrackItem v-for="track in activeTracks" :key="track.id" :track="track" />
  </section>
</template>

<style scoped>
.tracks {
  align-items: start;
  display: grid;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);

  &.list {
    grid-template-columns: 1fr;
  }

  &.grid {
    grid-template-columns: repeat(auto-fit, minmax(100px, max-content));
  }
}
</style>

<script setup>
import { computed } from "vue";

import TrackItem from "./TrackItem.vue";
import { tracks } from "../stores/tracks";
import { settings } from "../stores/settings";
import { collections } from "../stores/collections";

const activeTracks = computed(() =>
  tracks.asList.filter((track) => track.collectionId === collections.activeId),
);
</script>
