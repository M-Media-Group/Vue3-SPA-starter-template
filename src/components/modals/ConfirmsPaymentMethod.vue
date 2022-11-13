<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import hasPaymentMethod from "@/router/gates/hasPaymentMethod";

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirming = async () => {
  isConfirming.value = true;
  if (!(await new hasPaymentMethod())) {
    return handleConfirmed();
  }
  modal.value.openModal();
};

const handleConfirmed = () => {
  emits("confirmed");
  modal.value.closeModal();
};

const AddPaymentMethod = defineAsyncComponent(
  () => import("@/forms/AddPaymentMethod.vue")
);
</script>
<template>
  <span>
    <span @click.prevent="startConfirming">
      <slot :isConfirming="isConfirming" />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Add a payment method')"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <AddPaymentMethod v-if="modal?.isModalOpen" @success="handleConfirmed" />
    </BaseModal>
  </span>
</template>
