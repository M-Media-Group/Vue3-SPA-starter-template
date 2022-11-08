import { event, optIn, optOut, pageview, set } from "vue-gtag";
import type { eventTypes } from "../events";

export default {
  enabled_analytics: () => {
    optIn();
    event("analytics_opt_in");
  },
  disabled_analytics: () => {
    event("analytics_opt_out");
    optOut();
  },
  viewed_page: (to: any) => {
    pageview(to);
  },
  logged_in: () => {
    event("login");
  },
  registered: () => {
    event("sign_up");
  },
  added_payment_method: () => {
    event("add_payment_info", {
      payment_type: "card",
    });
  },
  changed_locale: (locale: string) => {
    set({ locale: locale });
    event("change_locale", {
      locale: locale,
    });
  },
  changed_theme: (theme: string) => {
    set({ theme: theme });
    event("change_theme", {
      theme: theme,
    });
  },
  created_personal_access_token: () => {
    event("create_personal_access_token");
  },
} as Record<eventTypes, any>;
