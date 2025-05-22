import type { HTMLSupportedInputElement } from "@/composables/useForm";
import { hasProperty } from "@/helpers/hasMethod";

export const setErrorMessageOnElement = (
  element: HTMLSupportedInputElement | HTMLElement,
  customMessage?: string
) => {
  //  Update or create a sibling element with the error message
  let errorElement = element.nextElementSibling as HTMLElement;
  if (!errorElement || !errorElement.classList.contains("error")) {
    errorElement = document.createElement("small");
    element.after(errorElement);
  }

  const isValidCustomMessage =
    customMessage && typeof customMessage === "string" && customMessage !== "";

  if (isValidCustomMessage) {
    errorElement.innerText = customMessage;
  } else if (hasProperty(element, "validationMessage")) {
    errorElement.innerText = element.validationMessage;
  } else {
    errorElement.innerText = "";
  }

  errorElement.classList.add("error");

  element.insertAdjacentElement("afterend", errorElement);
};

export const clearErrorMessageOnElement = (
  element: HTMLSupportedInputElement | HTMLElement
) => {
  // If the element is valid, remove the invalid class
  const errorElement = element.nextElementSibling as HTMLElement;
  if (errorElement && errorElement.classList.contains("error")) {
    errorElement.remove();
  }
};
