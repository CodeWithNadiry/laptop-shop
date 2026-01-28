import { useNavigate } from "react-router-dom";
import { formatPKR } from "../../../../utils/formatter";
import useCartTotalAmount from "../../../../utils/totalAmount";
import styles from "./CartSummary.module.css";
import { closeModal } from "../../../../store/modalSlice";
import { useDispatch } from "react-redux";
const CartSummary = () => {
  const dispatch = useDispatch();
  const subtotal = useCartTotalAmount();
  const navigate = useNavigate();

  function handleCheckout() {
    dispatch(closeModal());
    navigate("/checkout");
  }
  return (
    <div className={styles.summaryContainer}>
      <div className={styles.subtotalRow}>
        <span className={styles.label}>Subtotal</span>
        <span className={styles.amount}>{formatPKR(subtotal)}</span>
      </div>

      <button
        className={styles.checkoutBtn}
        onClick={handleCheckout}
      >
        Check out
      </button>

      <p className={styles.taxNote}>
        Shipping, taxes, and discount codes calculated at checkout.
      </p>
    </div>
  );
};

export default CartSummary;
