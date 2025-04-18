import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RAZORPAY_KEY } from "../../../../constant/keys";
import { BadgeEuro, PlugZap } from "lucide-react";
import { CrudServices } from "../../../../Api/CrudServices";
import useAuthUser from "react-auth-kit/hooks/useAuthUser";

const AddCoins = () => {
  const [loading, setLoading] = useState(false);
  const [paymentAmount, setAmountToAdd] = useState(10); // Default to adding 10 coins

  const authUser = useAuthUser();

  const crudServices = new CrudServices();
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Create an order using your service
      const order = await crudServices.createOrder(paymentAmount);
      if (order.error) {
        console.error("Error creating order:", order.error);
        return;
      }
      // Setup Razorpay options
      const options = {
        key: RAZORPAY_KEY, // Razorpay Key ID from Dashboard
        amount: order.data.amount,
        currency: order.data.currency,
        name: "Kamp Buzz",
        description: "Add K-Coins",
        order_id: order.data.id, // Razorpay order ID
        handler: function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;

          // Add coins to user account based on amount paid
          const coins = paymentAmount * 50; // Assuming conversion logic
          console.log(`Add ${coins} coins to user account`);

          // Add coins to the database
          crudServices
            .verifyPayment(
              razorpay_order_id,
              razorpay_payment_id,
              razorpay_signature,
              coins
            )
            .then(() => {
              console.log("Coins successfully added to DB");
              window.location.reload();
            })
            .catch((error) => {
              console.error("Error adding coins to DB", error);
            });
        },
        prefill: {
          name: authUser.name,
          email: authUser.email,
          contact: authUser.phone,
        },
        notes: {
          address: authUser.address,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error("Error processing order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold ">Top Up</h2>
      <Card className="w-[350px]">
        <CardHeader>
          <PlugZap />

          <CardTitle className="m-auto">
            <h2 className="pb-2 text-2xl font-semibold flex items-center">
              Charge with{" "}
              <span style={{ display: "inline-flex", alignItems: "center" }}>
                <BadgeEuro size={30} color="#9333ea" className="mx-1" />
                <span>Coins</span>
              </span>
            </h2>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            min="1"
            max="100"
            value={paymentAmount}
            onChange={(e) => setAmountToAdd(parseInt(e.target.value))}
            className="px-4 py-2 border rounded-md mr-2"
          />
        </CardContent>
        <CardContent className="flex justify-center">
          {[100, 300, 1000].map((value) => (
            <Button
              key={value}
              onClick={() => setAmountToAdd(value)}
              className={`px-4 py-2 mx-1 rounded-full hover:bg-purple-500  ${
                paymentAmount === value ? "bg-purple-600 text-white" : ""
              }`}
            >
              {`₹ ${value}`}
            </Button>
          ))}
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button onClick={handlePayment} className="px-10" disabled={loading}>
            {loading ? "Processing..." : `Add ${paymentAmount * 50} `}
            <BadgeEuro size={20} className="mx-1" />
            {` for ₹${paymentAmount}`}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};

export default AddCoins;
