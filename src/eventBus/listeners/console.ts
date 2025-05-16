import type { EventTypes, ListenersMap } from "type-safe-event-bus";

const options = {};

const events: EventTypes[] = [
  "enabled_analytics",
  "disabled_analytics",
  "went_offline",
  "came_online",
  "viewed_page",
  "logged_in",
  "logged_out",
  "sent_reset_password_email",
  "reset_password",
  "confirmed_password",
  "confirmed_email",
  "updated_user",
  "registered",
  "created_personal_access_token",
  "deleted_personal_access_token",
  "added_payment_method",
  "changed_locale",
  "changed_theme",
];

const listeners: ListenersMap = {};

if (import.meta.env.DEV) {
  for (const event of events as EventTypes[]) {
    listeners[event] = (e) => {
      console.log("event", event, e);
    };
  }
}

export default options satisfies ListenersMap;
