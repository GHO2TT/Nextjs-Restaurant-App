"use client";

import { OrderType } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-toastify";

const OrdersPage = () => {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const router = useRouter();

  const isAdmin = session?.user?.isAdmin;

  console.log("session", session);
  console.log("isAdmin", session?.user?.isAdmin);

  if (status === "unauthenticated") {
    router.push("login");
  }

  const { isLoading, data } = useQuery({
    queryKey: ["orders"],
    queryFn: () => fetch("/api/orders").then((res) => res.json()),
  });

  const mutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      toast.success("The Orders status has been changed");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
  const deleteOrder = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await fetch(`/api/orders/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
    },
    onSuccess: () => {
      toast.success("The Orders has been Deleted");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();

    const form = e.target as HTMLFormElement;

    const input = form.elements[0] as HTMLInputElement;
    const status = input.value;

    console.log(input);
    console.log(status);
    console.log(id);

    mutation.mutate({ id, status });
  }

  if (isLoading) return "Loading...";

  // console.log(data);

  function handleDelete(id: string) {
    // console.log(id);

    deleteOrder.mutate({ id, status: "deleted" });
  }

  return (
    <div className="p-4 lg:px-20 xl:px-40">
      <table className="w-full border-separate border-spacing-3">
        <thead>
          <tr className="text-left">
            <th className="hidden md:block">Order ID</th>
            <th>Date</th>
            <th>Price</th>
            <th className="hidden md:block">Products</th>
            <th>Status</th>
            <th className="hidden md:block">Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item: OrderType[number]) => (
            <tr
              key={item.id}
              className={
                item.status.toUpperCase() === "DELIVERED"
                  ? "text-sm md:text-base"
                  : "text-sm md:text-base bg-red-50"
              }
            >
              <td className="hidden md:block py-6 px-1">{item.id}</td>
              <td className="py-6 px-3">
                {item.createdAt.toString().slice(0, 10)}
              </td>
              <td className="py-6 px-1">{item.price.toFixed(2)}</td>
              <td className="hidden md:block py-6 px-1">
                {item.products.map((item) => {
                  const key = item.title + Math.random();
                  // console.log(key);

                  return <span key={key}>{item.title}, </span>;
                })}
              </td>

              <td className="py-6 px-1">
                {isAdmin ? (
                  <form
                    className="flex items-center justify-center gap-4"
                    onSubmit={(e) => handleSubmit(e, item.id)}
                  >
                    {" "}
                    <input
                      type="text"
                      placeholder={item.status}
                      className="p-2 ring-1 ring-red-100 rounded-md"
                    />
                    <button className="bg-red-500 p-2 rounded-[20px]">
                      edit
                      {/* <Image src="/edit.png" alt="" width={20} height={20} /> */}
                    </button>
                  </form>
                ) : (
                  item.status
                )}
              </td>
              <td className="hidden md:block py-6 px-[80px]">{item.address}</td>
              <td className="py-6 px-1">
                <button
                  onClick={handleDelete.bind(null, item.id)}
                  className="bg-red-400 p-2 rounded-full text-amber-50"
                >
                  <Image src="/trash.png" alt="" width={20} height={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
