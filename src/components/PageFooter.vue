<script setup lang="ts">
import i18n, { SUPPORT_LOCALES, setI18nLanguage } from "@/locales/i18n";
import { eventTypes, useEventsBus } from "@/eventBus/events";

const appName = import.meta.env.VITE_APP_NAME;

const $bus = useEventsBus();

const handleLocaleChange = (locale: string) => {
  setI18nLanguage(i18n, locale);
};

const setDarkMode = (value: string) => {
  if (value === "dark" || value === "light") {
    document.documentElement.setAttribute("data-theme", value);
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  $bus.$emit(eventTypes.changed_theme, value);
};
</script>
<template>
  <footer>
    <ul>
      <li>{{ appName }}</li>
      <li>
        <select
          name="dark-mode"
          @change="setDarkMode(($event.target as HTMLSelectElement).value)"
        >
          <option value="auto">{{ $t("Auto") }}</option>
          <option value="light">{{ $t("Light") }}</option>
          <option value="dark">{{ $t("Dark") }}</option>
        </select>
      </li>
      <li>
        <select
          v-model="$i18n.locale"
          name="locales"
          @change="
            handleLocaleChange(($event.target as HTMLSelectElement).value)
          "
        >
          <option
            v-for="locale in SUPPORT_LOCALES"
            :key="`locale-${locale}`"
            :value="locale"
          >
            {{ $t(locale) }}
          </option>
        </select>
      </li>
    </ul>
  </footer>
</template>
