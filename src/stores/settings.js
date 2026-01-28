import { reactive } from "vue";

export const settings = reactive({
  _layout: "list",

  get layout() {
    return this._layout;
  },

  setLayout(layout) {
    this._layout = layout;
  },

  toggleLayout() {
    this._layout = this._layout === "list" ? "grid" : "list";
  },
});
