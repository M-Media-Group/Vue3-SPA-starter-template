<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import { defineAsyncComponent } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const element = defineAsyncComponent(
  () => import(`./../forms/${route.params.element}.vue`)
);
</script>
<template>
  <CardElement title="Continue">
    <component :is="element"></component>
  </CardElement>
</template>
