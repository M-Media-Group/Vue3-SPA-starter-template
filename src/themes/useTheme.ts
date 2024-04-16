import $bus, { eventTypes } from "@/eventBus/events";
import { ref } from "vue";

/**
 * The supported themes. Dark, light, and system.
 *
 */
export const SUPPORT_THEMES = ["system", "dark", "light"];

export const getBestGuessTheme = () => {
  return (
    localStorage.getItem("theme") ??
    // Read the data-theme attribute from the html element
    document.documentElement.getAttribute("data-theme") ??
    // Use the first supported theme
    SUPPORT_THEMES[0]
  );
};

const currentTheme = ref(getBestGuessTheme());

export const setTheme = (value: string, emit = true) => {
  if (value === "system") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", value);
  }
  localStorage.setItem("theme", value);
  currentTheme.value = value;
  if (emit) {
    $bus.$emit(eventTypes.changed_theme, value);
  }
};

export const getCurrentTheme = () => {
  return document.documentElement.getAttribute("data-theme") ?? "system";
};

/**
 * Set the current app theme to the best-guessed theme
 */
export function setBestGuessTheme() {
  let theme = getBestGuessTheme();
  // If the theme is not supported, fallback to system
  if (!SUPPORT_THEMES.includes(theme)) {
    theme = SUPPORT_THEMES[0];
  }

  setTheme(theme);
}

/**
 * Setup theme
 */
export function setupTheme() {
  setBestGuessTheme();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light", false);
    });
}

/**
 * Export as Vue3 plugin
 *
 */
export const ThemePlugin = {
  install: () => {
    // Install by running the setup function
    setupTheme();
  },
};

export default currentTheme;
