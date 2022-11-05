<script setup lang="ts">
import i18n, { setI18nLanguage, SUPPORT_LOCALES } from "@/locales/i18n";

const appName = import.meta.env.VITE_APP_NAME;

const handleLocaleChange = (locale: string) => {
  setI18nLanguage(i18n, locale);
};
</script>
<template>
  <footer>
    <ul>
      <li>{{ appName }}</li>
      <li>
        <select
          v-model="$i18n.locale"
          name="locales"
          @change="
            handleLocaleChange(($event.target as HTMLSelectElement)?.value)
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
