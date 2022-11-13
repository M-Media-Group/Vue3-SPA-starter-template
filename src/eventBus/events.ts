import { type App, inject } from "vue";

export enum eventTypes {
  enabled_analytics = "enabled_analytics",
  disabled_analytics = "disabled_analytics",
  went_offline = "went_offline",
  came_online = "came_online",
  viewed_page = "viewed_page",
  logged_in = "logged_in",
  logged_out = "logged_out",
  sent_reset_password_email = "sent_reset_password_email",
  reset_password = "reset_password",
  confirmed_password = "confirmed_password",
  confirmed_email = "confirmed_email",
  updated_user = "updated_user",
  registered = "registered",
  created_personal_access_token = "created_personal_access_token",
  deleted_personal_access_token = "deleted_personal_access_token",
  added_payment_method = "added_payment_method",
  changed_locale = "changed_locale",
  changed_theme = "changed_theme",
}

type EventsObject = { [P in eventTypes]?: any };

class Events {
  events: EventsObject;

  constructor(events = {}) {
    this.events = events;
  }

  $on(eventName: eventTypes, fn: Function) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  }

  $off(eventName: eventTypes, fn: Function) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  $emit(eventName: eventTypes, data = null as any) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function (fn: (arg0: any) => void) {
        fn(data);
      });
    }
  }
}

const eventsInstance = new Events();

export class Listeners {
  constructor(...events: EventsObject[]) {
    events.forEach((event: EventsObject) => {
      Object.keys(event).forEach((eventName: any) => {
        eventsInstance.$on(eventName, event[eventName as eventTypes]);
      });
    });
  }
}

export const eventsBusKey = Symbol.for("eventsBusKey");

export const useEventsBus = () => {
  return inject(eventsBusKey) as Events;
};

// Currently unused
export const EventsPlugin = {
  install: (app: App<any>) => {
    app.provide(eventsBusKey, eventsInstance);
  },
};

export default eventsInstance;
