<script setup lang="ts">
import { type PropType, defineAsyncComponent, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { MiddlewareHandler } from "@/router/middlewareHandler";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  middleware: {
    type: Array as PropType<string[] | string>,
    required: true,
  },
});

const formToUse = ref();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirming = async () => {
  if (props.middleware === undefined) {
    return;
  }
  isConfirming.value = true;
  const middlewareResponse = await new MiddlewareHandler(
    props.middleware
  ).handle();
  console.log("Got response", middlewareResponse);
  if (middlewareResponse === undefined) {
    return HandleConfirmed();
  }
  if (middlewareResponse === false) {
    return HandleFailed();
  }
  if (typeof middlewareResponse === "string") {
    formToUse.value = middlewareResponse;
    setElement();
  }
  modal.value.openModal();
};

const HandleConfirmed = () => {
  emits("confirmed");
  modal.value.closeModal();
};

const HandleFailed = () => {
  modal.value.closeModal();
};

const ConfirmationElement = ref();

const setElement = () => {
  ConfirmationElement.value = defineAsyncComponent(
    () => import(`./../../forms/${formToUse.value}.vue`)
  );
};
</script>
<template>
  <span>
    <span @click.prevent="startConfirming">
      <slot :isConfirming="isConfirming" />
    </span>

    <BaseModal
      ref="modal"
      :title="title"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <slot
        name="confirmationElement"
        :success="startConfirming"
        :fail="HandleFailed"
      >
        <component
          :is="ConfirmationElement"
          v-if="formToUse && modal?.isModalOpen"
          @success="startConfirming"
        />
      </slot>
    </BaseModal>
  </span>
</template>
