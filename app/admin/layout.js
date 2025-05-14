"use client";
import { useState } from "react";
import AdminSidebar from "../../app/components/admin/Sidebar";
import AdminHeader from "../../app/components/admin/Header";
import { AdminProvider } from "../../context/AdminContext.jsx";

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
