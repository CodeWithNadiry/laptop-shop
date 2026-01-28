import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AddProduct.module.css";

const AddProduct = () => {
  const [isSale, setIsSale] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target;
    const formData = new FormData(form);

    // Fix boolean values
    formData.set("isSale", isSale);
    formData.set("isFeatured", isFeatured);

    try {
      const res = await fetch("https://backend-production-fccb.up.railway.app/admin/products", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      alert("Product added successfully!");
      form.reset();
      setIsSale(false);
      setIsFeatured(false);
      navigate("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Add Product</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form
        className={styles.form}
        onSubmit={submitHandler}
        encType="multipart/form-data"
      >
        <div className={styles.control}>
          <label>Product Name</label>
          <input type="text" name="name" required />
        </div>

        <div className={styles.control}>
          <label>Description</label>
          <textarea name="description" rows="4" />
        </div>

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
                objectPosition: "center",
                marginTop: "10px",
                borderRadius: "10px",
              }}
            />
          )}
          <input
            type="file"
            name="image"
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
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

        <div className={styles.row}>
          <div className={styles.control}>
            <label>Price</label>
            <input type="number" name="price" min="1" />
          </div>

          {isSale && (
            <div className={styles.control}>
              <label>Regular Price</label>
              <input type="number" name="regularPrice" min="1" />
            </div>
          )}
        </div>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isSale}
            onChange={(e) => setIsSale(e.target.checked)}
          />
          <label>On Sale</label>
        </div>

        <div className={styles.checkbox}>
          <input
            type="checkbox"
            checked={isFeatured}
            onChange={(e) => setIsFeatured(e.target.checked)}
          />
          <label>Featured Product</label>
        </div>

        <div className={styles.control}>
          <label>Collection</label>
          <select name="collection">
            <option value="">Select Collection</option>
            <option value="laptops">Laptops</option>
            <option value="monitors">Monitors</option>
            <option value="workstations">Workstations</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>

        <div className={styles.control}>
          <label>Quality</label>
          <textarea name="quality" rows="3" />
        </div>

        <div className={styles.control}>
          <label>Initial Stock</label>
          <input type="number" name="stock" min="0" />
        </div>

        <button disabled={loading} className={styles.btn}>
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
