import Notification from "@/components/Notification";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";
import QueryProvider from "@/components/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReduxProvider from "@/components/ReduxStoreProvider";
// import StripeProvider from "@/components/Stripe_Provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Iykes Resturant",
  description: "Best Italian food in Italy",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <StripeProvider> */}
        <ReduxProvider>
          <AuthProvider>
            <QueryProvider>
              <div>
                <Notification />
                <Navbar />
                {children}
                <Footer />
                <ToastContainer
                  position="bottom-right"
                  theme="dark"
                  autoClose={2000}
                />
              </div>
            </QueryProvider>
          </AuthProvider>
        </ReduxProvider>
        {/* </StripeProvider> */}
      </body>
    </html>
  );
}
