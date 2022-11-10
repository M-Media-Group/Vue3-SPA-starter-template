<script setup lang="ts">
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import BaseModal from "@/components/modals/BaseModal.vue";
import AddPaymentMethod from "@/forms/AddPaymentMethod.vue";

const userStore = useUserStore();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirmingPaymentMethod = () => {
  isConfirming.value = true;
  if (userStore.user?.pm_type) {
    return handleAddedPaymentMethod();
  }
  modal.value.openModal();
};

const handleAddedPaymentMethod = () => {
  emits("confirmed");
  modal.value.closeModal();
};
</script>
<template>
  <span>
    <span @click.prevent="startConfirmingPaymentMethod">
      <slot :isConfirming="isConfirming" />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Add a payment method')"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <AddPaymentMethod @added="handleAddedPaymentMethod" />
    </BaseModal>
  </span>
</template>
