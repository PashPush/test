export type CvPlace = 'header' | 'mobile_menu' | 'hero' | 'contacts';

interface Events {
  ab_exposure: { experiment_id: string; variant_id: string };
  cv_download: { lang: string; place: CvPlace };
  contact_click: { channel: 'telegram' | 'whatsapp' | 'email' | 'github' };
  form_submit_success: undefined;
  chainsaw_click: undefined;
  case_open: { project: string; via: 'card' | 'link' };
}

// GA4 only. In dev events are logged instead of sent, so local runs don't pollute reports.
export function trackEvent<K extends keyof Events>(
  name: K,
  ...[params]: Events[K] extends undefined ? [] : [Events[K]]
): void {
  if (import.meta.env.DEV) {
    console.log(`%c[event] ${name}`, 'color: #2cc800; font-weight: bold;', params ?? '');
    return;
  }
  window.gtag?.('event', name, params);
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
