<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import { type PropType, nextTick, onMounted, onUpdated, ref } from "vue";
import { navIsLoading } from "@/router";

type HTMLSupportedInputElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLFormElement
  | HTMLFieldSetElement;

// Prop of submit text
const props = defineProps({
  /** The text to display on the submit button. */
  submitText: {
    type: String,
    default: "Submit",
  },
  /** The endpoint to submit the form to. */
  endpoint: {
    type: String,
    required: false,
  },
  /** The types of fields that should be cleared if the request fails. By default, these are all inputs of type password. */
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
  autoFocus: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["submit"]);

const formElement = ref<HTMLFormElement>();

const formIsValid = ref(false);

const checkValidity = () => {
  // For each element in the form, check if it's valid
  callActionsOnAllInputs((element) => {
    // If the element is invalid, add the invalid class
    if (
      !element.validity.valid &&
      !element.validity.valueMissing &&
      !isElementInFocus(element)
    ) {
      setErrorMessageOnElement(element);
    } else {
      clearErrorMessageOnElement(element);
    }
  });

  formIsValid.value = formElement.value?.checkValidity() ?? false;
};

const setErrorMessageOnElement = (element: HTMLSupportedInputElement) => {
  //  Update or create a sibling element with the error message
  let errorElement = element.nextElementSibling as HTMLElement;
  if (!errorElement || !errorElement.classList.contains("error")) {
    errorElement = document.createElement("small");
    element.after(errorElement);
  }
  errorElement.innerText = element.validationMessage;
  errorElement.classList.add("error");

  element.insertAdjacentElement("afterend", errorElement);
};

const clearErrorMessageOnElement = (element: HTMLSupportedInputElement) => {
  // If the element is valid, remove the invalid class
  const errorElement = element.nextElementSibling as HTMLElement;
  if (errorElement && errorElement.classList.contains("error")) {
    errorElement.remove();
  }
};

const submit = async () => {
  if (
    formIsValid.value &&
    !props.isLoading &&
    !navIsLoading.value &&
    !props.disabled
  ) {
    // setSuccessOnInputs();
    emit("submit");
  }
};

const callActionsOnAllInputs = (
  callback: (element: HTMLSupportedInputElement) => void
) => {
  if (!formElement.value?.elements) {
    return;
  }
  const elements = formElement.value.elements;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (
      element instanceof HTMLInputElement ||
      element instanceof HTMLSelectElement ||
      element instanceof HTMLTextAreaElement ||
      element instanceof HTMLFormElement ||
      element instanceof HTMLFieldSetElement
    ) {
      callback(element);
    }
  }
};

const setInputErrors = (errors: Record<string, string | string[]>) => {
  // For each key in errors, find the input and call setErrorOnInput with the value
  for (const [key, value] of Object.entries(errors)) {
    const input = formElement.value?.elements.namedItem(
      key
    ) as HTMLSupportedInputElement;
    if (input) {
      // If the value is an array, join it with a space
      let valueToPass = value as string | string[];

      // If the valueToPass is an array, join it with a space
      if (Array.isArray(valueToPass)) {
        valueToPass = valueToPass.join(" ");
      }

      setErrorOnInput(input, valueToPass);
    }
  }
};

const setErrorOnInput = (
  input: HTMLSupportedInputElement,
  error: string,
  report = true
) => {
  //   Use setValidity to set the error message
  input.setCustomValidity(error);
  input.setAttribute("aria-invalid", "true");
  if (report) {
    input.reportValidity();
  }
  setErrorMessageOnElement(input);
};

const setSuccessOnInputs = () => {
  callActionsOnAllInputs((element) => {
    setSuccessOnInput(element);
  });
  // After 5 seconds, clear the success state
  setTimeout(() => {
    removeSuccessOnInputs();
  }, 5000);
};

const setSuccessOnInput = (input: HTMLSupportedInputElement) => {
  input.setAttribute("aria-invalid", "false");
};

const removeSuccessOnInputs = () => {
  callActionsOnAllInputs((element) => {
    removeSuccessOnInput(element);
  });
};

const removeSuccessOnInput = (input: HTMLSupportedInputElement) => {
  if (input.validity.valid) {
    input.removeAttribute("aria-invalid");
  }
};

const resetCustomValidityOnInput = (input: HTMLSupportedInputElement) => {
  input.setCustomValidity("");
  clearErrorMessageOnElement(input);
};

const resetCustomValidityOnInputs = () => {
  // For each element in the form, check if it's valid
  callActionsOnAllInputs((element) => {
    resetCustomValidityOnInput(element);
  });
};

const isElementInFocus = (element: HTMLSupportedInputElement) => {
  return document.activeElement === element;
};

// The updated event happens anytime there is input or the slots change
onUpdated(async () => {
  await nextTick();
  checkValidity();
});

onMounted(() => {
  checkValidity();
  // Focus on the first input if the document is not already focused on something
  if (!document.querySelector(":focus") && props.autoFocus) {
    focusOnFirstInput();
  }
});

const focusOnFirstInput = () => {
  const firstInput = formElement.value?.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
};

const handleInput = () => {
  resetCustomValidityOnInputs();
  checkValidity();
};

defineExpose({
  checkValidity,
  setInputErrors,
  focusOnFirstInput,
  setSuccessOnInputs,
});
</script>

<template>
  <form
    ref="formElement"
    @input="handleInput"
    @keydown.enter.prevent="submit"
    @submit.prevent="submit"
  >
    <!-- @slot This is the default slot for the form. You can use this to add any input or button you want. -->
    <slot></slot>

    <!-- @slot This is the slot for the submit button. You can use this to add a custom submit button or action. -->
    <slot
      name="submit"
      :submitText="submitText"
      :submit="submit"
      :disabled="!formIsValid || disabled || isLoading || navIsLoading"
      :isLoading="isLoading"
    >
      <BaseButton
        v-if="showSubmitButton"
        type="submit"
        :disabled="!formIsValid || disabled || isLoading || navIsLoading"
        :aria-busy="isLoading"
      >
        {{ $t(submitText) }}
      </BaseButton>
    </slot>
  </form>
</template>
