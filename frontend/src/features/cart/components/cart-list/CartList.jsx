import { useCartContext } from "../../../../context/CartContext";
import CartItem from "../cart-item/CartItem";
import CartSummary from "../cart-summary/CartSummary";
import styles from "./CartList.module.css";
const CartList = () => {
  const { items } = useCartContext();

  if (items.length === 0) {
    return <div className={styles.cartList}>Your cart is empty.</div>;
  }
  return (
    <div className={styles.cartList}>
      <div className={styles.itemsContainer}>
        {items.map((item) => (
          <CartItem key={item.name} item={item} />
        ))}
      </div>
      <CartSummary items={items} />
    </div>
  );
};

export default CartList;
