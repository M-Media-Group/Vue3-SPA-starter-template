import { useUserStore } from "@/stores/user";

/** A middleware that checks if the user is authenticated */
export default async () => {
  const userStore = useUserStore();
  // check if the user has confirmed their email
  const shouldConfirmPassword = await userStore.shouldConfirmPassword();
  // if not, redirect to the confirm email page
  if (shouldConfirmPassword) {
    return {
      name: "confirm-password",
    };
  }
};
