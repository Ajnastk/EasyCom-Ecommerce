"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AdminSidebar from "../../app/components/admin/Sidebar";
import AdminHeader from "../../app/components/admin/Header";
import { AdminProvider } from "../../context/AdminContext.jsx";
import { AuthModal } from "../components/AuthModal";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(
        // `/?${new URLSearchParams({ message: "openLogin" }).toString()}`
        "/unauthorized"
      );
    } else if (status === "authenticated" && session?.user?.role !== "admin") {
      router.push("/unauthorized");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (status !== "authenticated" || session?.user?.role !== "admin") {
    return null; // or a different loading state
  }

  return (
    <AdminProvider>
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar
          isOpen={sidebarOpen}
          toggle={() => setSidebarOpen(!sidebarOpen)}
        />

        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminProvider>
  );
}
