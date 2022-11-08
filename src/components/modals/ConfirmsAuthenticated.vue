<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import BaseModal from "@/components/modals/BaseModal.vue";
import LoginOrRegister from "@/forms/LoginOrRegister.vue";

const userStore = useUserStore();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const startConfirmingPaymentMethod = () => {
  if (userStore.isAuthenticated) {
    return handleAuthenticated();
  }
  modal.value.openModal();
};

const handleAuthenticated = () => {
  emits("confirmed");
  modal.value.closeModal();
};
</script>
<template>
  <span>
    <span @click.prevent="startConfirmingPaymentMethod">
      <slot />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Connect')"
      :showTrigger="false"
      :showFooter="false"
    >
      <LoginOrRegister @authenticated="handleAuthenticated" />
    </BaseModal>
  </span>
</template>
