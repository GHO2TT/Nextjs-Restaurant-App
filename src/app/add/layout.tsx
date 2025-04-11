import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add",
  description: "Best Italian food in Italy",
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-8">
      <main>{children}</main>
    </div>
  );
};

export default Layout;
