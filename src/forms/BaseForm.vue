<script setup lang="ts" generic="T extends unknown">
import BaseButton from "@/components/BaseButton.vue";
import {
  type PropType,
  computed,
  nextTick,
  onMounted,
  onUpdated,
  ref,
  useSlots,
  useTemplateRef,
} from "vue";

import { useForm } from "@/composables/useForm";
import { assertIsUnifiedError } from "@/helpers/errorHandler";

// Prop of submit text
const props = defineProps({
  /** The text to display on the submit button. */
  submitText: {
    type: String,
    default: "Submit",
  },
  /** The types of fields that should be cleared if the request fails. By default, these are all inputs of type password. @TODO not yet implemented */
  clearInputTypesOnFailure: {
    type: Array as PropType<string[]>,
    default: () => ["password"],
  },
  /** Whether the form is disabled or not. If true, the form will not submit. */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** Whether the form is loading or not. If true, the form will not submit. */
  isLoading: {
    type: Boolean,
    default: false,
  },
  /** Whether the submit button should be shown or not. */
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
  /** Whether the form should autofocus on the first input or not. */
  autofocus: {
    type: Boolean,
    default: true,
  },
  /** The CSS classes to apply to the submit button. Null should theoretically render no class, but there's a known Vue3 issue @see https://github.com/vuejs/core/issues/3173 */
  submitButtonClasses: {
    type: Array as PropType<string[] | null>,
    default: null,
  },

  /** IF the form should display inline. Useful for single-input forms */
  inline: {
    type: Boolean,
    default: false,
  },

  // We can pass an ASYNC function to the submit function. This is useful for when we want to do something before the form is submitted.
  submitFn: {
    type: Function as PropType<() => Promise<T>>,
    required: false,
    default: null,
  },

  /** Whether the form should validate the focused element or not. */
  enableValidateFocusedElement: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (e: "success", response: T): void;
  (e: "submit"): void;
}>();

const formElement = useTemplateRef("formElement");

const {
  formIsValid,
  checkValidity,
  setInputErrors,
  focusOnFirstInput,
  focusOnFirstEmptyInput,
  setSuccessOnInputs,
  handleInput,
  validateFocusedElement,
} = useForm(formElement);

const loading = ref(false);

const slots = useSlots();

const submit = async () => {
  if (
    formIsValid.value &&
    !props.isLoading &&
    !loading.value &&
    !props.disabled
  ) {
    if (props.submitFn) {
      loading.value = true;
      try {
        const response = await props.submitFn();
        emit("success", response);
        setSuccessOnInputs();
      } catch (error) {
        try {
          assertIsUnifiedError(error);
        } catch (e) {
          console.error(
            "Error is not a UnifiedError",
            e,
            "its type is",
            typeof error
          );
          alert("An error occurred");
          return;
        }

        if (error.type === "validation") {
          setSuccessOnInputs();
          setInputErrors(error.details);
        } else {
          alert(error.message);
        }
      } finally {
        loading.value = false;
      }
    } else {
      emit("submit");
    }
  }
};

validateFocusedElement.value = props.enableValidateFocusedElement;

// The updated event happens anytime there is input or the slots change
onUpdated(async () => {
  await nextTick();
  checkValidity();
});

onMounted(() => {
  checkValidity();
  // Focus on the first input if the document is not already focused on something
  if (!document.querySelector(":focus") && props.autofocus) {
    focusOnFirstEmptyInput();
  }
});

const isAnythingLoading = computed(() => {
  return props.isLoading || loading.value;
});

defineExpose({
  checkValidity,
  setInputErrors,
  focusOnFirstInput,
  focusOnFirstEmptyInput,
  setSuccessOnInputs,
  submit,
});

const hasSubmitSlot = computed(() => {
  return !!slots.submit;
});
</script>

<template>
  <form
    ref="formElement"
    @input="handleInput"
    @keydown.enter.prevent="hasSubmitSlot ? emit('submit') : submit()"
    @submit.prevent="hasSubmitSlot ? emit('submit') : submit()"
  >
    <component
      :is="inline ? 'fieldset' : 'div'"
      :role="inline ? 'group' : null"
    >
      <!-- @slot This is the default slot for the form. You can use this to add any input or button you want. -->
      <slot />

      <!-- @slot This is the slot for the submit button. You can use this to add a custom submit button or action. -->
      <slot
        name="submit"
        :submit-text="submitText"
        :submit="submit"
        :disabled="!formIsValid || disabled || isAnythingLoading"
        :is-loading="isAnythingLoading"
      >
        <base-button
          v-if="showSubmitButton"
          type="submit"
          :disabled="!formIsValid || disabled || isAnythingLoading"
          :aria-busy="isAnythingLoading"
          :class="// We need to merge both { fit: !inline } and submitButtonClasses
          [{ fit: inline }, submitButtonClasses]"
        >
          {{ $t(submitText) }}
        </base-button>
      </slot>
    </component>
    <!-- @slot This is the slot for after the submit. This is useful for back buttons or other actions. -->
    <slot name="after-submit" />
  </form>
</template>
