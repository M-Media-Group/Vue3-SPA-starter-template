import { ref, type Ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "@/types/user";
import $bus, { eventTypes } from "@/eventBus/events";

export const useUserStore = defineStore("user", () => {
  // the state of the user
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref(null) as Ref<User | null>;
  const attemptedToFetchUser = ref(false);

  /**
   * Get the user
   *
   */
  async function getUser() {
    isLoading.value = true;
    try {
      const response = await axios.get("api/user");
      user.value = response.data;
      isAuthenticated.value = true;
      await getCsrfToken();
    } catch (error) {
      console.log(error);
    } finally {
      attemptedToFetchUser.value = true;
      isLoading.value = false;
    }
  }

  /**
   * Check if the email has an account
   *
   * @param {string} email
   * @return {*}
   */
  async function checkEmail(email: string) {
    // Check if the email is valid
    if (!email) {
      return;
    }

    isLoading.value = true;

    await getCsrfToken();

    // Check if the email is already in use by calling POST "email-exists/" + email with axios. If it returns 404, the email is not in use.
    try {
      const response = await axios.post("email-exists/" + email);
      return response.status === 200;
    } catch (error) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Log in the user
   *
   * @param {string} email
   * @param {string} password
   * @return {*}
   */
  async function login(email: string, password: string) {
    // Check if the email is valid
    if (!email) {
      return false;
    }

    // Check if the password is valid
    if (!password) {
      return false;
    }

    isLoading.value = true;

    // Check if the email is already in use
    try {
      await axios.post("login", {
        email: email,
        password: password,
      });
      await getUser();
      $bus.$emit(eventTypes.logged_in);
      return true;
    } catch (error) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Register the user
   *
   * @param {string} email
   * @param {string} password
   * @param {string} name
   * @param {string} surname
   * @return {*}
   */
  async function register(
    email: string,
    password: string,
    name: string,
    surname: string
  ) {
    // Check if the email is valid
    if (!email) {
      return;
    }

    // Check if the password is valid
    if (!password) {
      return;
    }

    // Check if the name is valid
    if (!name) {
      return;
    }

    // Check if the surname is valid
    if (!surname) {
      return;
    }

    isLoading.value = true;

    try {
      // Check if the email is already in use
      await axios.post("register", {
        email: email,
        password: password,
        password_confirmation: password,
        name: name,
        surname: surname,
      });
      await getUser();
      $bus.$emit(eventTypes.registered);
      return true;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Resend a confirm-email email to the user
   *
   * @return {*}
   */
  async function resendEmailConfirmation() {
    if (!user.value) {
      return;
    }
    isLoading.value = true;
    try {
      await axios.post("email/verification-notification", {
        email: user.value.email,
      });
      return true;
    } catch (error) {
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Send a reset-password email/request
   *
   * @param {string} email
   * @return {*}
   */
  async function sendPasswordResetEmail(email: string) {
    if (!email) {
      return false;
    }

    isLoading.value = true;

    // Submit a reset password
    try {
      await axios.post("forgot-password", {
        email: email,
      });
      $bus.$emit(eventTypes.sent_reset_password_email);
      return true;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Attempt to reset a password
   *
   * @param {string} email
   * @param {string} token
   * @param {string} password
   * @return {*}
   */
  async function sendPasswordReset(
    email: string,
    token: string,
    password: string
  ) {
    if (!email) {
      return false;
    }

    if (!token) {
      return false;
    }

    if (!password) {
      return false;
    }

    isLoading.value = true;

    // Submit a reset password
    try {
      await axios.post("reset-password", {
        email: email,
        token: token,
        password: password,
        password_confirmation: password,
      });
      $bus.$emit(eventTypes.reset_password);
      return true;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Confirm the users password
   *
   * @param {string} password
   * @return {*}
   */
  async function confirmPassword(password: string) {
    if (!password) {
      return false;
    }

    isLoading.value = true;

    // Submit a reset password
    try {
      await axios.post("user/confirm-password", {
        password: password,
      });
      $bus.$emit(eventTypes.confirmed_password);
      return true;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Determine if the user should confirm their password.
   *
   * @return {*}
   */
  async function shouldConfirmPassword() {
    isLoading.value = true;
    try {
      const response = await axios.get("user/confirmed-password-status");
      return response.data.confirmed;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get a CSRF cookie from the server
   *
   */
  async function getCsrfToken() {
    await axios.get("sanctum/csrf-cookie");
  }

  /**
   * Logout the user
   *
   */
  async function logout() {
    isLoading.value = true;
    await axios.post("logout");
    isAuthenticated.value = false;
    user.value = null;
    isLoading.value = false;
    $bus.$emit(eventTypes.logged_out);
  }

  /**
   * Get a payment intent
   *
   * @return {*}
   */
  async function getPaymentIntent() {
    try {
      const response = await axios.get("user/payment-intent");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Add a payment method for a user
   *
   * @param {string} paymentMethodId
   * @return {*}
   */
  async function addPaymentMethod(paymentMethodId: string) {
    try {
      await axios.post("/user/payment-methods", {
        payment_method: paymentMethodId,
      });
      $bus.$emit(eventTypes.added_payment_method);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  /**
   * Get the payment methods of the user
   *
   * @return {*}
   */
  async function getPaymentMethods() {
    try {
      const response = await axios.get("/user/payment-methods");
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Update a user's profile
   *
   * @param {string} name
   * @param {string} surname
   * @param {string} email
   * @return {*}
   */
  async function update(name: string, surname: string, email: string) {
    isLoading.value = true;
    try {
      await axios.put("user/profile-information", {
        name: name ?? user.value?.name,
        surname: surname ?? user.value?.surname,
        email: email ?? user.value?.email,
      });
      await getUser();
      $bus.$emit(eventTypes.updated_user);
      return true;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isAuthenticated,
    checkEmail,
    getUser,
    user,
    attemptedToFetchUser,
    isLoading,
    login,
    register,
    resendEmailConfirmation,
    sendPasswordResetEmail,
    sendPasswordReset,
    logout,
    update,
    confirmPassword,
    shouldConfirmPassword,
    getPaymentIntent,
    addPaymentMethod,
    getPaymentMethods,
  };
});
