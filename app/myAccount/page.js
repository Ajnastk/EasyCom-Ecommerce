"use client";
import { useState, useEffect } from "react";
import {
  Settings,
  User,
  Package,
  CreditCard,
  LogOut,
  Edit,
  Camera,
  MapPin,
  Calendar,
  Phone,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState("profile");
  const router = useRouter();

  if (status === "loading") {
    return <div>Loading ....</div>;
  }

  if (status === "authenticated") {
    router.push("/");
    return null;
  }

  const user = session?.user;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Get values from form
    const fullName = document.getElementById("fullName").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const dob = document.getElementById("dob").value;
    const street = document.getElementById("address").value;
    const city = document.getElementById("city").value;
    const state = document.getElementById("state").value;
    const zip = document.getElementById("zip").value;
    const country = document.getElementById("country").value;

    // Create updated user object
    const updatedUser = {
      name: fullName,
      email: email,
      phone: phone,
      dob: dob,
      address: {
        street: street,
        city: city,
        state: state,
        zip: zip,
        country: country,
      },
    };

    try {
      //Directly update session locally
      update({
        user: {
          ...updatedUser,
        },
      });

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  //   const handleLogout = () => {
  //     localStorage.removeItem("user");
  //     setUser(null);
  // Dispatch event to update navbar
  //     window.dispatchEvent(new Event("userLoggedIn"));
  //     router.push("/");
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="bg-gray-50 min-h-screen pt-24">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page header */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6 mt-6">
            <div className="flex flex-col md:flex-row items-center">
              <div className="relative mb-4 md:mb-0 md:mr-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow">
                  {user.avatar ? (
                    <Image
                      priority
                      fill
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-gray-400" />
                  )}
                </div>
                <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 transition">
                  <Camera size={16} />
                </button>
              </div>
              <div className="text-center md:text-left flex-grow">
                <h1 className="text-2xl font-bold text-gray-800">
                  {user.name}
                </h1>
                <p className="text-gray-500">{user.email}</p>
                <div className="mt-2 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
                  <span className="inline-flex items-center bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    <span className="w-2 h-2 mr-1 bg-green-500 rounded-full"></span>
                    Active Member
                  </span>
                  {user.phone && (
                    <span className="text-sm text-gray-600 flex items-center">
                      <Phone size={14} className="mr-1" /> {user.phone}
                    </span>
                  )}
                  {user.dob && (
                    <span className="text-sm text-gray-600 flex items-center">
                      <Calendar size={14} className="mr-1" /> {user.dob}
                    </span>
                  )}
                </div>
                {user.address && (
                  <div className="mt-2 text-sm text-gray-600">
                    <MapPin size={14} className="inline mr-1" />
                    {user.address.street && user.address.city ? (
                      <>
                        {user.address.street}, {user.address.city}
                        {user.address.state ? `, ${user.address.state}` : ""}
                        {user.address.zip ? ` ${user.address.zip}` : ""}
                        {user.address.country
                          ? `, ${user.address.country}`
                          : ""}
                      </>
                    ) : (
                      <span className="text-gray-400 italic">
                        No address provided
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-auto">
                <button
                  className="flex items-center text-blue-600 hover:text-blue-800 transition"
                  onClick={() => setActiveTab("profile")}
                >
                  <Edit size={16} className="mr-1" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>

          {/* Content area with tabs */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition ${
                      activeTab === "profile"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <User size={18} className="mr-3" />
                    Profile Information
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition ${
                      activeTab === "orders"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Package size={18} className="mr-3" />
                    Order History
                  </button>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition ${
                      activeTab === "payment"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <CreditCard size={18} className="mr-3" />
                    Payment Methods
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full flex items-center px-4 py-3 rounded-md text-sm font-medium transition ${
                      activeTab === "settings"
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Settings size={18} className="mr-3" />
                    Account Settings
                  </button>
                  {/* <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut size={18} className="mr-3" />
                    Sign Out
                  </button> */}
                </nav>
              </div>
            </div>

            {/* Main content area */}
            <div className="lg:w-3/4">
              {activeTab === "profile" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Profile Information
                  </h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="fullName"
                          className="block text-sm font-medium text-black mb-1"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          defaultValue={user.name}
                          className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium text-black mb-1"
                        >
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          defaultValue={user.email}
                          className="w-full px-4 py-2 border text-black border-gray-300 rounded-md bg-gray-50"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-sm font-medium text-black mb-1"
                        >
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          defaultValue={user.phone || ""}
                          className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="dob"
                          className="block text-sm font-medium text-black mb-1"
                        >
                          Date of Birth
                        </label>
                        <input
                          type="date"
                          id="dob"
                          defaultValue={user.dob || ""}
                          className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-black mb-3">
                        Shipping Address
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label
                            htmlFor="address"
                            className="block text-sm font-medium text-black mb-1"
                          >
                            Street Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            defaultValue={user.address?.street || ""}
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-black mb-1"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            defaultValue={user.address?.city || ""}
                            className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-black mb-1"
                          >
                            State/Province
                          </label>
                          <input
                            type="text"
                            id="state"
                            defaultValue={user.address?.state || ""}
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="zip"
                            className="block text-sm font-medium text-black mb-1"
                          >
                            ZIP/Postal Code
                          </label>
                          <input
                            type="text"
                            id="zip"
                            defaultValue={user.address?.zip || ""}
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-black mb-1"
                          >
                            Country
                          </label>
                          <select
                            id="country"
                            defaultValue={
                              user.address?.country || "United States"
                            }
                            className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option>United States</option>
                            <option>Canada</option>
                            <option>United Kingdom</option>
                            <option>Australia</option>
                            <option>Germany</option>
                            <option>India</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Order History
                  </h2>
                  {user.orders && user.orders.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Sample orders */}
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              #ORD-3845
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Apr 20, 2025
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              $126.58
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Delivered
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Details
                              </a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                              #ORD-2947
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Mar 12, 2025
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              $89.99
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                Shipped
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <a
                                href="#"
                                className="text-blue-600 hover:text-blue-800"
                              >
                                View Details
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                        <Package size={32} className="text-gray-400" />
                      </div>

                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        No orders yet
                      </h3>
                      <p className="text-gray-500 mb-4">
                        You haven&apos;t placed any orders yet.
                      </p>
                      <Link
                        href="/products"
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        Start Shopping
                        <svg
                          className="ml-1 w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "payment" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">
                      Payment Methods
                    </h2>
                    <button className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      Add New Card
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 relative hover:border-blue-500 transition">
                      <div className="absolute top-4 right-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Default
                        </span>
                      </div>
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M28 7H4C3.44772 7 3 7.44772 3 8V24C3 24.5523 3.44772 25 4 25H28C28.5523 25 29 24.5523 29 24V8C29 7.44772 28.5523 7 28 7Z"
                                stroke="#4F46E5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3 13H29"
                                stroke="#4F46E5"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Visa ending in 4242
                          </p>
                          <p className="text-xs text-gray-500">Expires 12/25</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="text-sm text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                        <button className="text-sm text-red-600 hover:text-red-800">
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 relative hover:border-blue-500 transition">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 mr-4">
                          <div className="w-12 h-8 bg-gray-100 rounded flex items-center justify-center">
                            <svg
                              className="w-8 h-8"
                              viewBox="0 0 32 32"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M28 7H4C3.44772 7 3 7.44772 3 8V24C3 24.5523 3.44772 25 4 25H28C28.5523 25 29 24.5523 29 24V8C29 7.44772 28.5523 7 28 7Z"
                                stroke="#FF9800"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M3 13H29"
                                stroke="#FF9800"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            Mastercard ending in 5555
                          </p>
                          <p className="text-xs text-gray-500">Expires 08/26</p>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end space-x-3">
                        <button className="text-sm text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                        <button className="text-sm text-red-600 hover:text-red-800">
                          Remove
                        </button>
                        <button className="text-sm text-blue-600 hover:text-blue-800">
                          Set as Default
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Account Settings
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-800 mb-2">
                        Change Password
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
                          >
                            Update Password
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-md font-medium text-gray-800 mb-2">
                        Notification Preferences
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="emailNotifications"
                              name="emailNotifications"
                              type="checkbox"
                              defaultChecked
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="emailNotifications"
                              className="font-medium text-gray-700"
                            >
                              Email Notifications
                            </label>
                            <p className="text-gray-500">
                              Receive emails about order updates and new
                              products
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id="marketingEmails"
                              name="marketingEmails"
                              type="checkbox"
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label
                              htmlFor="marketingEmails"
                              className="font-medium text-gray-700"
                            >
                              Marketing Emails
                            </label>
                            <p className="text-gray-500">
                              Receive promotional offers and special discounts
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <h3 className="text-md font-medium text-red-600 mb-2">
                        Danger Zone
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        Once you delete your account, there is no going back.
                        Please be certain.
                      </p>
                      <button
                        type="button"
                        className="bg-white border border-red-600 text-red-600 hover:bg-red-50 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
