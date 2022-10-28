<script setup lang="ts">
import { useUserStore } from "@/stores/user";

const user = useUserStore();
</script>
<template>
  <nav>
    <div class="logo">Scan & Paddle</div>
    <ul>
      <template v-if="user.isAuthenticated">
        <li>
          <router-link to="/sign-up">My Account</router-link>
        </li>
      </template>
      <template v-else>
        <li>
          <router-link to="/">Home</router-link>
        </li>
        <li>
          <router-link to="/login">Login</router-link>
        </li>
        <li>
          <router-link to="/sign-up">Sign Up</router-link>
        </li>
      </template>
    </ul>
  </nav>
</template>
