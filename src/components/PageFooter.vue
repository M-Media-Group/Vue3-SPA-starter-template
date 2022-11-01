<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME;

const handleLocaleChange = (locale: string) => {
  // Set the document locale
  document.documentElement.lang = locale;
  // Set the document direction
  document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
  // Set a local storage item
  localStorage.setItem("locale", locale);
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
            v-for="locale in $i18n.availableLocales"
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
