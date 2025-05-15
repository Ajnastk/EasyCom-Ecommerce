import SlideHero from "./components/SlideHero";
import ShowFiltredProducts from "./components/ShowFiltredProducts";
import ProductCategories from "./components/Category";
import Footer from "./components/Footer";
import Testimonial from "./components/Testimonial";
import About from "./components/About";

export default function Home() {
  return (
    <div className="bg-white">
      <SlideHero />
      <ProductCategories />
      <ShowFiltredProducts productType={"isNew"} />
      <ShowFiltredProducts productType={"isTop"} />
      <About />
      <Testimonial />
      {/* <Footer/> */}
    </div>
  );
}
