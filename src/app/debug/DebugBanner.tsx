"use client";

export default function DebugBanner() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-2 z-50 text-center">
      DEBUG MODE - Errors will be visible
    </div>
  );
}
