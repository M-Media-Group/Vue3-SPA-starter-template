<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import { type PropType, nextTick, onMounted, onUpdated, ref } from "vue";
import { navIsLoading } from "@/router";

// Prop of submit text
const props = defineProps({
  submitText: {
    type: String,
    default: "Submit",
  },
  endpoint: {
    type: String,
    required: false,
  },
  clearInputTypesOnFailure: {
    type: Array as PropType<string[]>,
    default: () => ["password"],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  showSubmitButton: {
    type: Boolean,
    default: true,
  },
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

const setErrorMessageOnElement = (element: HTMLInputElement) => {
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

const clearErrorMessageOnElement = (element: HTMLInputElement) => {
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
  callback: (element: HTMLInputElement) => void
) => {
  if (!formElement.value?.elements) {
    return;
  }
  const elements = formElement.value.elements;
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element instanceof HTMLInputElement) {
      callback(element);
    }
  }
};

const setInputErrors = (errors: Record<string, string | string[]>) => {
  // For each key in errors, find the input and call setErrorOnInput with the value
  for (const [key, value] of Object.entries(errors)) {
    const input = formElement.value?.elements.namedItem(
      key
    ) as HTMLInputElement;
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
  input: HTMLInputElement,
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

const setSuccessOnInput = (input: HTMLInputElement) => {
  input.setAttribute("aria-invalid", "false");
};

const removeSuccessOnInputs = () => {
  callActionsOnAllInputs((element) => {
    removeSuccessOnInput(element);
  });
};

const removeSuccessOnInput = (input: HTMLInputElement) => {
  if (input.validity.valid) {
    input.removeAttribute("aria-invalid");
  }
};

const resetCustomValidityOnInput = (input: HTMLInputElement) => {
  input.setCustomValidity("");
  clearErrorMessageOnElement(input);
};

const resetCustomValidityOnInputs = () => {
  // For each element in the form, check if it's valid
  callActionsOnAllInputs((element) => {
    resetCustomValidityOnInput(element);
  });
};

const isElementInFocus = (element: HTMLInputElement) => {
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
    <slot></slot>

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
