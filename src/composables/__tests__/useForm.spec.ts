import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import { useForm } from "../useForm";

// Mock manipulateDom.js functions
vi.mock("@/helpers/manipulateDom", () => ({
  setErrorMessageOnElement: vi.fn(),
  clearErrorMessageOnElement: vi.fn(),
}));

// Mock @novulink/helpers/hasMethod
vi.mock("@/helpers/hasMethod", () => ({
  hasMethod: (obj: unknown, method: string) =>
    typeof (obj as Record<string, unknown>)[method] === "function",
}));

describe("useForm", () => {
  let form: HTMLFormElement;
  let input: HTMLInputElement;
  let select: HTMLSelectElement;
  let textarea: HTMLTextAreaElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    form = document.createElement("form");
    input = document.createElement("input");
    input.name = "username";
    select = document.createElement("select");
    select.name = "country";
    textarea = document.createElement("textarea");
    textarea.name = "bio";
    form.appendChild(input);
    form.appendChild(select);
    form.appendChild(textarea);
    document.body.appendChild(form);
  });

  it("should set and clear error on input", () => {
    const { setErrorOnInput, resetCustomValidityOnInput } = useForm(ref(form));
    setErrorOnInput(input, "Error message");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.validationMessage).toBe("Error message");

    resetCustomValidityOnInput(input);
    expect(input.validationMessage).toBe("");
  });

  it("should set and remove success on input", () => {
    const { setSuccessOnInput, removeSuccessOnInput } = useForm(ref(form));
    setSuccessOnInput(input);
    expect(input.getAttribute("aria-invalid")).toBe("false");
    Object.defineProperty(input, "validity", {
      value: { valid: true },
      configurable: true,
    });
    removeSuccessOnInput(input);
    expect(input.hasAttribute("aria-invalid")).toBe(false);
  });

  it.skip("should focus on first input", () => {
    const { focusOnFirstInput } = useForm(ref(form));
    focusOnFirstInput();
    expect(document.activeElement).toBe(input);
  });

  it.skip("should focus on first empty input", () => {
    input.value = "filled";
    select.value = "";
    const { focusOnFirstEmptyInput } = useForm(ref(form));
    focusOnFirstEmptyInput();
    expect(document.activeElement).toBe(select);
  });

  it("should set input errors from object", () => {
    const { setInputErrors } = useForm(ref(form));
    setInputErrors({ username: "Required", country: ["Invalid", "option"] });
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(select.getAttribute("aria-invalid")).toBe("true");
  });

  it("should set form error if no input matches", () => {
    const { setInputErrors } = useForm(ref(form));
    setInputErrors({ notfound: "Error" });
    expect(form.getAttribute("aria-invalid")).toBe("true");
  });

  it("should reset custom validity on all inputs", () => {
    const { resetCustomValidityOnInputs } = useForm(ref(form));
    input.setCustomValidity("err");
    select.setCustomValidity("err");
    textarea.setCustomValidity("err");
    resetCustomValidityOnInputs();
    expect(input.validationMessage).toBe("");
    expect(select.validationMessage).toBe("");
    expect(textarea.validationMessage).toBe("");
  });

  it("should check validity and update formIsValid", () => {
    const formRef = ref(form);
    const { checkValidity, formIsValid } = useForm(formRef);
    input.required = true;
    input.value = "";
    checkValidity();
    expect(formIsValid.value).toBe(false);
    input.value = "test";
    checkValidity();
    expect(formIsValid.value).toBe(true);
  });

  it("should handle input event", () => {
    const formRef = ref(form);
    const { handleInput, formIsValid } = useForm(formRef);
    input.required = true;
    input.value = "";
    handleInput();
    expect(formIsValid.value).toBe(false);
    input.value = "test";
    handleInput();
    expect(formIsValid.value).toBe(true);
  });

  it("should check if element is in focus", () => {
    const { isElementInFocus } = useForm(ref(form));
    input.focus();
    expect(isElementInFocus(input)).toBe(true);
    expect(isElementInFocus(select)).toBe(false);
  });

  it("should set and remove success on all inputs", async () => {
    const { setSuccessOnInputs, removeSuccessOnInputs } = useForm(ref(form));
    setSuccessOnInputs();
    expect(input.getAttribute("aria-invalid")).toBe("false");
    expect(select.getAttribute("aria-invalid")).toBe("false");
    expect(textarea.getAttribute("aria-invalid")).toBe("false");
    removeSuccessOnInputs();
    expect(input.hasAttribute("aria-invalid")).toBe(false);
    expect(select.hasAttribute("aria-invalid")).toBe(false);
    expect(textarea.hasAttribute("aria-invalid")).toBe(false);
  });
});
