import { type Ref, ref } from "vue";
import {
  clearErrorMessageOnElement,
  setErrorMessageOnElement,
} from "@/helpers/manipulateDom";
import { hasMethod } from "@/helpers/hasMethod";

const supportedElements = [
  HTMLInputElement,
  HTMLSelectElement,
  HTMLTextAreaElement,
  HTMLFormElement,
  HTMLFieldSetElement,
] as const;

export type HTMLSupportedInputElement =
  (typeof supportedElements)[number] extends new (...args: unknown[]) => infer R
    ? R
    : never;

// A string for all possible HTML supported input elements
const HTMLSupportedInputElementStringForQuerySelector = supportedElements
  .filter(
    (element) => element !== HTMLFormElement && element !== HTMLFieldSetElement
  )
  .map((element) => element.name)
  .join(", ");

const setErrorOnInput = (
  input: HTMLSupportedInputElement | HTMLElement,
  error: string,
  report = true
) => {
  //   Use setValidity to set the error message
  //   First, check if the input has a setCustomValidity method
  input.setAttribute("aria-invalid", "true");

  if (hasMethod(input, "setCustomValidity")) {
    input.setCustomValidity(error);
  }
  if (report && hasMethod(input, "reportValidity")) {
    input.reportValidity();
  }

  setErrorMessageOnElement(input, error);
};

const setSuccessOnInput = (input: HTMLSupportedInputElement | HTMLElement) => {
  input.setAttribute("aria-invalid", "false");
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

const isElementInFocus = (element: HTMLElement) => {
  return document.activeElement === element;
};

const focusOnFirstInput = (formElement: HTMLFormElement) => {
  const firstInput = formElement?.querySelector(
    HTMLSupportedInputElementStringForQuerySelector
  ) as HTMLSupportedInputElement;
  if (firstInput) {
    firstInput.focus();
  }
};

const focusOnFirstEmptyInput = (formElement: HTMLFormElement) => {
  const firstInput = formElement?.querySelectorAll(
    HTMLSupportedInputElementStringForQuerySelector
  ) as NodeListOf<HTMLSupportedInputElement>;
  if (firstInput) {
    for (const element of firstInput) {
      if (element instanceof HTMLFieldSetElement) {
        return;
      }
      if (!element.value) {
        element.focus();
        return;
      }
    }
  }
};

const callActionsOnAllInputs = (
  formElement: HTMLFormElement,
  callback: (element: HTMLSupportedInputElement) => void
) => {
  if (!formElement?.elements) {
    return;
  }
  const elements = formElement.elements;
  for (const element of elements) {
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

const resetCustomValidityOnInputs = (formElement: HTMLFormElement) => {
  callActionsOnAllInputs(formElement, (element) => {
    resetCustomValidityOnInput(element);
  });
};

const checkValidityOnAllInputs = (
  formElement: HTMLFormElement,
  checkEvenWhenFocused = false
) => {
  // For each element in the form, check if it's valid
  callActionsOnAllInputs(formElement, (element) => {
    // If the element is invalid, add the invalid class
    if (
      !element.validity.valid &&
      !element.validity.valueMissing &&
      (checkEvenWhenFocused || !isElementInFocus(element))
    ) {
      setErrorMessageOnElement(element);
    } else {
      clearErrorMessageOnElement(element);
    }
  });
};

const removeSuccessOnInputs = (formElement: HTMLFormElement) => {
  callActionsOnAllInputs(formElement, (element) => {
    removeSuccessOnInput(element);
  });
};

const setSuccessOnInputs = (formElement: HTMLFormElement) => {
  callActionsOnAllInputs(formElement, (element) => {
    setSuccessOnInput(element);
  });
  // After 5 seconds, clear the success state
  setTimeout(() => {
    removeSuccessOnInputs(formElement);
  }, 5000);
};

const setInputErrors = (
  formElement: HTMLFormElement,
  errors?: Record<string, string | string[] | null | object | undefined>
) => {
  // For each key in errors, find the input and call setErrorOnInput with the value
  if (!errors) {
    return;
  }

  let matchedInputsWithErrors = 0;

  for (const [key, value] of Object.entries(errors)) {
    const input = formElement?.elements.namedItem(key) as
      | HTMLSupportedInputElement
      | HTMLElement;
    if (input) {
      matchedInputsWithErrors++;
      // If the value is an array, join it with a space
      let valueToPass = value as string | string[];

      // If the valueToPass is an array, join it with a space
      if (Array.isArray(valueToPass)) {
        valueToPass = valueToPass.join(" ");
      }

      setErrorOnInput(input, valueToPass);
    }
  }

  // If we matched 0 inputs but we have errors, attach a generic error to the form
  if (matchedInputsWithErrors === 0) {
    const formError = Object.values(errors).join(" ");
    setErrorOnInput(formElement, formError);
  }
};

export const useForm = (formElement: Ref<HTMLFormElement | null>) => {
  const formIsValid = ref(false);
  const validateFocusedElement = ref(false);

  const checkValidity = (formElement: HTMLFormElement) => {
    checkValidityOnAllInputs(formElement, validateFocusedElement.value);

    formIsValid.value = formElement?.checkValidity() ?? false;
  };

  const handleInput = () => {
    if (!formElement.value) {
      return;
    }
    resetCustomValidityOnInputs(formElement.value);
    checkValidity(formElement.value);
  };

  return {
    formElement,
    formIsValid,
    setErrorOnInput,
    setInputErrors: (
      errors?: Record<string, string | string[] | null | object | undefined>
    ) =>
      formElement.value ? setInputErrors(formElement.value, errors) : undefined,
    setSuccessOnInputs: () =>
      formElement.value ? setSuccessOnInputs(formElement.value) : undefined,
    setSuccessOnInput,
    removeSuccessOnInputs: () =>
      formElement.value ? removeSuccessOnInputs(formElement.value) : undefined,
    removeSuccessOnInput,
    resetCustomValidityOnInput,
    resetCustomValidityOnInputs: () =>
      formElement.value
        ? resetCustomValidityOnInputs(formElement.value)
        : undefined,
    checkValidity: () =>
      formElement.value ? checkValidity(formElement.value) : undefined,
    handleInput,
    focusOnFirstInput: () =>
      formElement.value ? focusOnFirstInput(formElement.value) : undefined,
    focusOnFirstEmptyInput: () =>
      formElement.value ? focusOnFirstEmptyInput(formElement.value) : undefined,
    isElementInFocus,
    validateFocusedElement,
  };
};
