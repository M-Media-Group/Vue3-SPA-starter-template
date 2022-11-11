import { useUserStore } from "@/stores/user";

/** A middleware that checks if the user is authenticated */
export default async () => {
  const store = useUserStore();
  // check if the user has a payment method
  const hasPaymentMethod = store.user?.pm_type && store.user?.stripe_id;
  // if not, redirect to the add payment method page
  if (!hasPaymentMethod) {
    return {
      name: "add-payment-method",
    };
  }
};
