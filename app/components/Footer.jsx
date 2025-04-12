import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer(){
  return (
    <div className="bg-gray-900 text-white py-10 rounded-tl-4xl rounded-tr-4xl mx-4">
      <div className="max-w-screen-xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Logo & Socials */}
        <div>
          <img src="./logo-lift-2022-b-png.png" alt="Logo" className="w-32 mb-4" />
          <p className="text-lg font-medium">Follow Us</p>
          <div className="flex space-x-3 mt-3">
            {[
              { icon: <Facebook size={20} />, link: "#" },
              { icon: <Twitter size={20} />, link: "#" },
              { icon: <Linkedin size={20} />, link: "#" },
              { icon: <Instagram size={20} />, link: "#" }
            ].map((social, index) => (
              <a
                key={index}
                href={social.link}
                className="w-10 h-10 flex items-center justify-center border border-white rounded-full hover:bg-white hover:text-gray-900 transition"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <p className="text-lg font-medium">Services</p>
          <ul className="mt-3 space-y-2 text-gray-400">
            {["Product Design", "Business Consulting", "Custom Service", "Brand Identity", "SEO Optimization"].map((service, index) => (
              <li key={index}>{service}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-lg font-medium">Contact</p>
          <p className="mt-3 text-gray-400">Tower 1,1422,4th Floor</p>
          <p className="text-gray-400">HiLite Business Park, Calicut</p>
        </div>

        {/* Newsletter */}
        <div>
          <p className="text-lg font-medium">Join Our Newsletter</p>
          <div className="mt-3 flex border-b border-white pb-2">
            <input
              type="email"
              placeholder="Email Address"
              className="bg-transparent outline-none text-white placeholder-white w-full"
            />
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="max-w-screen-xl mx-auto px-6 mt-8 flex flex-col md:flex-row justify-between text-gray-400 text-sm">
        <p> 2025 SDEC. All Rights Reserved</p>
        <div className="flex space-x-6">
          <p>Setting & Privacy</p>
          <p>FAQs</p>
        </div>
      </div>
    </div>
  );
};
