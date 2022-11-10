<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { useUserStore } from "@/stores/user";
import BaseModal from "@/components/modals/BaseModal.vue";

const userStore = useUserStore();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirmingAuthenticationStatus = () => {
  isConfirming.value = true;
  if (userStore.isAuthenticated) {
    return handleAuthenticated();
  }
  modal.value.openModal();
};

const handleAuthenticated = () => {
  emits("confirmed");
  modal.value.closeModal();
};

const LoginOrRegister = defineAsyncComponent(
  () => import("@/forms/LoginOrRegister.vue")
);
</script>
<template>
  <span>
    <span @click.prevent="startConfirmingAuthenticationStatus">
      <slot :isConfirming="isConfirming" />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Connect')"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <LoginOrRegister
        v-if="modal?.isModalOpen"
        @authenticated="handleAuthenticated"
      />
    </BaseModal>
  </span>
</template>
