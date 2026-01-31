<template>
  <section :class="{ tracks: true, [settings.layout]: true }">
    <TrackItem v-for="track in tracks.asList" :key="track.id" :track="track" />
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
import TrackItem from "./TrackItem.vue";
import { tracks } from "../stores/tracks";
import { settings } from "../stores/settings";
</script>
