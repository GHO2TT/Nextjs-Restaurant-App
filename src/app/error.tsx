"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="p-10 bg-white">
      <h2 className="text-2xl font-bold text-red-600">Error Details:</h2>
      <pre className="mt-4 p-4 bg-gray-100 overflow-auto">
        {JSON.stringify(
          {
            message: error.message,
            digest: error.digest,
            stack: error.stack,
          },
          null,
          2
        )}
      </pre>
      <button
        onClick={reset}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Try Again
      </button>
    </div>
  );
}
