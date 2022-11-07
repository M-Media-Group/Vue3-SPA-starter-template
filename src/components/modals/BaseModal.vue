<script setup lang="ts">
import { ref } from "vue";
import CardElement from "@/components/CardElement.vue";

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
});

const isModalOpen = ref(false);

const modalId = "modal-" + Math.random().toString(36).substring(2, 15);

const isOpenClass = "modal-is-open";
const openingClass = "modal-is-opening";
const closingClass = "modal-is-closing";
const animationDuration = 400; // ms

const openModal = () => {
  isModalOpen.value = true;
  document.documentElement.classList.add(isOpenClass, openingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(openingClass);
  }, animationDuration);
};

const closeModal = () => {
  document.documentElement.classList.add(closingClass);
  setTimeout(() => {
    document.documentElement.classList.remove(closingClass, isOpenClass);
    isModalOpen.value = false;
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

// Export the openModal function so that it can be called from the parent
// component
defineExpose({
  openModal,
  closeModal,
});
</script>
<template>
  <slot name="trigger" :openModal="openModal">
    <!-- Button to trigger the modal -->
    <button
      v-if="showTrigger"
      class="contrast"
      :data-target="modalId"
      @click="openModal()"
    >
      {{ title }}
    </button>
  </slot>

  <!-- Modal -->
  <dialog
    :id="modalId"
    :open="isModalOpen"
    @click="closeModalIfBackgroundClicked"
  >
    <CardElement :title="title">
      <template #headerActions>
        <a
          href="#close"
          :aria-label="$t('Close')"
          class="close"
          :data-target="modalId"
          @click="closeModal()"
          v-if="showCloseInHeader"
        >
        </a>
      </template>
      <slot></slot>

      <template #footer v-if="showFooter || $slots.footer">
        <slot name="footer">
          <a
            href="#cancel"
            role="button"
            class="secondary"
            :data-target="modalId"
            @click="closeModal()"
          >
            {{ $t("Cancel") }}
          </a>
          <a
            href="#confirm"
            role="button"
            :data-target="modalId"
            @click="closeModal()"
          >
            {{ $t("Confirm") }}
          </a>
        </slot>
      </template>
    </CardElement>
  </dialog>
</template>
