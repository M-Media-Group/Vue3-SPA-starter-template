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
  title: {
    type: String,
    required: true,
  },
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
    </BaseModal>
  </span>
</template>
