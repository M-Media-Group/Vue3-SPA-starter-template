<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import confirmedPassword from "@/router/middlewares/confirmedPassword";

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirming = async () => {
  isConfirming.value = true;
  if (!(await confirmedPassword())) {
    return handleConfirmed();
  }
  modal.value.openModal();
};

const handleConfirmed = () => {
  emits("confirmed");
  modal.value.closeModal();
};

const ConfirmPassword = defineAsyncComponent(
  () => import("@/forms/ConfirmPassword.vue")
);
</script>
<template>
  <span>
    <span @click.prevent="startConfirming">
      <slot :isConfirming="isConfirming" />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Confirm your password')"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <ConfirmPassword v-if="modal?.isModalOpen" @success="handleConfirmed" />
    </BaseModal>
  </span>
</template>
