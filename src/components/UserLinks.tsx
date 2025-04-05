"use client";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
const UserLinks = () => {
  const { status } = useSession();
  return status === "authenticated" ? (
    <>
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
