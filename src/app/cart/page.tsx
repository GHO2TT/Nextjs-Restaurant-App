"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions as cartActions, RootState } from "@/utils/store";

import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Address = {
  home: string;
  cityandstate: string;
  phonenumber: number;
};

export type CartProduct = {
  id: string;
  title: string;
  price: number;
  img?: string;
  selectedTitle: string;
  quantity: number;
  // userEmail: string;
  // Add more fields as needed
};

const CartPage = () => {
  const [address, setAddress] = useState<Address>({
    home: "",
    cityandstate: "",
    phonenumber: 0,
  });

  const cartProducts = useSelector((state: RootState) => state.cart.products);

  const dispatch = useDispatch();
  const router = useRouter();

  const deliveryFee = "FREE";
  const quantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
  const subTotal = cartProducts.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const serviceCost = 0;
  const TOTAL_INCL_VAT = subTotal + serviceCost;

  const { data, status } = useSession();

  const email = data?.user.email;
  console.log(data?.user.email);

  function handleAddress(
    identifier: keyof Address,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const value = e.target.value;
    // console.log(value);

    setAddress((preValue) => ({ ...preValue, [identifier]: value }));
  }
  console.log(address);

  const handleCheckout = async () => {
    if (
      address.home.trim() === "" ||
      address.cityandstate.trim() === "" ||
      address.phonenumber === 0
    ) {
      toast.info("Please enter your address and phone number");
      return;
    }

    if (!cartProducts || cartProducts.length === 0) {
      toast.info("Please add products to the cart");
      return;
    }
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }

    const fulladdress = `${address.home}, ${address.cityandstate}, Phone Number ${address.phonenumber}`;
    console.log(fulladdress);

    try {
      const res = await fetch(`/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          products: cartProducts,
          userEmail: email,
          address: fulladdress,
          status: "Pending Payment",
          price: TOTAL_INCL_VAT,
        }), // Send your cart to the backend
      });
      const orderData = await res.json();
      const orderId = orderData.id;

      if (orderId) {
        try {
          const res = await fetch(`/api/checkout_sessions`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              products: cartProducts,
              orderId: orderId,
              userEmail: email,
            }),
          });
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url; // Redirect to Stripe
          } else {
            toast.error("Something went wrong");
          }
          // toast.success("Done...");
        } catch (err) {
          console.error(err);
          toast.error("Checkout failed");
        }
      } else {
        toast.error("No Order Yet");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create order");
    }
  };

  function removeProduct(id: string) {
    dispatch(cartActions.remove({ id }));
  }

  return (
    <div className="h-full md:h-[calc(100vh-9rem)] flex flex-col text-red-500 lg:flex-row">
      {/* PRODUCTS CONTAINER */}
      <div className="h-1/2 flex flex-col justify-around p-5 overflow-scroll lg:h-full lg:w-2/3 2xl:w-1/2 lg:px-20 xl:px-40 overflow-x-hidden">
        {cartProducts.map((item: CartProduct) => (
          <div key={item.id} className="flex items-center justify-between mb-4">
            {item.img && (
              <Image src={item.img} alt={item.title} width={100} height={100} />
            )}
            <div>
              <h1 className="uppercase text-xl font-bold">{item.title}</h1>
              <span>{item.selectedTitle}</span>
            </div>
            <h2 className="font-bold">
              ${item.price.toFixed(2)}x{item.quantity}
            </h2>
            <span
              className="cursor-pointer"
              onClick={() => {
                toast.success(`Removed Successfully ${item.title}`);
                removeProduct(item.id);
              }}
            >
              X
            </span>
          </div>
        ))}
      </div>

      {/* PAYMENT CONTAINER */}
      <div className="h-1/2 p-4 bg-fuchsia-50 flex flex-col gap-4 justify-center lg:h-full lg:w-1/3 2xl:w-1/2 lg:px-10 xl:px-20 2xl:text-xl 2xl:gap-6 ">
        <div className="flex justify-between">
          <span>Subtotal ({quantity} items)</span>
          <span>${subTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Service Cost</span>
          <span>${serviceCost.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery Cost</span>
          <span className="text-green-500">{deliveryFee}</span>
        </div>
        <hr className="my-2" />
        <div className="flex justify-between">
          <span>TOTAL(INCL. VAT)</span>
          <span className="font-bold">${TOTAL_INCL_VAT.toFixed(2)}</span>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="w-full "
        >
          <input
            type="text"
            placeholder="Home Address"
            className="p-3 w-full rounded-2xl border-amber-400 border-2 mb-1"
            onChange={(e) => handleAddress("home", e)}
          />
          <input
            type="text"
            placeholder="City and State"
            className="p-3 w-full rounded-2xl border-amber-400 border-2 mb-1"
            onChange={(e) => handleAddress("cityandstate", e)}
          />
          <input
            type="text"
            placeholder="Phone Number"
            className="p-3 w-full rounded-2xl border-amber-400 border-2 mb-1"
            onChange={(e) => handleAddress("phonenumber", e)}
          />

          <div className="flex justify-between gap-4 mt-4  ">
            <button
              onClick={handleCheckout}
              className="bg-red-500 text-white p-3 rounded-md w-full self-end"
            >
              CHECKOUT using Stripe
            </button>
            {/* <button
              onClick={handleCheckout}
              className="bg-red-500 text-white p-3 rounded-md w-full self-end"
            >
              CHECKOUT using PayStack
            </button> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CartPage;
