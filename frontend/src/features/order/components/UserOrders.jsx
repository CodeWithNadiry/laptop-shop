import { useEffect, useState } from "react";
import styles from "./UserOrders.module.css";
import { formatPKR } from "../../../utils/formatter";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await fetch("https://laptop-shop-production.up.railway.app//orders", {
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch orders");
        setOrders(data.data.orders);
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchOrders();
  }, [token]);

  const downloadInvoice = async (orderId) => {
    try {
      const res = await fetch(
        `https://laptop-shop-production.up.railway.app//orders/${orderId}/invoice`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `invoice-${orderId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className={styles.ordersContainer}>
      <h2>Your Orders</h2>
      {orders.map((order) => (
        <div key={order._id} className={styles.orderCard}>
          <div className={styles.orderHeader}>
            <h3>Order ID: {order._id}</h3>
            <p>{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <p className={styles.totalAmount}>
            Total: {formatPKR(order.totalAmount)}
          </p>
          <p className={styles.orderStatus}>
            Status:{" "}
            <strong className={styles[order.status]}>{order.status}</strong>
          </p>
          <div className={styles.itemsList}>
            {order.items.map((item) => (
              <div key={item.productId} className={styles.item}>
                <img
                  src={
                    item.image
                      ? `https://laptop-shop-production.up.railway.app//${item.image}`
                      : "/placeholder.png"
                  } // item image
                  alt={item.name}
                  className={styles.itemImage}
                />
                <div className={styles.itemDetails}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>Price: {formatPKR(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => downloadInvoice(order._id)}
            className={styles.invoiceLink}
          >
            View / Download Invoice
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserOrders;
