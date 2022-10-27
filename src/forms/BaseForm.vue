<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import {
  ref,
  useSlots,
  nextTick,
  onUpdated,
  onMounted,
  type PropType,
} from "vue";

// Prop of submit text
defineProps({
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
});

const slots = useSlots();

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
  if (formIsValid.value) {
    emit("submit");
  }
};

const callActionsOnAllInputs = (
  callback: (element: HTMLInputElement) => void
) => {
  for (const element of formElement.value?.elements ?? []) {
    if (element instanceof HTMLInputElement) {
      callback(element);
    }
  }
};

const setInputErrors = (errors: Record<string, string>) => {
  // For each key in errors, find the input and call setErrorOnInput with the value
  for (const [key, value] of Object.entries(errors)) {
    const input = document.querySelector(
      `input[name=${key}]`
    ) as HTMLInputElement;
    if (input) {
      setErrorOnInput(input, value);
    }
  }
};

const setErrorOnInput = (input: HTMLInputElement, error: string) => {
  //   Use setValidity to set the error message
  input.setCustomValidity(error);

  setErrorMessageOnElement(input);

  // Report the validity
  input.reportValidity();
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

defineExpose({
  checkValidity,
  setInputErrors,
});

onUpdated(async () => {
  await nextTick();
  // resetCustomValidityOnInputs();
  checkValidity();
});

onMounted(() => {
  checkValidity();
  // Focus on the first input
  focusOnFirstInput();
});

const focusOnFirstInput = () => {
  const firstInput = formElement.value?.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
};
</script>

<template>
  <form
    ref="formElement"
    @input="checkValidity"
    @keydown.enter.prevent="submit"
    @submit.prevent="submit"
  >
    <slot></slot>

    <slot name="submit">
      <BaseButton type="submit" :disabled="!formIsValid">
        {{ submitText }}
      </BaseButton>
    </slot>
  </form>
</template>
