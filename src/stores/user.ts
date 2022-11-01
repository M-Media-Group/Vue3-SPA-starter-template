import { ref, computed, type Ref } from "vue";
import { defineStore } from "pinia";
import axios from "axios";
import type { User } from "@/types/user";

export const useUserStore = defineStore("user", () => {
  // the state of the user
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref(null) as Ref<User | null>;
  const attemptedToFetchUser = ref(false);

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
      await axios.post(
        "login",
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
      await getUser();
      return true;
    } catch (error) {
      return false;
    } finally {
      isLoading.value = false;
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
      return true;
    } catch (error: any) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

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
      return true;
    } catch (error) {
      return error.response;
    } finally {
      isLoading.value = false;
    }
  }

  async function getCsrfToken() {
    // Remove XSRF-TOKEN cookie and header
    // axios.defaults.headers.common["X-CSRF-TOKEN"] = "";
    // document.cookie =
    //   "XSRF-TOKEN=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    await axios.get("sanctum/csrf-cookie", { withCredentials: true });

    // const response = await fetch("sanctum/csrf-cookie");
  }

  async function logout() {
    isLoading.value = true;
    await axios.post("logout");
    isAuthenticated.value = false;
    user.value = null;
    isLoading.value = false;
  }

  async function update(name: string, surname: string, email: string) {
    isLoading.value = true;
    try {
      await axios.put("user/profile-information", {
        name: name ?? user.value?.name,
        surname: surname ?? user.value?.surname,
        email: email ?? user.value?.email,
      });
      await getUser();
      return true;
    } catch (error) {
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
    logout,
    update,
  };
});
