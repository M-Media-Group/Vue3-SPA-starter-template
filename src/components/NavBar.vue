<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const user = useUserStore();

const appName = import.meta.env.VITE_APP_NAME;
</script>
<template>
  <nav>
    <ul>
      <li>
        <router-link to="/" aria-roledescription="logo"
          ><strong>{{ appName }}</strong></router-link
        >
      </li>
    </ul>
    <ul>
      <template v-if="user.isAuthenticated">
        <li>
          <details role="list" dir="rtl">
            <summary
              aria-haspopup="listbox"
              role="link"
              :aria-busy="user.isLoading"
            >
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
          <router-link to="/">{{ $t("Home") }}</router-link>
        </li>
        <li>
          <router-link to="/login">{{ $t("Login") }}</router-link>
        </li>
        <li>
          <router-link to="/sign-up">{{ $t("Sign up") }}</router-link>
        </li>
      </template>
    </ul>
  </nav>
</template>
