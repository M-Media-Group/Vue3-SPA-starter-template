<script setup lang="ts">
import {
  type PropType,
  defineAsyncComponent,
  ref,
  shallowRef,
  useSlots,
} from "vue";
import BaseModal from "@/components/modals/BaseModal.vue";
import type { Gate } from "@m-media/vue3-gate-keeper/src/gateKeeper";
import { useGateKeeper } from "@m-media/vue3-gate-keeper";

const props = defineProps({
  /** The title of the modal. It will be in the header of the opened modal. */
  title: {
    type: String,
    required: true,
  },
  /** The gate or gates to check before confirming. */
  gate: {
    type: [Array, String] as PropType<string | Gate | (Gate | string)[]>,
    required: true,
  },
});

const slots = useSlots();

const formToUse = ref();

const emits = defineEmits(["confirmed"]);

const modal = ref();

const isConfirming = ref(false);

const interceptedByGate = ref("");

const runGates = useGateKeeper() as Function;

const startConfirming = async () => {
  if (props.gate === undefined) {
    return;
  }

  isConfirming.value = true;

  const gateResponse = await runGates(props.gate).handle();

  if (gateResponse?.data === undefined) {
    return HandleConfirmed();
  }

  interceptedByGate.value = gateResponse.gate;

  if (
    gateResponse.data === false &&
    !slots["confirmationElement:" + interceptedByGate.value]
  ) {
    return HandleFailed();
  }

  if (typeof gateResponse.data === "string") {
    formToUse.value = gateResponse.data;
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
      <!-- @slot This is the slot for the trigger of the confirmation. You can use this to create a button or any other element to trigger the confirmation. It will be wrapped in a click handler that will trigger the confirmation modal. -->
      <slot :isConfirming="isConfirming" />
    </span>

    <base-modal
      ref="modal"
      :title="title"
      :showTrigger="false"
      :showFooter="false"
      @closed="isConfirming = false"
    >
      <!-- @slot This is the slot for the confirmation element. This is the form or element that will be shown in the modal. -->
      <slot
        :name="'confirmationElement:' + interceptedByGate"
        :success="startConfirming"
        :fail="HandleFailed"
      >
        <component
          :is="ConfirmationElement"
          v-if="formToUse && modal?.isModalOpen"
          @success="startConfirming"
        />
      </slot>
    </base-modal>
  </span>
</template>
