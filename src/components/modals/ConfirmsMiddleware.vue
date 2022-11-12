<script setup lang="ts">
import {
  type PropType,
  defineAsyncComponent,
  ref,
  shallowRef,
  useSlots,
} from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import { type Middleware, MiddlewareHandler } from "@/router/middlewareHandler";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  middleware: {
    type: Array as PropType<string | Middleware | (Middleware | string)[]>,
    required: true,
  },
});

const slots = useSlots();

const formToUse = ref();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const interceptedByMiddleware = ref("");

const startConfirming = async () => {
  if (props.middleware === undefined) {
    return;
  }

  isConfirming.value = true;

  const middlewareResponse = await new MiddlewareHandler(
    props.middleware
  ).handle();

  if (middlewareResponse?.data === undefined) {
    return HandleConfirmed();
  }

  interceptedByMiddleware.value = middlewareResponse.middleware;

  if (
    middlewareResponse.data === false &&
    !slots["confirmationElement:" + interceptedByMiddleware.value]
  ) {
    return HandleFailed();
  }

  if (typeof middlewareResponse.data === "string") {
    formToUse.value = middlewareResponse.data;
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

const ConfirmationElement = shallowRef();

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
        :name="'confirmationElement:' + interceptedByMiddleware"
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
