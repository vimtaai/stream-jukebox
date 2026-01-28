import { reactive } from "vue";

export const tracks = reactive({
  _tracks: {},

  get asMap() {
    return this._tracks;
  },

  get asList() {
    return Object.values(this._tracks);
  },

  add(track) {
    this._tracks[track.id] = track;
  },

  set(tracks) {
    this._tracks = tracks;
  },

  update(id, trackPartial) {
    const track = this._tracks[id];

    if (!track) {
      return;
    }

    Object.assign(track, trackPartial);
  },

  delete(trackId) {
    delete this._tracks[trackId];
  },
});
