import { reactive } from "vue";

export const DEFAULT_COLLECTION_ID = "default";

export const collections = reactive({
  _collections: {
    [DEFAULT_COLLECTION_ID]: { id: DEFAULT_COLLECTION_ID, name: "Default" },
  },
  _activeId: DEFAULT_COLLECTION_ID,

  get asList() {
    return Object.values(this._collections);
  },

  get asMap() {
    return this._collections;
  },

  get activeId() {
    return this._activeId;
  },

  set(collectionsMap, activeId) {
    this._collections = collectionsMap;
    this._activeId = collectionsMap[activeId] ? activeId : DEFAULT_COLLECTION_ID;
  },

  setActive(id) {
    if (this._collections[id]) {
      this._activeId = id;
    }
  },

  add(collection) {
    this._collections[collection.id] = collection;
  },

  rename(id, name) {
    const collection = this._collections[id];
    if (!collection) return;
    collection.name = name;
  },

  delete(id) {
    if (id === DEFAULT_COLLECTION_ID) return;
    delete this._collections[id];
    if (this._activeId === id) {
      this._activeId = DEFAULT_COLLECTION_ID;
    }
  },
});
