"use client";
import { useState, useEffect } from "react";
// import { BellIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAdmin } from "@/context/AdminContext";
import { UserMenu } from "../AuthModal";
import { useSession,signOut } from "next-auth/react";

export default function AdminHeader({ toggleSidebar }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const { addNotification } = useAdmin();

  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  // Fetch notifications (mock data)
  useEffect(() => {
    setNotifications([
      {
        id: 1,
        message: "New order #1234 received",
        time: "2 mins ago",
        read: false,
      },
      {
        id: 2,
        message: "Payment failed for order #1228",
        time: "1 hour ago",
        read: true,
      },
      {
        id: 3,
        message: 'Inventory low for "Premium Headphones"',
        time: "3 hours ago",
        read: true,
      },
    ]);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    addNotification(`Searching for: ${searchQuery}`);
    setSearchQuery("");
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="px-4 py-3 flex items-center justify-between">
        {/* Left Section - Sidebar Toggle & Search */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
          >
            <span className="sr-only">Toggle sidebar</span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <form onSubmit={handleSearch} className="hidden md:block">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" /> */}
              </div>
              <input
                type="text"
                placeholder="Search products, orders..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Right Section - Notifications & Profile */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none relative"
              onClick={() => markAsRead(1)} // Mark latest as read on click
            >
              <span className="sr-only">View notifications</span>
              {/* <BellIcon className="h-6 w-6" /> */}
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="hidden group-hover:block origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-700">
                    Notifications
                  </p>
                </div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <p className="text-sm text-gray-700">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))}
                <div className="px-4 py-2 border-t border-gray-100 text-center">
                  <a
                    href="#"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View all
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Dropdown */}
          <UserMenu user={user} onLogout={handleLogout} />
        </div>
      </div>
    </header>
  );
}
