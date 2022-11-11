<script setup lang="ts">
import { defineAsyncComponent, onMounted, ref } from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  middleware: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    required: false,
  },
});

let middleware: { default: () => any };

onMounted(async () => {
  middleware = await fetchMiddleware(props.middleware);
});

const fetchMiddleware = async (name: string) => {
  try {
    const middleware = await import(`./../../router/middlewares/${name}.ts`);
    return middleware;
  } catch (e) {
    console.error("Failed loading middleware", e);
    throw new Error(
      "Failed loading middleware " +
        name +
        ". Are you sure the middleware you passed to the ConfirmsMiddleware modal component exists?"
    );
  }
};

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const startConfirming = async () => {
  if (middleware === undefined) {
    return;
  }
  isConfirming.value = true;
  const middlewareResponse = await middleware.default();
  if (middlewareResponse === undefined) {
    return HandleConfirmed();
  }
  if (middlewareResponse === false) {
    return HandleFailed();
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

const ConfirmationElement = defineAsyncComponent(
  () => import(`./../../forms/${props.form}.vue`)
);
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
        :success="HandleConfirmed"
        :fail="HandleFailed"
      >
        <ConfirmationElement
          v-if="form && modal?.isModalOpen"
          @success="HandleConfirmed"
        />
      </slot>
    </BaseModal>
  </span>
</template>
