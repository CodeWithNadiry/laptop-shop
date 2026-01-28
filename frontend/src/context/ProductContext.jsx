/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

const ProductContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [collectionProducts, setCollectionProducts] = useState({});
  const [singleProduct, setSingleProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE = "https://backend-production-fccb.up.railway.app";

  // All Products
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setProducts(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Products by collection
  const fetchProductsByCollection = async (collectionSlug) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionSlug}/products`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setCollectionProducts(prev => ({ ...prev, [collectionSlug]: data.data }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Single product
  const fetchProductBySlug = async (collectionSlug, productSlug) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/collections/${collectionSlug}/products/${productSlug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSingleProduct(data.data); // FIXED
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        collectionProducts,
        singleProduct,
        loading,
        error,
        fetchProductsByCollection,
        fetchProductBySlug,
        fetchAllProducts
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContextProvider;