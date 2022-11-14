<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import CardElement from "@/components/CardElement.vue";
import BaseButton from "../BaseButton.vue";

const props = defineProps({
  // The title of the card
  title: {
    type: String,
    required: true,
  },
  allowBackgroundClickToClose: {
    type: Boolean,
    required: false,
    default: true,
  },
  showFooter: {
    type: Boolean,
    required: false,
    default: true,
  },
  showCloseInHeader: {
    type: Boolean,
    required: false,
    default: true,
  },
  showTrigger: {
    type: Boolean,
    required: false,
    default: true,
  },
  triggerText: {
    type: String,
    required: false,
    default: null,
  },
});

const isModalOpen = ref(false);

const modalId = "modal-" + Math.random().toString(36).substring(2, 15);

const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const animationDuration = 400; // ms

const emits = defineEmits(["opened", "closed"]);

const openModal = () => {
  if (isModalOpen.value) {
    return;
  }
  isModalOpen.value = true;
  document.documentElement.classList.add(isOpenClass, openingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(openingClass);
    emits("opened");
  }, animationDuration);
};

const closeModal = () => {
  if (!isModalOpen.value) {
    return;
  }
  document.documentElement.classList.add(closingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(closingClass, isOpenClass);
    isModalOpen.value = false;
    emits("closed");
  }, animationDuration);
};

const closeModalIfBackgroundClicked = (event: Event) => {
  if (!props.allowBackgroundClickToClose) {
    return;
  }
  if (event.target === event.currentTarget) {
    closeModal();
  }
};

onUnmounted(() => {
  closeModal();
});

// Export the openModal function so that it can be called from the parent
// component
defineExpose({
  isModalOpen,
  openModal,
  closeModal,
});
</script>
<template>
  <slot name="trigger" :openModal="openModal" :isOpen="isModalOpen">
    <!-- Button to trigger the modal -->
    <button
      v-if="showTrigger"
      class="contrast"
      :data-target="modalId"
      @click="openModal()"
      :aria-busy="isModalOpen"
    >
      {{ triggerText ?? title }}
    </button>
  </slot>

  <!-- Modal -->
  <dialog
    :id="modalId"
    :open="isModalOpen"
    @click="closeModalIfBackgroundClicked"
    @keydown.esc="closeModal"
  >
    <CardElement :title="title">
      <template #headerActions>
        <a
          href="#close"
          :aria-label="$t('Close')"
          class="close"
          :data-target="modalId"
          @click.prevent="closeModal()"
          v-if="showCloseInHeader"
        >
        </a>
      </template>
      <slot></slot>

      <template #footer v-if="showFooter || $slots.footer">
        <slot name="footer">
          <BaseButton
            class="secondary"
            :data-target="modalId"
            @click.prevent="closeModal()"
          >
            {{ $t("Cancel") }}
          </BaseButton>
          <BaseButton :data-target="modalId" @click.prevent="closeModal()">
            {{ $t("Confirm") }}
          </BaseButton>
        </slot>
      </template>
    </CardElement>
  </dialog>
</template>
