<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const user = useUserStore();

const detailsElement = ref();

const appName = import.meta.env.VITE_APP_NAME;

const blur = () => {
  detailsElement.value.removeAttribute("open");
};
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
        <li :aria-busy="user.isLoading">
          <details
            class="dropdown"
            ref="detailsElement"
            v-show="!user.isLoading"
          >
            <summary :aria-busy="user.isLoading">
              {{ $t("My Account") }}
            </summary>
            <ul @click="blur()">
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
