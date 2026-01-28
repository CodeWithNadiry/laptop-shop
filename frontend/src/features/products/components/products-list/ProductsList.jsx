import { useCartContext } from "../../../../context/CartContext";
import ProductCard from "../product-card/ProductCard";
import styles from "./ProductsList.module.css";

const ProductsList = ({ products, variant = "grid" }) => {
  
  const { addItem } = useCartContext();

  return (
    <div
      className={`sec-container ${styles.productsList} ${
        variant === "scroll" ? styles.scroll : styles.grid
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product._id} data={product} onAddToCart={addItem} />
      ))}
    </div>
  );
};

export default ProductsList;