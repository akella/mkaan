const preloaded = new Set();

export const preloadImage = (url) => {
  if (!url || typeof window === "undefined") return;
  if (preloaded.has(url)) return;
  preloaded.add(url);
  const img = new window.Image();
  img.src = url;
};

const MAX_WAIT_MS = 3000;

export const preloadImageAsync = (url) => {
  if (!url || typeof window === "undefined") return Promise.resolve();
  if (preloaded.has(url)) return Promise.resolve();
  preloaded.add(url);
  return new Promise((resolve) => {
    const img = new window.Image();
    const timeout = setTimeout(resolve, MAX_WAIT_MS);
    img.onload = () => {
      clearTimeout(timeout);
      resolve();
    };
    img.onerror = () => {
      clearTimeout(timeout);
      resolve();
    };
    img.src = url;
  });
};
