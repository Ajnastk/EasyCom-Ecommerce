import Image from "next/image";
const About = () => {
  return (
    <div id="about" className="bg-[#1a2649]">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <h2 className="text-4xl text-white mb-12">
          About <span className="font-light">EASYCOM</span>
        </h2>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="rounded-lg overflow-hidden">
            <Image
              src="/jewelry-image.jpg" // Replace with your actual image path
              alt="ABOUTUS img"
              className="w-full h-auto rounded-lg"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>

          {/* Text Content */}
          <div className="text-white space-y-6">
            <p className="text-lg">
              EasyCom is an online store designed to make shopping simple and
              convenient for everyone. At EasyCom, customers can explore a wide
              range of products—from stylish clothes and accessories to everyday
              essentials—all from the comfort of their homes. With a
              user-friendly website and secure payment options, EasyCom ensures
              a smooth shopping experience. Fast delivery, reliable customer
              support, and quality products are what make EasyCom a trusted
              choice for online shoppers. Whether you’re looking for something
              trendy or something useful, EasyCom has it all in one place.{" "}
            </p>

            <p className="text-lg">
              EasyCom is your go-to online store for stylish and affordable
              products. We offer a smooth shopping experience with fast delivery
              and secure payments. From fashion to daily essentials, everything
              is just a click away. Shop smart, shop easy — only at EasyCom!
            </p>

            <button className="mt-6 px-6 py-2 border border-white text-white hover:bg-white hover:text-[#1a2649] transition-colors duration-300 inline-flex items-center group">
              Learn more
              <svg
                className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Features Section - Full Width White Background */}
      <div className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center text-[#1a2649]">
              <h3 className="text-xl font-semibold mb-2">All India Delivery</h3>
            </div>
            <div className="text-center text-[#1a2649]">
              <h3 className="text-xl font-semibold mb-2">Affordable Price</h3>
            </div>
            <div className="text-center text-[#1a2649]">
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
