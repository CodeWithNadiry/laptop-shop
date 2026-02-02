/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import styles from "./AdminOrders.module.css";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://laptop-shop-production.up.railway.app/admin/orders", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data.orders);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await fetch(`https://laptop-shop-production.up.railway.app/admin/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      alert("Status updated!");
      fetchOrders(); // refresh UI
    } catch (err) {
      alert("Failed to update status");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!orders.length) return <h3>No orders yet 😔</h3>;

  return (
    <div className={styles.container}>
      <h2>Admin Orders</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Preview</th>
            <th>Items</th>
            <th>Total (Rs.)</th>
            <th>Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => {
            const firstItem = order.items[0];

            return (
              <tr key={order._id}>
                <td data-label="Order ID">{order._id.slice(0, 10)}...</td>

                <td data-label="Customer">{order.user?.name || "Unknown"}</td>

                <td data-label="Preview">
                  <img
                    src={`https://laptop-shop-production.up.railway.app/${firstItem?.image}`}
                    alt={firstItem?.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      borderRadius: "5px",
                    }}
                  />
                </td>

                <td data-label="Items">
                  {order.items.map((item) => (
                    <div key={item.productId}>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                </td>

                <td data-label="Total">Rs {order.totalAmount}</td>

                <td data-label="Date">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td data-label="Status">{order.status}</td>

                <td data-label="Action">
                  <select
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(order._id, e.target.value)
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;