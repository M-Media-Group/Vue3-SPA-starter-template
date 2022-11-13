import { nextTick } from "vue";
import { type I18n, createI18n } from "vue-i18n";
import axios from "axios";
import { setLocaleToUse, setMetaAttributes } from "@m-media/vue3-meta-tags";
import router from "@/router";
import $bus, { eventTypes } from "@/eventBus/events";

/**
 * The supported locales in the app. Note that the first locale in this array is the default locale.
 */
export const SUPPORT_LOCALES = ["en", "fr"];

/**
 * The best guess locale. Will first try to get it from the localStorage, then from the navigator, and if those fail, will use the first supported locale
 */
export const bestGuessLocale =
  localStorage.getItem("locale") ??
  navigator.language.split("-")[0] ??
  SUPPORT_LOCALES[0];

/**
 * Set the current app locale to the best-guessed locale
 */
export function setBestGuessLocale(i18n: I18n<{}, {}, {}, string, false>) {
  let locale = bestGuessLocale;
  // If the locale is not supported, fallback to English
  if (!SUPPORT_LOCALES.includes(locale)) {
    locale = SUPPORT_LOCALES[0];
  }

  setI18nLanguage(i18n, locale);
}

/**
 * Setup i18n
 */
export function setupI18n() {
  const i18n = createI18n({
    legacy: false, // you must set `false`, to use Composition API
    fallbackLocale: SUPPORT_LOCALES[0], // set fallback locale
    // something vue-i18n options here ...
  });

  // Load the fallback locale
  loadLocaleMessages(i18n, SUPPORT_LOCALES[0]);

  // Set the best guess locale
  setBestGuessLocale(i18n);

  window.onlanguagechange = () => {
    const newLanguage = navigator.language.split("-")[0];
    setI18nLanguage(i18n, newLanguage);
  };

  return i18n;
}

// @todo: opportunity to refactor - parts of this code does not / should not run on first page load (e.g. when its called from setupI18n)
export async function setI18nLanguage(
  i18n: I18n<{}, {}, {}, string, false>,
  locale: string,
  emit = true
) {
  // If the locale is not supported, fallback to English
  if (!SUPPORT_LOCALES.includes(locale)) {
    locale = SUPPORT_LOCALES[0];
  }

  i18n.global.locale.value = locale;
  // Set a local storage item
  localStorage.setItem("locale", locale);
  // Set the axios locale
  axios.defaults.headers.common["Accept-Language"] = locale;
  // Load the locale messages
  await loadLocaleMessages(i18n, locale);
  // Re run the meta tags handler when the language changes to update SEO meta tags
  //   When the router first loads, its matched routes are empty, so we know that we don't need to run the meta tags handler (because the page isn't ready yet, so the language meta will be handled after the page loads by the router)
  if (router.currentRoute.value.matched.length !== 0) {
    const to = router.currentRoute.value;
    const from = router.currentRoute.value;
    setLocaleToUse(locale);
    setMetaAttributes(to, from);
  }
  // Emit an event to let the app know that the language has changed, if the emit param is true
  if (emit) {
    $bus.$emit(eventTypes.changed_locale, locale);
  }
}

/**
 * Load the JSON locale files dynamically from the locales/ folder
 */
export async function loadLocaleMessages(
  i18n: { global: { setLocaleMessage: (arg0: any, arg1: any) => void } },
  locale: string
) {
  if (!SUPPORT_LOCALES.includes(locale)) {
    return;
  }
  // load locale messages with dynamic import
  const messages = await import(
    /* webpackChunkName: "locale-[request]" */ `../locales/${locale}.json`
  );

  // set locale and locale message
  i18n.global.setLocaleMessage(locale, messages.default);
  return nextTick();
}

/**
 * Our i18n instance
 */
const i18n = setupI18n();

export default i18n;
