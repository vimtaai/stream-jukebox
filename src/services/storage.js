const STORAGE_KEY = "jukebox_tracks";

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
