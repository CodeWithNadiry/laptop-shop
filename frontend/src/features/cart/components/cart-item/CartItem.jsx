import { useCartContext } from "../../../../context/CartContext";
import { formatPKR } from "../../../../utils/formatter";
import styles from "./CartItem.module.css";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi2";

const CartItem = ({ item }) => {
  const { addItem, removeItem, updateQuantity } = useCartContext();
  const { _id, image, name, quantity, price } = item;

  const handleChange = (e) => {
    const value = Number(e.target.value);
    if (value < 1) return;
    updateQuantity(_id, value);
  };

  const handleAdd = () => {
    const result = addItem(item); // CartContext addItem now returns { ok, reason }

    if (result && !result.ok) {
      if (result.reason === "NOT_AUTH") {
        // handle redirect from parent or context
        console.log("User not logged in, redirect to login.");
      }
      if (result.reason === "ADMIN") {
        alert("Admins cannot add items to cart");
      }
    }
  };

  return (
    <div className={styles.cartItem}>
      <div className={styles.cartImage}>
        <img
          src={image ? `https://laptop-shop-production.up.railway.app/${image}` : "/placeholder.png"}
          alt={name}
        />
      </div>

      <div className={styles.cartContent}>
        <h2>{name}</h2>

        <div className={styles.itemQtyPrice}>
          <div className={styles.quantityControls}>
            <button className={styles.qtyBtn} onClick={() => removeItem(_id)}>
              <HiOutlineMinus />
            </button>

            <input
              type="number"
              min="1"
              className={styles.qtyValue}
              value={quantity}
              onChange={handleChange}
            />

            <button className={styles.qtyBtn} onClick={handleAdd}>
              <HiOutlinePlus />
            </button>
          </div>

          <div className={styles.priceContainer}>
            <h3> {formatPKR(price * quantity)}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
