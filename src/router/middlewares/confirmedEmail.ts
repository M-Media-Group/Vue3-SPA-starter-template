import { useUserStore } from "@/stores/user";

/** A middleware that checks if the user is authenticated */
export default async () => {
  const { user } = useUserStore();
  const shouldVerifyEmail = !user?.email_verified_at;
  if (shouldVerifyEmail) {
    return {
      name: "confirm-email",
    };
  }
};
