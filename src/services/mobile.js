export function initializeMobile() {
  if ("virtualKeyboard" in navigator) {
    navigator.virtualKeyboard.overlaysContent = true;
  }

  setViewportHeight();
  window.addEventListener("resize", setViewportHeight);
  window.visualViewport?.addEventListener("resize", setViewportHeight);
}

function setViewportHeight() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}
