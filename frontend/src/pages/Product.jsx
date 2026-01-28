/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useProductContext } from "../context/ProductContext";
import { useCartContext } from "../context/CartContext";
import { formatPKR } from "../utils/formatter";
import styles from "./Product.module.css";
import { HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { closeModal } from "../store/modalSlice";
import { useDispatch } from "react-redux";
const Product = ({ product, isModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addItem, removeItem, updateQuantity, items } = useCartContext();
  const { collectionSlug, productSlug } = useParams();
  const { singleProduct, fetchProductBySlug, loading, error } =
    useProductContext();

  // Use prop if passed, otherwise fetch from URL
  const currentProduct = product || singleProduct;

  useEffect(() => {
    if (!product) {
      fetchProductBySlug(collectionSlug, productSlug);
    }
  }, [collectionSlug, productSlug, product]);

  if (!currentProduct) {
    if (loading) return <h2 className={styles.msg}>Loading product...</h2>;
    if (error)
      return (
        <p className={styles.msg} style={{ color: "red" }}>
          {error}
        </p>
      );
    return <h2 className={styles.msg}>Product not found.</h2>;
  }

  const { _id, name, price, image, sku, category } = currentProduct;

  // check if already in cart
  const cartItem = items.find((item) => item._id === _id);
  const quantity = cartItem ? cartItem.quantity : 0;

  function handleAdd() {
    const result = addItem(currentProduct);
    if (result?.reason === "NOT_AUTH") {
      if (isModal) dispatch(closeModal());
      navigate("/auth/login", {replace: true});
      return;
    }
    if (result?.reason === "ADMIN") {
      alert("Admins cannot add items to cart");
    }
  }

  function handleDecrease() {
    if (quantity > 1) {
      updateQuantity(_id, quantity - 1);
    } else {
      removeItem(_id);
    }
  }

  function handleChange(e) {
    const value = Number(e.target.value);
    if (value < 1) return;
    updateQuantity(_id, value);
  }

  return (
    <div className={styles.pageContainer}>
      {/* Breadcrumb */}
      {!isModal && (
        <nav className={styles.breadcrumb}>
          <Link to="/">Home</Link> /{" "}
          <Link to={`/collections/${collectionSlug}`}>Collections</Link> /{" "}
          {category || "Product"}
        </nav>
      )}

      <div className={styles.mainGrid}>
        {/* LEFT IMAGE SIDE */}
        <div className={styles.leftCol}>
          <div className={styles.imageWrapper}>
            <img
              className={styles.mainImage}
              src={`https://backend-production-fccb.up.railway.app/${image}`}
              alt={name}
            />
          </div>
        </div>

        {/* RIGHT DETAILS */}
        <div className={styles.rightCol}>
          <h1 className={styles.productTitle}>{name}</h1>
          <p className={styles.sku}>SKU: {sku || "N/A"}</p>

          <hr className={styles.divider} />

          <h3 className={styles.priceLabel}>Price</h3>
          <h2 className={styles.priceAmount}>{formatPKR(price)}</h2>
          <p className={styles.taxNote}>
            Tax included. <span>Shipping calculated at checkout.</span>
          </p>

          {/* Quantity Section */}
          <div className={styles.itemQtyPrice}>
            <div className={styles.quantityControls}>
              <button className={styles.qtyBtn} onClick={handleDecrease}>
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

            {/* Show subtotal if item in cart */}
            {quantity > 0 && (
              <h3 style={{ marginLeft: ".75rem" }}>
                {formatPKR(price * quantity)}
              </h3>
            )}
          </div>

          {/* Trust Badges */}
          <div className={styles.trustList}>
            <div className={styles.trustItem}>
              🚚 Free shipping over PKR 1500
            </div>
            <div className={styles.trustItem}>📦 Ready to ship</div>
            <div className={styles.trustItem}>✔️ Warranty available</div>
            <div className={styles.trustItem}>🔒 Secure checkout</div>
          </div>

          {/* Buttons */}
          <div className={styles.buttonGroup}>
            <button className={styles.addToCartBtn} onClick={handleAdd}>
              Add to cart
            </button>
            <button
              className={styles.buyNowBtn}
              onClick={() => {
                if (isModal) dispatch(closeModal());
                navigate("/checkout");
              }}
            >
              Buy it now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
