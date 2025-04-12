export default function Footer() {
  return (
    <div className="bg-white py-10">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-3 gap-8">
        {/* Shop Links */}
        <div className="flex flex-col items-center text-gray-600">
          <ul className="space-y-2 text-center">
            <li><a href="#">Shop All</a></li>
            <li><a href="#">Our Story</a></li>
            <li><a href="#">Best Seller</a></li>
            <li><a href="#">Contact</a></li>
          </ul>
        </div>

        {/* Help Links */}
        <div className="flex flex-col items-center text-gray-600">
          <ul className="space-y-2 text-center">
            <li><a href="#">FAQ</a></li>
            <li><a href="#">Return Policy</a></li>
            <li><a href="#">Terms & Condition</a></li>
            <li><a href="#">Shipping & Delivery</a></li>
            <li><a href="#">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Social Links */}
        <div className="flex flex-col items-center text-gray-600">
          <ul className="space-y-2 text-center">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Whatsapp</a></li>
            <li><a href="#">Facebook</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-8 text-sm text-gray-600">
        ©2025 by EASYCOM. Powered and secured by SDEC Digital
      </div>
    </div>
  );
}
