<script setup lang="ts">
import { onUnmounted, ref } from "vue";
import CardElement from "@/components/CardElement.vue";
import BaseButton from "../BaseButton.vue";

const props = defineProps({
  /** The title of the modal. It will be in the header of the opened modal. */
  title: {
    type: String,
    required: true,
  },
  /** Set to false to prevent the modal from closing when the background is clicked. */
  allowBackgroundClickToClose: {
    type: Boolean,
    required: false,
    default: true,
  },
  /** Set to false to hide the footer. */
  showFooter: {
    type: Boolean,
    required: false,
    default: true,
  },
  /** Set to false to hide the close button in the header. */
  showCloseInHeader: {
    type: Boolean,
    required: false,
    default: true,
  },
  /** Boolean to show or hide the trigger button. */
  showTrigger: {
    type: Boolean,
    required: false,
    default: true,
  },
  /** The text to display on the trigger button. If not set, the title will be used. This prop has no effect if showTrigger is false. */
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
      :data-target="modalId"
      @click="openModal()"
      :aria-busy="isModalOpen"
      type="button"
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
    <card-element :title="title">
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
      <div>
        <slot></slot>
      </div>
      <template #footer v-if="showFooter || $slots.footer">
        <slot name="footer">
          <base-button
            class="secondary"
            :data-target="modalId"
            @click.prevent="closeModal()"
          >
            {{ $t("Cancel") }}
          </base-button>
          <base-button :data-target="modalId" @click.prevent="closeModal()">
            {{ $t("Confirm") }}
          </base-button>
        </slot>
      </template>
    </card-element>
  </dialog>
</template>
