<script setup lang="ts"></script>
<template>
  <footer>
    <ul>
      <li>Scan & Paddle</li>
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
