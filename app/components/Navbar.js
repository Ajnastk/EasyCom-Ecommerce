"use client";
import { useState, useEffect, useCallback } from "react";
import {
  Menu,
  X,
  ShoppingCart,
  Heart,
  Search,
  User,
  ChevronDown,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AuthModal, UserMenu } from "./AuthModal"; // Import the auth components
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import LoginLayout from "./loginLayout";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";

// Move this to the top, outside the component

export default function Navbar() {
  const [click, setClick] = useState(false);
  const [visible, setVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeLink, setActiveLink] = useState("home");
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/" || pathname === "/#";

  // Auth state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { data: session, status } = useSession();
  const user = session?.user;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";
  const router = useRouter();
  const searchParams = useSearchParams();

  const cartItmes = useSelector((store) => store.cart.items);

  useEffect(() => {
    // console.log("Redux store itmes", cartItmes);
  }, [cartItmes]);

  // const {message} = router.query;

  // Main navigation categories
  const NAV_LINKS = [
    {
      name: "Home",
      type: isHomePage ? "scroll" : "link",
      id: "home",
      path: "/",
    },
    {
      name: "Categories",
      type: isHomePage ? "scroll" : "link",
      id: "categories",
      path: "/#categories",
    },
    { name: "All Products", type: "link", id: "products", path: "/products" },
    {
      name: "New Arrivals",
      type: isHomePage ? "scroll" : "link",
      id: "new arrivals",
      path: "/#new arrivals",
    },
    {
      name: "Top Picks",
      type: isHomePage ? "scroll" : "link",
      id: "top picks",
      path: "/#top picks",
    },
    {
      name: "About",
      type: isHomePage ? "scroll" : "link",
      id: "about",
      path: "/#about",
    },
    {
      name: "Contact",
      type: isHomePage ? "scroll" : "link",
      id: "contact",
      path: "/#contact",
    },
  ];
  const navLinks = NAV_LINKS;

  // Handle logout
  const handleLogout = async () => {
    await signOut({ redirect: false });
  };

  const handleClick = () => setClick(!click);
  const toggleSearch = () => setSearchOpen(!searchOpen);
  const openAuthModal = () => setAuthModalOpen(true);
  const closeAuthModal = () => setAuthModalOpen(false);

  // Check any messages from route
  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "openLogin") {
      openAuthModal();
    }
  }, [searchParams]);

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Throttle scroll handler
  const handleScroll = useCallback(() => {
    if (isMobile) {
      setVisible(true);
      return;
    }

    const currentScrollPos = window.scrollY;
    const isVisible = prevScrollPos > currentScrollPos || currentScrollPos < 10;

    if (isVisible !== visible) {
      setVisible(isVisible);
    }
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos, visible, isMobile]);

  useEffect(() => {
    const throttledScroll = throttle(handleScroll, 100);
    window.addEventListener("scroll", throttledScroll);
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  useEffect(() => {
    // Only set up intersection observer on homepage
    if (!isHomePage) return;

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target.id;
          const isTop = window.scrollY < 100;
          setActiveLink(isTop ? "home" : section);
        }
      });
    }, observerOptions);

    // Only observe on homepage
    navLinks.forEach((link) => {
      if (link.type === "scroll") {
        const section = document.getElementById(link.id);
        if (section) observer.observe(section);
      }
    });

    return () => observer.disconnect();
  }, [isHomePage, navLinks]);

  const handleLinkClick = useCallback((linkName) => {
    setActiveLink(linkName);
    setClick(false);
  }, []);

  const scrollToSection = useCallback((id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Add the throttle function that was missing
  function throttle(func, delay) {
    let lastCall = 0;
    return function (...args) {
      const now = new Date().getTime();
      if (now - lastCall < delay) {
        return;
      }
      lastCall = now;
      return func(...args);
    };
  }

  return (
    <div className="w-full fixed top-0 left-0 z-50">
      {/* Top promotional banner */}
      <div className="bg-[#182648] text-white text-center text-sm py-2">
        Free shipping on orders over $50 | 20% OFF with code SUMMER24
      </div>

      <nav
        className={`bg-white text-gray-800 shadow-md transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Top section with logo, search, and icons */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo with link to homepage */}
            <Link href="/" className="text-2xl font-bold mr-8">
              EASYCOM
            </Link>

            {/* Search bar - visible on larger screens */}
            <div className="hidden md:flex flex-grow max-w-xl relative">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="absolute right-3 top-2.5 text-gray-500 hover:text-blue-600">
                <Search size={20} />
              </button>
            </div>

            {/* Action icons - visible on larger screens */}
            <div className="hidden md:flex items-center space-x-6 ml-8">
              {/* User Account / Profile */}
              {user ? (
                <UserMenu user={user} onLogout={handleLogout} />
              ) : (
                <button
                  onClick={openAuthModal}
                  className="flex flex-col items-center text-gray-700 hover:text-blue-600"
                >
                  <LogIn size={22} />
                  <span className="text-xs mt-1">Login</span>
                </button>
              )}

              <button className="flex flex-col items-center text-gray-700 hover:text-blue-600">
                <Heart size={22} />
                <span className="text-xs mt-1">Wishlist</span>
              </button>

              <Link
                href="/cart"
                className="flex flex-col items-center text-gray-700 hover:text-blue-600 relative"
              >
                <ShoppingCart size={22} />
                {cartItmes.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItmes.length}
                  </span>
                )}
                <span className="text-xs mt-1">Cart</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden space-x-4">
              <button onClick={toggleSearch} aria-label="Search">
                <Search size={24} />
              </button>

              {user ? (
                <div
                  style={{
                    position: "relative",
                    width: "50px",
                    height: "50px",
                  }}
                >
                  <Image
                    src="./next.svg"
                    alt="Avatar"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <button onClick={openAuthModal} aria-label="Login">
                  <LogIn size={24} />
                </button>
              )}

              <button className="relative" aria-label="Shopping Cart">
                <ShoppingCart size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleClick}
                aria-label="Toggle Menu"
                aria-expanded={click}
                aria-controls="mobile-menu"
              >
                {click ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile search bar */}
          {searchOpen && (
            <div className="md:hidden pb-4">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Main navigation - desktop */}
          <div className="hidden md:block border-t border-gray-200">
            <ul className="flex justify-center space-x-8 py-3 text-sm font-medium">
              {navLinks.map((item) => {
                const isActive =
                  item.type === "scroll"
                    ? activeLink === item.id
                    : pathname === item.path;

                return (
                  <li key={item.name} className="relative group">
                    {item.type === "scroll" ? (
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(item.id);
                          handleLinkClick(item.id);
                        }}
                        className={`flex items-center transition-colors duration-300 hover:text-blue-600 ${
                          isActive ? "text-blue-600" : ""
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.name}
                        {item.name === "Shop" && (
                          <ChevronDown size={16} className="ml-1" />
                        )}
                      </a>
                    ) : (
                      <Link
                        href={item.path}
                        onClick={() => handleLinkClick(item.id)}
                        className={`flex items-center transition-colors duration-300 hover:text-blue-600 ${
                          isActive ? "text-blue-600" : ""
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {item.name}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {click && (
        <div id="mobile-menu" className="md:hidden bg-white shadow-lg">
          <ul className="py-3">
            {navLinks.map((item) => {
              const isActive =
                item.type === "scroll"
                  ? activeLink === item.id
                  : pathname === item.path;

              return (
                <li
                  key={item.name}
                  className="border-b border-gray-200 last:border-b-0"
                >
                  {item.type === "scroll" ? (
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                        handleLinkClick(item.id);
                      }}
                      className={`block py-3 px-6 text-black ${
                        isActive ? "text-blue-600 font-medium" : ""
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ) : (
                    <Link
                      href={item.path}
                      onClick={() => setClick(false)}
                      className={`block py-3 px-6 text-black ${
                        isActive ? "text-blue-600 font-medium" : ""
                      }`}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              );
            })}
            {/* Additional mobile menu items */}
            <li className="border-b border-gray-200">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-3 px-6 text-black"
                >
                  Sign Out
                </button>
              ) : (
                <button
                  onClick={() => {
                    setAuthModalOpen(true);
                    setClick(false);
                  }}
                  className="block w-full text-left py-3 px-6 text-black"
                >
                  Sign In / Register
                </button>
              )}
            </li>
            <li className="border-b border-gray-200">
              <Link href="#wishlist" className="block py-3 text-black px-6">
                Wishlist
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={closeAuthModal} />
    </div>
  );
}
