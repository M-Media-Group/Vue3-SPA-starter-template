import { useUserStore } from "@/stores/user";

/** A middleware that checks if the user is authenticated */
export default async () => {
  const { isAuthenticated } = useUserStore();
  if (!isAuthenticated) {
    return {
      name: "login",
    };
  }
};
