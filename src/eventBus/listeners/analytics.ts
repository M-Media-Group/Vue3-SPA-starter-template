import { event, pageview, optIn, optOut } from "vue-gtag";
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
    event("add_payment_info");
  },
  created_personal_access_token: () => {
    event("created_personal_access_token");
  },
} as Record<eventTypes, any>;
