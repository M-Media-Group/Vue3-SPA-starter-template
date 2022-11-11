import { useUserStore } from "@/stores/user";

/** A middleware that checks if the user is authenticated */
export default async () => {
  const store = useUserStore();
  await store.isReady;
  if (!store.isAuthenticated) {
    return {
      name: "login",
    };
  }
};
