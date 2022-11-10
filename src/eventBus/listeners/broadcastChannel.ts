import i18n, { setI18nLanguage } from "@/locales/i18n";
import router from "@/router";
import { eventTypes } from "../events";

/**
 * Be careful here - its quite easy to accidentally set up an infinite loop
 */

const bc = new BroadcastChannel(import.meta.env.VITE_APP_NAME);

bc.onmessage = (event) => {
  if (event.origin !== window.origin) {
    return;
  }

  if (
    event.data.type === eventTypes.logged_in ||
    event.data.type === eventTypes.logged_out
  ) {
    // refresh the page
    router.go(0);
  }

  if (event.data.type === eventTypes.changed_locale) {
    setI18nLanguage(i18n, event.data.data, false);
  }
};

export default {
  logged_in: (e: any) => {
    bc.postMessage({
      type: eventTypes.logged_in,
      data: e,
    });
  },
  logged_out: (e: any) => {
    bc.postMessage({
      type: eventTypes.logged_out,
      data: e,
    });
  },
  changed_locale: (e: string) => {
    bc.postMessage({
      type: eventTypes.changed_locale,
      data: e,
    });
  },
} as Record<eventTypes, any>;
