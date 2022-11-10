<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import auth from "@/router/middlewares/auth";

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirmingAuthenticationStatus = async () => {
  isConfirming.value = true;
  if (!(await auth())) {
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
