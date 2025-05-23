// import { menu } from "@/data";
import { MenuType } from "@/Types/types";

import Link from "next/link";
import React from "react";

const getData = async () => {
  const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    : "http://localhost:3000"; // Fallback for local

  const res = await fetch(`${baseUrl}/api/categories`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed!");
  }

  return res.json();
};

const MenuPage = async () => {
  const menu: MenuType = await getData();
  return (
    <div
      style={{}}
      className="m-4 lg:px-20 xl:px-40 h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] flex flex-col md:flex-row items-center"
    >
      {menu.map((category) => (
        <Link
          href={`/menu/${category.slug}`}
          key={category.id}
          className="w-full h-1/3 bg-cover p-8 md:h-1/2 xl:h-[calc(45vh)] "
          style={{ backgroundImage: `url(${category.img})` }}
        >
          <div className={`text-${category.color} w-1/2`}>
            <h1 className="uppercase font-bold text-xl">{category.title}</h1>
            <p className="text-sm my-8">{category.desc}</p>
            {/* <button
              className={`hidden xl:block 2xl:block bg-${category.color} text-${
                category.color === "black" ? "white" : "red-500"
              } py-2 px-4 rounded-md`}
            >
              Explore
            </button> */}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MenuPage;
