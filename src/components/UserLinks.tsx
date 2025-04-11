"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "react-toastify";
const UserLinks = () => {
  const { data, status } = useSession();

  const admin = data?.user.isAdmin;
  // get admin
  useEffect(() => {
    if (admin) {
      console.log("Admin user", admin);
      toast.success("Welcome Admin user");
    }
  }, [admin]);
  return status === "authenticated" ? (
    <>
      {admin && <Link href="/add">Add Product</Link>}

      <Link href="/orders">Orders</Link>
      <span className="cursor-pointer" onClick={() => signOut()}>
        Logout
      </span>
    </>
  ) : (
    <Link href="/login">Login</Link>
  );
};
export default UserLinks;
