import Hero from "../components/hero/Hero";
import { useProductContext } from "../context/ProductContext";
import NewsLetterSignup from "../features/marketing/components/news-letter/NewsLetterSignup";
import {
  BestSellingProducts,
  FeaturedProducts,
  SpecialProduct,
} from "../features/products";

const Home = () => {
  const { loading, error, products } = useProductContext();

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!products.length) return <p>No products available</p>;

  const laptops = products.filter(
    (p) => p.collection === "laptops" && !p.isFeatured
  );
  const monitors = products.filter(
    (p) => p.collection === "monitors" && !p.isFeatured
  );

  return (
    <div>
      <Hero />
      <FeaturedProducts />

      <BestSellingProducts
        heading="Our best selling laptops"
        shouldScroll={false}
        products={laptops}
        to='collections/laptops'
      />

      <BestSellingProducts
        heading="Our best selling monitors"
        shouldScroll={true}
        products={monitors}
        to='collections/monitors'
      />

      <SpecialProduct
        btnText="Shop Pro now"
        name="Dell Pro Laptops"
        description="Work smarter with a durabile, scalable AI PC Available in a variety of options"
        image="https://www.dellonline.co.za/cdn/shop/files/new-pro-laptop-2_1080x.jpg?v=1757680315"
        quality="Designed for professional grade productivity"
      />
      <SpecialProduct
        btnText="View deals"
        btnText2="Register now"
        name="SMALL BUSINESS MONTH"
        description="Celebrating your drive with exclusive offers of up to 30% off."
        image="https://www.dellonline.co.za/cdn/shop/files/home_banner_background_01_ce21df92-e58d-4dec-82bb-b6ffa099e4e1_1944x.png?v=1623402170"
        fullWidthImg
      />
      <hr style={{ opacity: "0.2" }} />
      <SpecialProduct
        btnText="Shop deals"
        name="Dell Ultrasharp Monitors"
        description="Work smarter with a durabile, scalable AI PC Available in a variety of options"
        image="https://www.dellonline.co.za/cdn/shop/files/dih_02_1080x.png?v=1623066815"
        quality="Designed for professional grade productivity"
      />

      <NewsLetterSignup />
    </div>
  );
};

export default Home;
