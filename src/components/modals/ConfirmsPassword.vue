<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import { useUserStore } from "@/stores/user";
import BaseModal from "@/components/modals/BaseModal.vue";

const userStore = useUserStore();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirmingPassword = async () => {
  isConfirming.value = true;
  const shouldConfirmPassword = await userStore.shouldConfirmPassword();
  if (!shouldConfirmPassword) {
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
    <span @click.prevent="startConfirmingPassword">
      <slot :isConfirming="isConfirming" />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Confirm your password')"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <ConfirmPassword v-if="modal?.isModalOpen" @confirmed="handleConfirmed" />
    </BaseModal>
  </span>
</template>
