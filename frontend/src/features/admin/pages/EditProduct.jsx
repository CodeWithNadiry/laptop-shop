import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./EditProduct.module.css";
import { useAuthContext } from "../../../context/AuthContext";

const EditProduct = () => {
  const { token } = useAuthContext();
  const { prodId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [isSale, setIsSale] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  /** 📌 Fetch Product Info */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://laptop-shop-production.up.railway.app//admin/products/${prodId}`,
          { headers: { Authorization: "Bearer " + token } }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        setProduct(data.product);
        setIsSale(data.product.isSale);
        setIsFeatured(data.product.isFeatured);
        // Initially show current product image
        setImagePreview(
          data.product.image && data.product.image.trim() !== ""
            ? `https://laptop-shop-production.up.railway.app//${data.product.image}`
            : null
        );
      } catch (err) {
        setError(err.message);
      }
    };

    fetchProduct();
  }, [prodId, token]);

  /** ✏️ Submit Edited Product */
  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);
    formData.set("isSale", isSale);
    formData.set("isFeatured", isFeatured);

    try {
      const res = await fetch(
        `https://laptop-shop-production.up.railway.app//admin/products/${prodId}`,
        {
          method: "PUT",
          headers: { Authorization: "Bearer " + token },
          body: formData,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** Update preview when a new file is selected */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  if (!product) return <p className={styles.loading}>Loading product...</p>;

  return (
    <div className={styles.container}>
      <h1>Edit Product</h1>
      {error && <p className={styles.error}>{error}</p>}

      <form
        onSubmit={submitHandler}
        encType="multipart/form-data"
        className={styles.form}
      >
        {/* Name */}
        <div className={styles.control}>
          <label>Product Name</label>
          <input type="text" name="name" defaultValue={product.name} required />
        </div>

        {/* Description */}
        <div className={styles.control}>
          <label>Description</label>
          <textarea
            name="description"
            rows="4"
            defaultValue={product.description}
          />
        </div>

        {/* Image Upload */}
        <div className={styles.control}>
          <label>Product Image</label>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
          )}

          <input
            type="file"
            name="image"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          <button
            type="button"
            className={styles.uploadBtn}
            onClick={() => fileInputRef.current.click()}
          >
            {imagePreview ? "Change Image" : "Upload Image"}
          </button>
        </div>

        {/* Prices */}
        <div className={styles.row}>
          <div className={styles.control}>
            <label>Price</label>
            <input type="number" name="price" defaultValue={product.price} />
          </div>

          {isSale && (
            <div className={styles.control}>
              <label>Regular Price</label>
              <input
                type="number"
                name="regularPrice"
                defaultValue={product.regularPrice}
              />
            </div>
          )}
        </div>

        {/* Checkboxes */}
        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isSale}
            onChange={(e) => setIsSale(e.target.checked)}
          />
          On Sale
        </label>

        <label className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          Featured Product
        </label>

        {/* Collection */}
        <div className={styles.control}>
          <label>Collection</label>
          <select name="collection" defaultValue={product.collection}>
            <option value="">Select Collection</option>
            <option value="laptops">Laptops</option>
            <option value="monitors">Monitors</option>
            <option value="workstations">Workstations</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        {/* Quality */}
        <div className={styles.control}>
          <label>Quality</label>
          <textarea name="quality" rows="3" defaultValue={product.quality} />
        </div>

        {/* Stock */}
        <div className={styles.control}>
          <label>Stock</label>
          <input type="number" name="stock" defaultValue={product.stock} />
        </div>

        <button disabled={loading} className={styles.btn}>
          {loading ? "Updating..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
