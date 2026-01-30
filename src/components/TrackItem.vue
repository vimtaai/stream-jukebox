<template>
  <div
    :class="{ track: true, playing: isPlaying, [settings.layout]: true }"
    @click="togglePlay"
  >
    <img :src="thumbnailUrl" alt="Thumbnail" class="thumbnail" />
    <img :src="youtubeIcon" :alt="track.source" class="source" />

    <div
      ref="description"
      class="description"
      :contenteditable="isEditing"
      :value="track.title"
      @keydown.enter.prevent="updateTitle"
      @blur="updateTitle"
      @click.prevent
    >
      {{ track.title }}
    </div>

    <menu class="controls">
      <div :class="{ menu: true, hidden: !isControlsOpen }">
        <button class="negative" title="Delete" @click.stop="deleteTrack">
          <img :src="trashIcon" alt="Delete" class="icon large" />
        </button>
        <button title="Edit" @click.stop="setEditing">
          <img :src="editIcon" alt="Edit" class="icon large" />
        </button>
        <button v-if="!isPlaying" class="accent" title="Play">
          <img :src="playIcon" alt="Play" class="icon large" />
        </button>
        <button v-if="isPlaying" class="accent" title="Pause">
          <img :src="pauseIcon" alt="Pause" class="icon large" />
        </button>
        <button title="Close" @click.stop="toggleButtons">
          <img :src="closeIcon" alt="Close" />
        </button>
      </div>

      <div :class="{ toggle: true, hidden: isControlsOpen }">
        <button title="More" @click.stop="toggleButtons">
          <img :src="moreIcon" alt="Actions" />
        </button>
      </div>
    </menu>

    <div class="player">
      <div :id="playerId"></div>
    </div>
  </div>
</template>

<style scoped>
.track {
  align-items: center;
  background: var(--gradient-background-control);
  border-radius: var(--radius-xl);
  border: 2px solid var(--color-border);
  cursor: pointer;
  display: flex;
  overflow: hidden;
  padding: var(--spacing-xs);
  position: relative;
  transition:
    transform var(--transition-normal),
    border var(--transition-normal);

  &:hover {
    border-color: var(--color-border-strong);
  }

  &.playing {
    border-color: var(--color-positive);

    &:hover {
      border-color: var(--color-positive-strong);
    }
  }

  .thumbnail {
    object-fit: cover;
    border-radius: calc(var(--radius-xl) - 2px);
    height: 100%;
  }

  .source {
    position: absolute;
    width: 24px;
    height: 24px;
  }

  .description {
    border: 1px solid transparent;
    border-radius: var(--radius-md);
    flex-grow: 1;
    font-weight: bold;
    outline: 2px solid transparent;
    text-overflow: ellipsis;
    overflow: hidden;

    &:focus {
      background: none;
      border-color: var(--color-accent-strong);
      outline-color: var(--color-accent);
    }

    &:disabled {
      pointer-events: none;
    }
  }

  .player {
    display: none;
  }

  .controls {
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
      background: var(--color-background-overlay);
      display: flex;
      gap: var(--spacing-md);
      inset: 0 0 0 0;
      justify-content: flex-end;
      opacity: 1;
      position: absolute;
    }
  }

  &.list {
    gap: var(--spacing-lg);
    height: 64px;
    padding-right: var(--spacing-lg);
    width: 100%;

    .description {
      margin: var(--spacing-md) 0;
    }

    .source {
      inset: auto auto var(--spacing-sm) var(--spacing-sm);
    }

    .controls {
      .menu {
        padding-right: var(--spacing-lg);
      }
    }
  }

  &.grid {
    align-items: stretch;
    aspect-ratio: 1 / 1;
    flex-direction: column;
    max-width: 200px;
    height: 100%;

    .thumbnail {
      display: none;
    }

    .source {
      inset: auto auto var(--spacing-md) var(--spacing-md);
    }

    .description {
      justify-content: flex-start;
      margin: var(--spacing-md);
      text-align: center;
    }

    .controls {
      text-align: right;
      padding: var(--spacing-sm);

      .menu {
        display: grid;
        grid-template: repeat(2, 1fr) / repeat(2, 1fr);
        padding: var(--spacing-md);
        place-items: center;
      }
    }
  }
}
</style>

<script setup>
import { computed, nextTick, onMounted, ref, useTemplateRef } from "vue";

import { tracks } from "../stores/tracks";
import { settings } from "../stores/settings";
import { saveTracks } from "../services/storage";

import moreIcon from "../../assets/icons/more.svg";
import closeIcon from "../../assets/icons/close.svg";
import playIcon from "../../assets/icons/play.svg";
import pauseIcon from "../../assets/icons/pause.svg";
import editIcon from "../../assets/icons/edit.svg";
import trashIcon from "../../assets/icons/trash.svg";
import youtubeIcon from "../../assets/icons/youtube.svg";
import { getYouTubeApi } from "../services/youtube";

const props = defineProps({
  track: { type: Object, required: true },
});

const refs = {
  desciption: useTemplateRef("description"),
};

const player = ref(null);
const isEditing = ref(false);
const isReady = ref(false);
const isPlaying = ref(false);
const isControlsOpen = ref(false);

const playerId = computed(() => `yt-${props.track.id}`);
const thumbnailUrl = computed(() => {
  return `https://i.ytimg.com/vi/${props.track.videoId}/hqdefault.jpg`;
});

onMounted(async () => {
  const { Player, PlayerState } = await getYouTubeApi();
  const parameters = {
    autoplay: 0,
    controls: 0,
    showinfo: 0,
    modestbranding: 1,
    enablejsapi: 1,
    loop: 1,
    origin: window.location.origin,
  };

  player.value = new Player(playerId.value, {
    videoId: props.track.videoId,
    playerVars: parameters,
    events: {
      onReady: (event) => {
        isReady.value = true;
      },
      onStateChange: (event) => {
        isPlaying.value = event.data === PlayerState.PLAYING;
      },
    },
  });

  console.log(player.value);
});

function toggleButtons() {
  isControlsOpen.value = !isControlsOpen.value;
}

async function setEditing() {
  isControlsOpen.value = false;
  isEditing.value = true;
  await nextTick();
  refs.desciption.value.focus();
}

function updateTitle(event) {
  const newTitle = refs.desciption.value.innerText.trim();
  isEditing.value = false;
  tracks.update(props.track.id, { title: newTitle });
  saveTracks(tracks.asMap);
}

function deleteTrack(event) {
  tracks.delete(props.track.id);
  saveTracks(tracks.asMap);
}

async function togglePlay() {
  if (!isReady.value || isEditing.value) {
    return;
  }

  if (isPlaying.value === false) {
    player.value.playVideo();
  } else {
    player.value.pauseVideo();
  }

  isPlaying.value = player.value.getPlayerState() === 1;
}
</script>
