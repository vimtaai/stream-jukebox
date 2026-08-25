import { DEFAULT_COLLECTION_ID } from "../stores/collections.js";

const STORAGE_KEY = "jukebox_tracks";
const COLLECTIONS_STORAGE_KEY = "jukebox_collections";

export function saveTracks(tracks) {
  try {
    const serialized = JSON.stringify(tracks);
    localStorage.setItem(STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save tracks to localStorage:", error);
  }
}

export function loadSavedTracks() {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY) || "{}";
    return JSON.parse(serialized);
  } catch (error) {
    console.error("Failed to load tracks from localStorage:", error);
    return {};
  }
}

const DEFAULT_COLLECTIONS = {
  collections: { [DEFAULT_COLLECTION_ID]: { id: DEFAULT_COLLECTION_ID, name: "Default" } },
  activeId: DEFAULT_COLLECTION_ID,
};

export function saveCollections(collectionsMap, activeId) {
  try {
    const serialized = JSON.stringify({ collections: collectionsMap, activeId });
    localStorage.setItem(COLLECTIONS_STORAGE_KEY, serialized);
  } catch (error) {
    console.error("Failed to save collections to localStorage:", error);
  }
}

export function loadSavedCollections() {
  try {
    const serialized = localStorage.getItem(COLLECTIONS_STORAGE_KEY);
    if (!serialized) return DEFAULT_COLLECTIONS;
    const parsed = JSON.parse(serialized);
    if (!parsed.collections || !parsed.activeId) return DEFAULT_COLLECTIONS;
    return parsed;
  } catch (error) {
    console.error("Failed to load collections from localStorage:", error);
    return DEFAULT_COLLECTIONS;
  }
}
