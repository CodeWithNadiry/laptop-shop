import { useEffect, useState } from "react";
import StatCard from "../stat-card/StatCard";
import styles from "./StatsCards.module.css";

const StatsCards = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        // Fetch products
        const productsRes = await fetch("https://laptop-shop-production.up.railway.app//products");
        const productsData = await productsRes.json();

        const normalProducts = productsData.data.filter((p) => !p.isFeatured);

        const usersRes = await fetch("https://laptop-shop-production.up.railway.app//admin/users", {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        const usersData = await usersRes.json();
        const normalUsers = (usersData.users || []).filter(
          (u) => u.role === "user"
        );
        // Fetch orders (admin)
        const ordersRes = await fetch("https://laptop-shop-production.up.railway.app//admin/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const ordersData = await ordersRes.json();

        const orders = Array.isArray(ordersData.orders)
          ? ordersData.orders
          : [];

        // 4️⃣ Calculate total revenue
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.totalAmount || 0),
          0
        );

        setStats({
          products: normalProducts.length,
          orders: orders.length,
          users: normalUsers.length,
          revenue: totalRevenue,
        });
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  const statsCards = [
    { title: "Total Products", value: stats.products, to: "products" },
    { title: "Total Orders", value: stats.orders, to: "orders" },
    { title: "Total Users", value: stats.users, to: "users" },
    { title: "Total Revenue", value: `Rs $${stats.revenue}`, to: "revenue" },
  ];

  return (
    <div className={styles.grid}>
      {statsCards.map(({ title, value, to }) => (
        <StatCard key={title} title={title} value={value} to={to} />
      ))}
    </div>
  );
};

export default StatsCards;
