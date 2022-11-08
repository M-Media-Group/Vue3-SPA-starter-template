<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import BaseModal from "@/components/modals/BaseModal.vue";
import ConfirmPassword from "@/forms/ConfirmPassword.vue";

const userStore = useUserStore();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const startConfirmingPassword = async () => {
  const shouldConfirmPassword = await userStore.shouldConfirmPassword();
  if (!shouldConfirmPassword) {
    emits("confirmed");
    return;
  }
  modal.value.openModal();
};

const handleConfirmed = () => {
  emits("confirmed");
  modal.value.closeModal();
};
</script>
<template>
  <span>
    <span @click.prevent="startConfirmingPassword">
      <slot />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Connect')"
      :showTrigger="false"
      :showFooter="false"
    >
      <ConfirmPassword @confirmed="handleConfirmed" />
    </BaseModal>
  </span>
</template>
