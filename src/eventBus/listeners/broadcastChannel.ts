import i18n, { setI18nLanguage } from "@/locales/i18n";
import router from "@/router";
import { setTheme } from "@/themes/useTheme";
import type { ListenersMap } from "type-safe-event-bus";

/**
 * Be careful here - its quite easy to accidentally set up an infinite loop
 */

const bc = new BroadcastChannel(import.meta.env.VITE_APP_NAME);

bc.onmessage = (event) => {
  if (event.origin !== window.origin) {
    return;
  }

  if (event.data.type === "logged_in" || event.data.type === "logged_out") {
    // refresh the page
    router.go(0);
  }

  if (event.data.type === "confirmed_email") {
    // refresh the page
    router.go(0);
  }

  if (event.data.type === "changed_locale") {
    setI18nLanguage(i18n, event.data.data, false);
  }

  if (event.data.type === "changed_theme") {
    setTheme(event.data.data, false);
  }
};

export default {
  logged_in: (e: any) => {
    bc.postMessage({
      type: "logged_in",
      data: e,
    });
  },
  logged_out: (e: any) => {
    bc.postMessage({
      type: "logged_out",
      data: e,
    });
  },
  changed_locale: (e: string) => {
    bc.postMessage({
      type: "changed_locale",
      data: e,
    });
  },
  changed_theme: (e: string) => {
    bc.postMessage({
      type: "changed_theme",
      data: e,
    });
  },
  confirmed_email: (e: any) => {
    bc.postMessage({
      type: "confirmed_email",
      data: e,
    });
  },
} satisfies ListenersMap;
