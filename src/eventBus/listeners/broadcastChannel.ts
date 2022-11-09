import router from "@/router";
import { eventTypes } from "../events";

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
} as Record<eventTypes, any>;
