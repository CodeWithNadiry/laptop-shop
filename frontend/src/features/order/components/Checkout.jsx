import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useCartTotalAmount from "../../../utils/totalAmount";
import { useCartContext } from "../../../context/CartContext";
import { formatPKR } from "../../../utils/formatter";
import styles from "./Checkout.module.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { items, clearCart } = useCartContext(); // get cart items
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const subtotal = useCartTotalAmount();

  const handlePlaceOrder = async () => {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        "https://laptop-shop-production.up.railway.app//orders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            items,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      setMessage("✅ Email sent! Check your inbox.");

      clearCart();
      setTimeout(() => {
        navigate("/orders");
      }, 1000);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h2>Review Cart</h2>
      {items.map((item) => (
        <div key={item._id} className={styles.cartItem}>
          <img
            src={
              item.image
                ? `https://laptop-shop-production.up.railway.app//${item.image}`
                : "/placeholder.png"
            }
            alt={item.name}
            className={styles.itemImage}
          />
          <div className={styles.itemDetails}>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemQuantity}>Qty: {item.quantity}</p>
            <p className={styles.itemPrice}>{formatPKR(item.price)}</p>
          </div>
        </div>
      ))}

      <h3>Confirm Details</h3>
      <p className={styles.subtotal}>Subtotal: {formatPKR(subtotal)}</p>
      <p className={styles.taxesNote}>
        Shipping, taxes, and discounts calculated at checkout.
      </p>

      <h3>Payment Option</h3>
      <p className={styles.paymentOption}>💵 Cash on Delivery</p>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || items.length === 0}
        className={styles.placeOrderBtn}
      >
        {loading ? "Placing Order..." : "Place Order"}
      </button>

      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

export default Checkout;
