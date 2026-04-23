const FADE_DURATION_MS = 200;
const OVERLAY_ID = "__transition-fade-overlay";

let overlayEl = null;

const ensureOverlay = () => {
  if (typeof document === "undefined") return null;
  if (overlayEl && document.body.contains(overlayEl)) return overlayEl;
  overlayEl = document.getElementById(OVERLAY_ID);
  if (overlayEl) return overlayEl;
  overlayEl = document.createElement("div");
  overlayEl.id = OVERLAY_ID;
  overlayEl.style.cssText = [
    "position: fixed",
    "inset: 0",
    "background: #000",
    "opacity: 0",
    "pointer-events: none",
    "z-index: 99999",
    `transition: opacity ${FADE_DURATION_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
    "will-change: opacity",
  ].join(";");
  document.body.appendChild(overlayEl);
  return overlayEl;
};

const FADE_OUT_RESOLVE_RATIO = 0.7;

export const fadeOut = () =>
  new Promise((resolve) => {
    const overlay = ensureOverlay();
    if (!overlay) {
      resolve();
      return;
    }
    overlay.style.pointerEvents = "auto";
    // Force reflow so transition fires from current opacity
    void overlay.offsetHeight;
    overlay.style.opacity = "1";
    // Resolve before the fade is fully complete — navigation fires while overlay is
    // already ~85% opaque (indistinguishable from fully opaque to the eye) so there's
    // no perceived "waiting for black" beat.
    window.setTimeout(resolve, FADE_DURATION_MS * FADE_OUT_RESOLVE_RATIO);
  });

export const fadeIn = () => {
  const overlay = ensureOverlay();
  if (!overlay) return;
  overlay.style.opacity = "0";
  overlay.style.pointerEvents = "none";
};

export const FADE_DURATION = FADE_DURATION_MS;
