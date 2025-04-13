import SlideHero from "./components/SlideHero";
import TopProducts from "./components/TopProducts";
import ProductCategories from "./components/Category";
import Footer from "./components/Footer";
import Testimonial from "./components/Testimonial";
import About from "./components/About";

export default function Home() {
  return (
    <div className="bg-white">
      <SlideHero />
      <ProductCategories/>
      <TopProducts />
      <About/>
      <Testimonial/>
    </div>
  );
}
