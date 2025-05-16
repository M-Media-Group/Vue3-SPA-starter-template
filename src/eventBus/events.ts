import { type App, inject } from "vue";

import EventBus from "type-safe-event-bus";
import type { RouteLocationNormalized } from "vue-router";

declare module "type-safe-event-bus" {
  interface EventTypesPayloads {
    enabled_analytics: void;
    disabled_analytics: void;
    went_offline: void;
    came_online: void;
    viewed_page: RouteLocationNormalized & {
      name: string;
    };
    logged_in: void;
    logged_out: void;
    sent_reset_password_email: void;
    reset_password: void;
    confirmed_password: void;
    confirmed_email: void;
    updated_user: void;
    registered: void;
    created_personal_access_token: void;
    deleted_personal_access_token: void;
    added_payment_method: void;
    changed_locale: string;
    changed_theme: string;
  }
}

export const eventsBusKey = Symbol.for("eventsBusKey");

export const useEventsBus = () => {
  return inject(eventsBusKey) as typeof EventBus;
};

// Currently unused
export const EventsPlugin = {
  install: (app: App<any>) => {
    app.provide(eventsBusKey, EventBus);
  },
};

export default EventBus;
