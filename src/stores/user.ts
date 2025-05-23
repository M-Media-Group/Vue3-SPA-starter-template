import { ref } from "vue";
import { defineStore } from "pinia";
import type { PersonalAccessToken, User } from "@/types/user";
import { useEventsBus } from "@/eventBus/events";
import { apiService } from "@/services/apiService";

export const useUserStore = defineStore("user", () => {
  // the state of the user
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref<User | null>(null);
  const attemptedToFetchUser = ref(false);

  const $bus = useEventsBus();
  // A promise that returns true when isLoading is false and attemptedToFetchUser is true
  const isReady = new Promise((resolve) => {
    const interval = setInterval(() => {
      if (attemptedToFetchUser.value && !isLoading.value) {
        clearInterval(interval);
        resolve(true);
      }
    }, 10);
  }).then(() => {
    return true;
  });

  // The userEmail is meant for keeping email state across auth pages, for example when going from login to forgot-password page
  const userEmail = ref<string | null>(null);

  /**
   * Get the user
   *
   */
  async function getUser() {
    isLoading.value = true;
    try {
      const response = await apiService.get<User>("api/user");
      user.value = response;
      isAuthenticated.value = true;
      await apiService.getCsrfToken();
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

    await apiService.getCsrfToken().catch((e) => {
      console.error("CSRF cookie fetching error", e);
    });

    // Check if the email is already in use by calling POST "email-exists/" + email with apiService. If it returns 404, the email is not in use.
    try {
      await apiService.post("email-exists/" + email);
      return true;
    } catch (error: any) {
      if (error.response.status === 404) {
        return false;
      }
      return error.response;
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
      await apiService.post("login", {
        email: email,
        password: password,
      });
      await getUser();
      $bus.$emit("logged_in");
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
      await apiService.post("register", {
        email: email,
        password: password,
        password_confirmation: password,
        name: name,
        surname: surname,
      });
      await getUser();
      $bus.$emit("registered");
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
      await apiService.post("email/verification-notification", {
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
      await apiService.post("forgot-password", {
        email: email,
      });
      $bus.$emit("sent_reset_password_email");
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
      await apiService.post("reset-password", {
        email: email,
        token: token,
        password: password,
        password_confirmation: password,
      });
      $bus.$emit("reset_password");
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
      await apiService.post("user/confirm-password", {
        password: password,
      });
      $bus.$emit("confirmed_password");
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
      const response = await apiService.get<{ confirmed: boolean }>(
        "user/confirmed-password-status"
      );
      return !response.confirmed;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Logout the user
   *
   */
  async function logout() {
    isLoading.value = true;
    await apiService.post("logout");
    isAuthenticated.value = false;
    user.value = null;
    isLoading.value = false;
    $bus.$emit("logged_out");
  }

  /**
   * Get a payment intent
   *
   * @return {*}
   */
  async function getPaymentIntent() {
    try {
      const response = await apiService.get<{ client_secret: string }>(
        "user/payment-intent"
      );
      return response;
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
      await apiService.post("/user/payment-methods", {
        payment_method: paymentMethodId,
      });
      $bus.$emit("added_payment_method");
      await getUser();
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
      const response = await apiService.get("/user/payment-methods");
      return response;
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
      await apiService.put("user/profile-information", {
        name: name ?? user.value?.name,
        surname: surname ?? user.value?.surname,
        email: email ?? user.value?.email,
      });
      await getUser();
      $bus.$emit("updated_user");
      return true;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Get all the users personal access tokens
   *
   * @return {*}
   */
  async function getPersonalAccessTokens(): Promise<PersonalAccessToken[]> {
    return apiService
      .get<PersonalAccessToken[]>("/user/personal-access-tokens")
      .then((response) => {
        if (!user.value) {
          return [];
        }
        // If the response is not one containing an array of personal access tokens, return an empty array. For example, the endpoint might return HTML instead of JSON.
        if (
          !Array.isArray(response) ||
          response.length === 0 ||
          !response[0].id
        ) {
          throw new Error(
            "Invalid response while fetching personal access tokens."
          );
        }

        user.value.personal_access_tokens = response;
        return response;
      })
      .catch((error) => {
        console.log("Personal access tokens error", error);
        return [];
      });
  }

  /**
   * Create a personal access token for the user
   *
   * @param {string} name
   */
  async function createPersonalAccessToken(
    name: string
  ): Promise<{ token: string } | void> {
    return apiService
      .post<{ token: string }>("/user/personal-access-tokens", {
        name: name,
      })
      .then((response) => {
        $bus.$emit("created_personal_access_token");
        return response;
      })
      .catch((error) => {
        console.log("Personal access tokens error", error);
        alert(error.response.data.message);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  async function deletePersonalAccessToken(id: string) {
    return apiService
      .delete("/user/personal-access-tokens/" + id)
      .then((response) => {
        $bus.$emit("deleted_personal_access_token");
        return response;
      })
      .catch((error) => {
        console.log("Personal access tokens error", error);
        alert(error.response.data.message);
      })
      .finally(() => {
        isLoading.value = false;
      });
  }

  return {
    isAuthenticated,
    checkEmail,
    getUser,
    user,
    userEmail,
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
    isReady,
    getPersonalAccessTokens,
    createPersonalAccessToken,
    deletePersonalAccessToken,
  };
});
