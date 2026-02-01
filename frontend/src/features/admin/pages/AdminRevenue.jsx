import { useEffect, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import styles from "./AdminRevenue.module.css";

const AdminRevenue = () => {
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const { token } = useAuthContext();

  useEffect(() => {
    async function fetchRevenue() {
      const res = await fetch("https://laptop-shop-production.up.railway.app//admin/orders", {
        headers: { Authorization: "Bearer " + token }
      });

      const data = await res.json();
      const list = data.data || data.orders || [];

      setOrders(list);
      const sum = list.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
      setTotal(sum);
    }

    fetchRevenue();
  }, [token]);

  return (
    <div className={styles.container}>
      <h2>Total Revenue</h2>
      <h1 className={styles.amount}>Rs {total}</h1>

      <h3>Revenue From Orders</h3>
      <div className={styles.list}>
        {orders.map(o => (
          <div key={o._id} className={styles.card}>
            <span>Order: #{o._id.slice(-5)}</span>
            <span>Rs {o.totalAmount}</span>
            <span>{new Date(o.createdAt).toLocaleDateString()}</span>
          </div>
        ))}

        {orders.length === 0 && <p>No revenue yet 📉</p>}
      </div>
    </div>
  );
};

export default AdminRevenue;
