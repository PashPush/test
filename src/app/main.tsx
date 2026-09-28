import './styles/index.css';

// The HTML is prerendered, so the first paint needs no JS. Fetch the app once the page is on
// screen: until then CSS, fonts and the hero image have the bandwidth and the main thread.
const mount = () => void import('./mount');

if (!document.getElementById('root')!.firstElementChild) {
  mount(); // dev server: nothing to paint without the app
} else if (PerformanceObserver.supportedEntryTypes?.includes('paint')) {
  new PerformanceObserver((list, observer) => {
    if (!list.getEntriesByName('first-contentful-paint').length) return;
    observer.disconnect();
    mount();
  }).observe({ type: 'paint', buffered: true });
} else {
  requestAnimationFrame(() => setTimeout(mount));
}
