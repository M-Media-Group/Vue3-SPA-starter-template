import { SUPPORT_LOCALES } from "@/locales/i18n";
import { eventTypes } from "../events";

class CustomNotification {
  browserElement!: HTMLElement;

  constructor(
    public type: string = "default",
    public message: string,
    public modes: string[] = ["log"],
    public duration: number = 3500,
    public fallback: string = "browser",
    public callback?: () => void
  ) {
    this.type = type;
    this.message = message;
    this.modes = modes;
    this.duration = duration;
    this.fallback = fallback;
    this.callback = callback;
  }

  public show() {
    if (this.modes.includes("confirm")) {
      confirm(this.message);
    }
    if (this.modes.includes("alert")) {
      alert(this.message);
    }
    if (this.modes.includes("browser")) {
      new BrowserNotification(this.message, this.duration).show();
    }
    if (this.modes.includes("push")) {
      new PushNotification(import.meta.env.VITE_APP_NAME, this.message).show();
    }
    if (this.modes.includes("site")) {
      this.showSite();
    }
    if (this.modes.includes("log")) {
      console.log("Notification:", this);
    }
  }

  public hide() {
    if (this.modes.includes("alert")) {
      // Close browser alert
    }
    console.log("hide");
  }

  private showSite() {
    console.log("show site");
  }
}

class PushNotification {
  constructor(
    public title: string,
    public body: string,
    public icon: string | undefined = undefined,
    public tag: string | undefined = undefined,
    public dir: NotificationDirection | undefined = undefined,
    public lang: string = SUPPORT_LOCALES[0],
    public vibrate: number[] | undefined = undefined,
    public renotify: boolean | undefined = undefined,
    public requireInteraction: boolean | undefined = undefined,
    public silent: boolean | undefined = undefined,
    public timestamp: number | undefined = undefined,
    public actions: any[] | undefined = undefined
  ) {
    this.title = title;
    this.body = body;
    this.icon = icon;
    this.tag = tag;
    this.dir = dir;
    this.lang = lang;
    this.vibrate = vibrate;
    this.renotify = renotify;
    this.requireInteraction = requireInteraction;
    this.silent = silent;
    this.timestamp = timestamp;
    this.actions = actions;
  }

  public show() {
    if (this.supportsPush) {
      if (this.hasPushPermission) {
        this.showPush();
      } else {
        console.log("requesting2222 notification permission");
        this.requestPushPermission().then(() => {
          console.log("got12222 notification permission");

          this.showPush();
        });
      }
    }
  }

  private get supportsPush() {
    return "Notification" in window;
  }

  private get hasPushPermission() {
    return Notification.permission === "granted";
  }

  private async requestPushPermission() {
    // If the user already has permission, return early
    if (this.hasPushPermission) {
      return;
    }
    // Let's check if the browser supports notifications
    if (!this.supportsPush) {
      console.log("This browser does not support notifications.");
      return;
    }
    console.log("requesting notification permission");
    // Otherwise, we need to ask the user for permission
    await Notification.requestPermission();
  }

  private showPush() {
    new Notification(this.title, {
      body: this.body,
      icon: this.icon,
      tag: this.tag,
      dir: this.dir,
      lang: this.lang,
      vibrate: this.vibrate,
      renotify: this.renotify,
      requireInteraction: this.requireInteraction,
      silent: this.silent,
      timestamp: this.timestamp,
      actions: this.actions,
    });
  }

  public hide() {
    console.log("hide");
  }
}

class BrowserNotification {
  browserElement: HTMLElement;

  constructor(
    public message: string,
    public duration: number = 3500,
    public type: string = "default"
  ) {
    // find or create the element in the document
    this.browserElement =
      document.querySelector(".alert") ?? document.createElement("div");
    this.browserElement = document.createElement("div");
    this.browserElement.classList.add("alert");

    // set the type
    this.browserElement.classList.add("alert--" + this.type);

    // set the message
    this.browserElement.innerHTML = this.message;
  }

  public get isVisible() {
    return this.browserElement.parentElement !== null;
  }

  public show() {
    document.body.appendChild(this.browserElement);
    // set the duration
    if (this.duration > 0) {
      setTimeout(() => {
        this.hide();
      }, this.duration);
    }
  }

  public hide() {
    if (!this.isVisible) {
      return;
    }
    document.body.removeChild(this.browserElement);
  }
}

export default {
  [eventTypes.sent_reset_password_email]: () => {
    new CustomNotification(
      "success",
      "We've sent you an email with a link to reset your password.",
      ["browser"],
      5000
    ).show();
  },
} as Record<eventTypes, any>;
