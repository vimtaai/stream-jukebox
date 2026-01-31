<template>
  <div
    :class="{ overlay: true, hidden: !isOpened }"
    role="dialog"
    aria-modal="true"
    @keydown.esc.prevent="close"
  >
    <div class="backdrop" @click="close"></div>

    <div class="dialog" tabindex="-1" @keydown.esc.prevent="close">
      <header class="header">
        <strong class="title">Share</strong>
        <button class="muted close" @click="close" aria-label="Close">
          <img :src="CloseIcon" alt="Close" />
        </button>
      </header>

      <section class="info">
        <p>
          Copy the link or scan the QR code below to share the current page.
        </p>

        <img :src="currentQrCode" class="qrcode" alt="QR Code" />
      </section>

      <div class="share-row">
        <input
          ref="urlInput"
          class="url"
          readonly
          aria-label="Current page URL"
          :value="currentUrl"
          @focus="$event.target.select()"
        />

        <button
          :class="{ accent: !isCopied, positive: isCopied }"
          :title="isCopied ? 'Copied' : 'Copy link'"
          @click="copyLink"
        >
          <img v-if="!isCopied" :src="copyIcon" alt="Copy" />
          <img v-if="isCopied" :src="checkIcon" alt="Copied" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  opacity: 1;
  position: fixed;
  transition: opacity var(--transition-normal);
  z-index: 60;

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .backdrop {
    position: absolute;
    inset: 0;
    background: var(--color-background-overlay);
  }

  .dialog {
    background: var(--color-background-control);
    border-radius: var(--radius-xl);
    border: 2px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    height: 500px;
    outline: none;
    padding: var(--spacing-lg);
    position: absolute;
    inset: auto;
    width: 100%;
    max-width: 800px;

    .header {
      display: flex;
      align-items: center;
      font-size: 1.25rem;
      justify-content: space-between;
    }

    .info {
      align-items: center;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;
    }

    .qrcode {
      margin: var(--spacing-lg) auto;
      width: 100%;
      max-width: 300px;
    }

    .share-row {
      display: flex;
      gap: var(--spacing-lg);
      align-items: center;
    }
  }
}
</style>

<script setup>
import { ref, defineExpose, useTemplateRef, computed, watch } from "vue";
import { toDataURL } from "qrcode";

import { tracks } from "../stores/tracks.js";

import copyIcon from "../../assets/icons/copy.svg";
import checkIcon from "../../assets/icons/check.svg";
import CloseIcon from "../../assets/icons/close.svg";

const refs = {
  urlInput: useTemplateRef("urlInput"),
};
const isOpened = ref(false);
const isCopied = ref(false);
const currentUrl = ref("");
const currentQrCode = ref("");

watch(tracks, async () => {
  currentUrl.value = getShareUrl();
  currentQrCode.value = await getQrCode();
});

async function open() {
  isOpened.value = true;
}

async function close() {
  isOpened.value = false;
}

async function copyLink() {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    isCopied.value = true;
    setTimeout(() => (isCopied.value = false), 2000);
  } catch (e) {
    refs.urlInput.value.select();
  }
}

function getShareUrl() {
  const { origin, pathname } = window.location;
  const currentUrl = new URL(origin + pathname);

  for (const track of tracks.asList) {
    currentUrl.searchParams.append("yt", track.videoId);
  }

  return currentUrl.toString();
}

function getQrCode() {
  return toDataURL(currentUrl.value, {
    width: 300,
    margin: 0,
    color: {
      dark: "#ffffffff",
      light: "#ffffff00",
    },
  });
}

defineExpose({ open, close });
</script>
