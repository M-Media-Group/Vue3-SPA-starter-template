import { useUserStore } from "@/stores/user";

/** A middleware that checks if the user is authenticated */
export default async () => {
  const store = useUserStore();
  const shouldNotVerifyEmail = store.user?.email_verified_at;
  if (shouldNotVerifyEmail) {
    return {
      name: "home",
      setRedirectToIntended: false,
    };
  }
};
