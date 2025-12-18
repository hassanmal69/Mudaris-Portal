// src/pages/errorPage/index.jsx
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-semibold">Application Error</h1>
        <p className="mt-4 text-gray-600">
          {error?.message || "Unexpected error occurred"}
        </p>
      </div>
    </div>
  );
}
