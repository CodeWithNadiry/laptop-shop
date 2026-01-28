import { useProductContext } from "../../../../context/ProductContext";
import FeaturedProductCard from "../featured-product-card/FeaturedProductCard";
import styles from "./FeaturedProducts.module.css";

const FeaturedProducts = () => {
  const { products } = useProductContext();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className={`sec-container ${styles.featuredProducts}`}>
      <h1>Finding the featured AI laptop has never been easier</h1>
      <div className={styles.productsGrid}>
        {featuredProducts.map((product) => (
          <FeaturedProductCard key={product._id} data={product} />
        ))}
      </div>
    </div>
  );
};

export default FeaturedProducts;