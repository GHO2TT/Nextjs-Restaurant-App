"use client";

import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/utils/store";

const CartIcon = () => {
  const cartProducts = useSelector((state: RootState) => state.cart.products);
  const quantity = cartProducts.reduce((sum, item) => sum + item.quantity, 0);
  return (
    <div className="flex items-center gap-4">
      <div className="relative w-8 h-8 md:w-5 md:h-5">
        <Image src="/cart.png" alt="" fill />
      </div>
      <span>Cart ({quantity})</span>
    </div>
  );
};

export default CartIcon;
