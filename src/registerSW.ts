// Service Worker Registration for Offline Caching
export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('[SW] Service Worker registered with scope:', registration.scope);

          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker == null) return;

            installingWorker.onstatechange = () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('[SW] New content is available; please refresh.');
                  window.dispatchEvent(new CustomEvent('clay_sw_updated'));
                } else {
                  console.log('[SW] Content cached for offline use.');
                  window.dispatchEvent(new CustomEvent('clay_sw_cached'));
                }
              }
            };
          };
        })
        .catch((error) => {
          console.warn('[SW] Service Worker registration failed (normal in sandboxed iframes):', error);
        });
    });
  }
}
