import { useUserStore } from "@/stores/user";

/** A middleware that checks if the user is authenticated */
export default async () => {
  const { user } = useUserStore();
  // check if the user has a payment method
  const hasPaymentMethod = user?.pm_type && user?.stripe_id;
  // if not, redirect to the add payment method page
  if (!hasPaymentMethod) {
    return {
      name: "add-payment-method",
    };
  }
};
