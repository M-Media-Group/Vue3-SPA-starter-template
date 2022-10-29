<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const user = useUserStore();
</script>
<template>
  <nav>
    <ul>
      <li><strong>Scan & Paddle</strong></li>
    </ul>
    <ul>
      <template v-if="user.isAuthenticated">
        <li>
          <details role="list" dir="rtl">
            <summary aria-haspopup="listbox" role="link">
              {{ $t("My Account") }}
            </summary>
            <ul role="listbox">
              <li>
                <router-link to="/settings">{{ $t("Settings") }}</router-link>
              </li>
              <li>
                <router-link to="/logout">{{ $t("Logout") }}</router-link>
              </li>
            </ul>
          </details>
        </li>
      </template>
      <template v-else>
        <li>
          <router-link to="/">{{ $t("My Account") }}</router-link>
        </li>
        <li>
          <router-link to="/login">{{ $t("Login") }}</router-link>
        </li>
        <li>
          <router-link to="/sign-up">{{ $t("Sign up") }}</router-link>
        </li>
        <li>
          <select v-model="$i18n.locale">
            <option v-for="locale in $i18n.availableLocales" :key="locale">
              {{ locale }}
            </option>
          </select>
        </li>
      </template>
    </ul>
  </nav>
</template>
