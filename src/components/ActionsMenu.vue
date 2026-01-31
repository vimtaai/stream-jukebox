<template>
  <menu class="actions">
    <div :class="{ menu: true, hidden: !isActionsOpen }">
      <button type="button" title="Share" @click="openShareDialog">
        <img :src="ShareIcon" alt="Share" />
      </button>
      <button type="button" title="Change Layout" @click.stop="toggleLayout">
        <img :src="layoutIcon" alt="Change Layout" />
      </button>
      <button type="button" title="Actions" @click.stop="toggleActions">
        <img :src="CloseIcon" alt="Menu" />
      </button>
    </div>

    <div :class="{ toggle: true, hidden: isActionsOpen }">
      <button type="button" title="Actions" @click="toggleActions">
        <img :src="MoreIcon" alt="Menu" />
      </button>
    </div>

    <ShareDialog ref="shareDialog" />
  </menu>
</template>

<style scoped>
.actions {
  position: relative;

  .toggle,
  .menu {
    opacity: 1;
    transition: opacity var(--transition-normal);

    &.hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  .menu {
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    inset: auto 0 0 0;
    position: absolute;
  }
}
</style>

<script setup>
import { ref, useTemplateRef, computed } from "vue";
import { settings } from "../stores/settings.js";
import ShareDialog from "./ShareDialog.vue";

import CloseIcon from "../../assets/icons/close.svg";
import MoreIcon from "../../assets/icons/more.svg";
import ShareIcon from "../../assets/icons/share.svg";
import LayoutGridIcon from "../../assets/icons/layout-grid.svg";
import LayoutListIcon from "../../assets/icons/layout-list.svg";

const isActionsOpen = ref(false);
const refs = {
  shareDialog: useTemplateRef("shareDialog"),
};

const layoutIcon = computed(() =>
  settings.layout === "list" ? LayoutGridIcon : LayoutListIcon,
);

function openShareDialog() {
  refs.shareDialog.value.open();
}

function toggleActions() {
  isActionsOpen.value = !isActionsOpen.value;
}

function toggleLayout() {
  settings.toggleLayout();
}
</script>
