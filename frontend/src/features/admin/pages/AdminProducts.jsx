/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useProductContext } from "../../../context/ProductContext";
import { useAuthContext } from "../../../context/AuthContext";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import styles from "./AdminProducts.module.css";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const { products, loading, fetchAllProducts } = useProductContext();
  const { token } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
  }, []);

  async function deleteProduct(id) {
    if (!confirm("Are you sure? This action cannot be undone.")) return;

    const res = await fetch(`https://laptop-shop-production.up.railway.app//admin/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    res.ok
      ? fetchAllProducts()
      : alert("❌ Failed to delete product. Try again.");
  }

  if (loading) return <p className={styles.loading}>Loading products...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <h2>📦 Manage Products</h2>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/products/add")}
        >
          <FaPlus />
          <span className={styles.addText}>Add Product</span>
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products && products.filter((p) => !p.isFeatured).length > 0 ? (
              products
                .filter((p) => !p.isFeatured)
                .map((p) => (
                  <tr key={p._id}>
                    <td data-label="Image">
                      <img
                        src={`https://laptop-shop-production.up.railway.app//${p.image}`}
                        alt={p.name}
                        className={styles.image}
                      />
                    </td>
                    <td data-label="Product" className={styles.productName}>
                      {p.name}
                    </td>
                    <td data-label="Stock">{p.stock}</td>
                    <td data-label="Price">Rs {p.price}</td>
                    <td data-label="Actions" className={styles.actions}>
                      <button
                        className={styles.editBtn}
                        onClick={() =>
                          navigate(`/admin/products/edit/${p._id}`)
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => deleteProduct(p._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  style={{ textAlign: "left", padding: "1rem" }}
                >
                  No products yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;
