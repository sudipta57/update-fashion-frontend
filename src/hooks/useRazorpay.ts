import { useCallback } from "react";
import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  createOrder,
} from "../api-client";

export interface RazorpayOptions {
  amount: number;
  orderDetails?: any;
  onSuccess: () => void;
  onFailure: (error: string) => void;
}

export const useRazorpay = () => {
  const initiatePayment = useCallback(
    async ({ amount, orderDetails, onSuccess, onFailure }: RazorpayOptions) => {
      try {
        // Create Razorpay order
        const razorpayOrder = await createRazorpayOrder(amount);
        console.log("creating razorpay order");

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Update Fashion",
          description: "Order Payment",
          order_id: razorpayOrder.id,
          handler: async function (response: any) {
            try {
              // First, create the order in database with payment details
              const createdOrder = await createOrder({
                ...orderDetails,
                alreadyPaid: true, // Payment already done
                orderStatus: "ORDER CONFIRMED",
              });

              // Then verify payment and update with payment details
              await verifyRazorpayPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: createdOrder._id, // Use the newly created order ID
              });

              onSuccess();
            } catch (error) {
              console.log(error);

              onFailure("Payment verification failed");
            }
          },
          prefill: {
            name: "",
            email: orderDetails?.email || "",
            contact: orderDetails?.phone || "",
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
