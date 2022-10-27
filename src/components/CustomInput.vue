<script setup lang="ts">
defineProps<{
  msg: string;
}>();
</script>

<template>
  <div class="greetings">
    <!-- An input has a label, the input itself, and a help text. -->
    <label for="email">Email address</label>
    <!-- The input can have a prefix and/or suffix -->
    <div class="input-wrapper">
      <div class="prefix">
        <Icon name="email" />
      </div>
      <input
        type="email"
        id="email"
        name="email"
        placeholder="Email address"
        v-model="email"
        required
      />
      <div class="suffix">
        <Icon name="check" />
      </div>
    </div>
    <small>We'll never share your email with anyone else.</small>
  </div>
</template>
