import { ref, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useUserStore = defineStore("user", () => {
  // the state of the user
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref(null);
  const attemptedToFetchUser = ref(false);

  const baseUrl = "http://localhost/";

  async function getUser() {
    isLoading.value = true;
    attemptedToFetchUser.value = true;
    try {
      const response = await axios.get(baseUrl + "api/user");
      user.value = response.data;
      isAuthenticated.value = true;
    } catch (error) {
      console.log(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function checkEmail(email: string) {
    // Check if the email is valid
    if (!email) {
      return;
    }

    await getCsrfToken();

    // Check if the email is already in use by calling POST "email-exists/" + email with axios. If it returns 404, the email is not in use.
    try {
      const response = await axios.post(baseUrl + "email-exists/" + email);
      return response.status === 200;
    } catch (error) {
      return false;
    }
  }

  async function login(email: string, password: string) {
    // Check if the email is valid
    if (!email) {
      return false;
    }

    // Check if the password is valid
    if (!password) {
      return false;
    }

    // Check if the email is already in use
    try {
      const response = await axios.post(
        baseUrl + "login",
        {
          email: email,
          password: password,
        },
        {
          // set Accept header
          headers: {
            Accept: "application/json",
          },
          withCredentials: true,
        }
      );
      isAuthenticated.value = true;
      user.value = response.data;
      return true;
    } catch (error) {
      return false;
    }
  }

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

    try {
      // Check if the email is already in use
      await axios.post(baseUrl + "register", {
        email: email,
        password: password,
        password_confirmation: password,
        name: name,
        surname: surname,
      });
      return true;
    } catch (error: any) {
      console.log(error);
      return error.response;
    }
  }

  async function resendEmailConfirmation() {
    if (!user.value) {
      return;
    }
    const response = await fetch(baseUrl + "email/verification-notification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.value.email,
      }),
    });

    return response;
  }

  async function sendPasswordResetEmail(email: string) {
    if (!email) {
      return;
    }

    // Submit a reset password
    const response = await fetch(baseUrl + "forgot-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
      }),
    });

    return response;
  }

  async function getCsrfToken() {
    // Remove XSRF-TOKEN cookie and header
    // axios.defaults.headers.common["X-CSRF-TOKEN"] = "";
    // document.cookie =
    //   "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    await axios.get(baseUrl + "sanctum/csrf-cookie", { withCredentials: true });

    // const response = await fetch(baseUrl + "sanctum/csrf-cookie");
  }

  async function logout() {
    await axios.post(baseUrl + "logout");
    isAuthenticated.value = false;
    user.value = null;
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
    logout,
  };
});
