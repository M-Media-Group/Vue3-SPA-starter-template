import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  // the state of the user
  const isAuthenticated = ref(false);
  const isLoading = ref(false);
  const user = ref(null);
  const attemptedToFetchUser = ref(false);

  async function getUser() {
    isLoading.value = true;
    attemptedToFetchUser.value = true;
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (
      response.ok &&
      response.headers.get("Content-Type")?.includes("application/json")
    ) {
      isAuthenticated.value = true;
      user.value = await response.json();
      console.log(
        "Called response ok",
        response,
        user.value,
        isAuthenticated.value
      );
    }

    isLoading.value = false;
  }

  async function checkEmail(email: string) {
    // Check if the email is valid
    if (!email) {
      return;
    }

    // Check if the email is already in use
    const response = await fetch("/email-exists/" + email, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response;
  }

  return {
    isAuthenticated,
    checkEmail,
    getUser,
    user,
    attemptedToFetchUser,
    isLoading,
  };
});
