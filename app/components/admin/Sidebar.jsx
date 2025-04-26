"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", href: "/admin", icon: "📊" },
  { name: "Categories", href: "/admin/categories", icon: "🛍️" },
  { name: "Products", href: "/admin/products", icon: "🛍️" },
  { name: "Orders", href: "/admin/orders", icon: "📦" },
  { name: "Customers", href: "/admin/customers", icon: "👥" },
  { name: "Analytics", href: "/admin/analytics", icon: "📈" },
];

export default function AdminSidebar({ isOpen, toggle }) {
  const pathname = usePathname();

  return (
    <aside
      className={`${
        isOpen ? "w-64" : "w-20"
      } bg-gray-800 text-white transition-all duration-300 h-full`}
    >
      <div className="p-4 flex items-center justify-between">
        {isOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button onClick={toggle} className="p-1 rounded-lg hover:bg-gray-700">
          {isOpen ? "◀" : "▶"}
        </button>
      </div>

      <nav className="mt-6">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg hover:bg-gray-700 ${
                  pathname === item.href ? "bg-gray-700" : ""
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {isOpen && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
