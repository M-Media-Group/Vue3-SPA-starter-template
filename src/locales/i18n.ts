import { nextTick } from "vue";
import { createI18n, type I18n } from "vue-i18n";
import axios from "axios";
import { updateOrCreateMetaTag } from "@/router/metaTagsHandler";

export const SUPPORT_LOCALES = ["en", "fr"];

export function setupI18n() {
  let locale =
    localStorage.getItem("locale") ?? navigator.language.split("-")[0] ?? "en";
  // If the locale is not supported, fallback to English
  if (!["en", "fr"].includes(locale)) {
    locale = "en";
  }

  const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    fallbackLocale: "en", // set fallback locale
    // something vue-i18n options here ...
  });
  //   We load the fallback language just in case
  loadLocaleMessages(i18n, "en");

  setI18nLanguage(i18n, locale);

  return i18n;
}

export function setI18nLanguage(
  i18n: I18n<{}, {}, {}, string, false>,
  locale: string
) {
  i18n.global.locale.value = locale;
  // Set the document locale
  document.documentElement.lang = locale;
  // Set the document direction
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  // Set a local storage item
  localStorage.setItem("locale", locale);
  // Set the axios locale
  axios.defaults.headers.common["Accept-Language"] = locale;
  //   Set the og:locale
  updateOrCreateMetaTag("og:locale", locale);
  //   Load the locale messages
  loadLocaleMessages(i18n, locale);
}

export async function loadLocaleMessages(
  i18n: { global: { setLocaleMessage: (arg0: any, arg1: any) => void } },
  locale: string
) {
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `../locales/${locale}.json`
  );

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);
  return nextTick();
}

const i18n = setupI18n();

export default i18n;
