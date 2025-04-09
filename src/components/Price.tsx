"use client";

import { ProductType } from "@/Types/types";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { actions as cartActions } from "@/utils/store";
import { toast } from "react-toastify";

const Price = ({ product }: { product: ProductType[number] }) => {
  const [total, setTotal] = useState(product.price);
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState(0);
  const dispatch = useDispatch();

  const selectedTitle = product.options?.[selected]?.title ?? "";

  const options = Array.isArray(product.options) ? product.options : [];

  useEffect(() => {
    setTotal(
      quantity *
        (options.length > 0
          ? product.price + options[selected].additionalPrice
          : product.price)
    );
  }, [quantity, selected, product.price]);

  function addToCart() {
    const payloadProduct = { ...product, quantity, selectedTitle };
    // console.log(payloadProduct);

    dispatch(cartActions.add({ product: payloadProduct }));
    toast.success(`+ ${quantity} ${product.title} added to cart`);
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">${total.toFixed(2)}</h2>
      {/* OPTIONS CONTAINER */}
      <div className="flex gap-4">
        {options.length > 0 &&
          options.map(
            (
              option: { title: string; additionalPrice: number },
              index: number
            ) => (
              <button
                key={option.title}
                className="min-w-[6rem] p-2 ring-1 ring-red-400 rounded-md"
                style={{
                  background: selected === index ? "rgb(248 113 113)" : "white",
                  color: selected === index ? "white" : "red",
                }}
                onClick={() => setSelected(index)}
              >
                {option.title}
              </button>
            )
          )}
      </div>
      {/* QUANTITY AND ADD BUTTON CONTAINER */}
      <div className="flex justify-between items-center">
        {/* QUANTITY */}
        <div className="flex justify-between w-full p-3 ring-1 ring-red-500">
          <span>Quantity</span>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setQuantity((prev) => (prev > 1 ? prev - 1 : 1))}
            >
              {"<"}
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((prev) => (prev < 9 ? prev + 1 : 9))}
            >
              {">"}
            </button>
          </div>
        </div>
        {/* CART BUTTON */}
        <button
          className="uppercase w-56 bg-red-500 text-white p-3 ring-1 ring-red-500"
          onClick={addToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default Price;

// [{"title": "Large", "additionalPrice": 200}, {"title": "Medium", "additionalPrice": 100}, {"title": "Small", "additionalPrice": 50}]
