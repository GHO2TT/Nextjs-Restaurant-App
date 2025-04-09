// import Image from "next/image";

// const SuccessPage: React.FC = () => {
//   return (
//     <div className="py-[80px] h-100vh w-full flex justify-center items-center flex-col gap-4">
//       <Image src="/delivery.png" alt="" width={200} height={200} />
//       <p className="font-bold text-orange-500 text-4xl">Order was Successful</p>
//     </div>
//   );
// };

// export default SuccessPage;

// app/success/page.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
// import { CircleCheck } from "lucide-react";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast.error("Invalid session ID");
        router.push("/");
        return;
      }

      try {
        const response = await fetch("/api/verify-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        const data = await response.json();

        if (response.ok) {
          // Redirect to order page
          router.push(`/orders`);
        } else {
          toast.error(data.message || "Payment verification failed");
          router.push("/");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Failed to verify payment");
        router.push("/");
      }
    };

    verifyPayment();
  }, [sessionId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center p-8 bg-white rounded-lg shadow-lg">
        {/* <CircleCheck className="w-16 h-16 text-green-500" /> */}
        <h1 className="text-2xl font-bold text-gray-800">
          Payment Successful!
        </h1>
        <p className="text-gray-600">
          Your order is being processed. Redirecting you to your order
          details...
        </p>
        <div className="w-full h-2 bg-gray-200 rounded-full mt-4">
          <div className="h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
