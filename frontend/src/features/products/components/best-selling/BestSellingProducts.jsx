import ProductsList from "../products-list/ProductsList";
import styles from "./BestSellingProducts.module.css";
import { Link } from "react-router-dom";

const BestSellingProducts = ({ heading, shouldScroll, products, to, isSearch }) => {
  const selectedProducts = products.slice(0, 10);
  return (
    <section className={styles.bestSellingWrapper}>
      <div className={styles.content}>
        <h1>{heading}</h1>
        {!isSearch && <Link to={to}>View all</Link>}
      </div>

      <ProductsList
        products={selectedProducts}
        variant={shouldScroll ? "scroll" : "grid"}
      />
    </section>
  );
};

export default BestSellingProducts;