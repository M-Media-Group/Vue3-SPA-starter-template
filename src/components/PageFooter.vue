<script setup lang="ts">
const appName = import.meta.env.VITE_APP_NAME;
</script>
<template>
  <footer>
    <ul>
      <li>{{ appName }}</li>
      <li>
        <select v-model="$i18n.locale" name="locales">
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
