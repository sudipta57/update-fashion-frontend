import { useCallback } from "react";
import { createRazorpayOrder, verifyRazorpayPayment } from "../api-client";

interface RazorpayOptions {
  amount: number;
  orderId: string;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

export const useRazorpay = () => {
  const initiatePayment = useCallback(
    async ({ amount, orderId, onSuccess, onFailure }: RazorpayOptions) => {
      try {
        // Create Razorpay order
        const razorpayOrder = await createRazorpayOrder(amount);

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Update Fashion",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              // Verify payment
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId, // MongoDB order ID
              });

              onSuccess();
            } catch (error) {
              onFailure("Payment verification failed");
            }
          },
          prefill: {
            name: "",
            email: "",
            contact: "",
          },
          theme: {
            color: "#ea580c", // Orange color matching your theme
          },
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.on("payment.failed", function (response: any) {
          onFailure(response.error.description);
        });
        razorpay.open();
      } catch (error) {
        onFailure("Failed to initiate payment");
      }
    },
    []
  );

  return { initiatePayment };
};
