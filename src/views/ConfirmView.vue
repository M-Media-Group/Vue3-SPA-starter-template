<script setup lang="ts">
import CardElement from "@/components/CardElement.vue";
import { defineAsyncComponent } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const element = defineAsyncComponent(
  () => import(`./../forms/${route.params.element}.vue`)
);
const redirect = () => {
  // Redirect to the home page
  router.push((router.currentRoute.value.query.redirect as string) ?? "/");
};
</script>
<template>
  <card-element title="Continue">
    <component :is="element" @success="redirect"></component>
  </card-element>
</template>
