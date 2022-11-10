<script setup lang="ts">
import { defineAsyncComponent, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import auth from "@/router/middlewares/auth";

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirming = async () => {
  isConfirming.value = true;
  if (!(await auth())) {
    return HandleConfirmed();
  }
  modal.value.openModal();
};

const HandleConfirmed = () => {
  emits("confirmed");
  modal.value.closeModal();
};

const LoginOrRegister = defineAsyncComponent(
  () => import("@/forms/LoginOrRegister.vue")
);
</script>
<template>
  <span>
    <span @click.prevent="startConfirming">
      <slot :isConfirming="isConfirming" />
    </span>

    <BaseModal
      ref="modal"
      :title="$t('Connect')"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <LoginOrRegister v-if="modal?.isModalOpen" @success="HandleConfirmed" />
    </BaseModal>
  </span>
</template>
