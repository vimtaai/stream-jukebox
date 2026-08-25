<template>
  <nav class="collection-tabs">
    <template v-if="collections.asList.length > 1">
      <button
        v-for="collection in collections.asList"
        :key="collection.id"
        type="button"
        :class="{ tab: true, active: collection.id === collections.activeId }"
        @click="selectCollection(collection.id)"
      >
        <span
          v-if="collection.id === editingId"
          :ref="(el) => (editEl = el)"
          class="name"
          contenteditable
          @keydown.enter.prevent="commitRename"
          @blur="commitRename"
          @click.stop
          >{{ collection.name }}</span
        >
        <span v-else class="name">{{ collection.name }}</span>
      </button>
    </template>

    <div class="tools">
      <button
        v-if="collections.asList.length > 1"
        type="button"
        title="Rename Collection"
        @click="startRename(collections.activeId)"
      >
        <img :src="editIcon" alt="Rename" />
      </button>
      <button
        v-if="collections.asList.length > 1"
        type="button"
        class="negative"
        title="Delete Collection"
        :disabled="collections.activeId === DEFAULT_COLLECTION_ID"
        @click="deleteCollection(collections.activeId)"
      >
        <img :src="trashIcon" alt="Delete" />
      </button>
      <button type="button" class="accent" title="New Collection" @click="createCollection">
        <img :src="plusIcon" alt="New Collection" />
      </button>
    </div>
  </nav>
</template>

<style scoped>
.collection-tabs {
  align-items: flex-end;
  border-bottom: 3px solid var(--color-border);
  display: flex;
  gap: var(--spacing-xs);
  overflow-x: auto;
  padding: var(--spacing-lg) var(--spacing-lg) 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.tab {
  aspect-ratio: auto;
  background: transparent;
  border: 3px solid transparent;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  color: var(--color-text-light);
  flex-shrink: 0;
  margin-bottom: -3px;
  padding: var(--spacing-sm) var(--spacing-xl);

  &:hover {
    background: var(--color-background-control);
    color: var(--color-text);
  }

  &.active {
    background: var(--color-background-control-strong);
    border-color: var(--color-border);
    border-bottom-color: var(--color-accent);
    color: var(--color-text);
  }

  .name {
    outline: none;
  }
}

.tools {
  display: flex;
  flex-shrink: 0;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  margin-left: auto;
}
</style>

<script setup>
import { ref, nextTick } from "vue";

import { tracks } from "../stores/tracks.js";
import { collections, DEFAULT_COLLECTION_ID } from "../stores/collections.js";
import { saveTracks, saveCollections } from "../services/storage.js";

import plusIcon from "../../assets/icons/plus.svg";
import editIcon from "../../assets/icons/edit.svg";
import trashIcon from "../../assets/icons/trash.svg";

const editingId = ref(null);
const editEl = ref(null);

function selectCollection(id) {
  if (id === collections.activeId) return;
  collections.setActive(id);
  saveCollections(collections.asMap, collections.activeId);
}

async function startRename(id) {
  editingId.value = id;
  await nextTick();
  editEl.value?.focus();
}

function commitRename() {
  if (!editingId.value) return;
  const name = editEl.value?.innerText.trim();
  if (name) {
    collections.rename(editingId.value, name);
  }
  editingId.value = null;
  saveCollections(collections.asMap, collections.activeId);
}

function deleteCollection(id) {
  if (id === DEFAULT_COLLECTION_ID) return;
  tracks.asList.filter((track) => track.collectionId === id).forEach((track) => tracks.delete(track.id));
  collections.delete(id);
  saveTracks(tracks.asMap);
  saveCollections(collections.asMap, collections.activeId);
}

async function createCollection() {
  const id = crypto.randomUUID();
  collections.add({ id, name: "New Collection" });
  collections.setActive(id);
  saveCollections(collections.asMap, collections.activeId);
  await startRename(id);
}
</script>
