// app/unauthorized/page.jsx
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
      <p>You don&apos;t have permission to access this page.</p>
      <Link href="/" className="mt-4 text-blue-500 hover:underline">
        Return to Home
      </Link>
    </div>
  );
}