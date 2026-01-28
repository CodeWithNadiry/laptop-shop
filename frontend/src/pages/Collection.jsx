/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useProductContext } from "../context/ProductContext";
import { ProductsList } from "../features/products";

const Collection = () => {
  const { collectionSlug } = useParams();
  const { collectionProducts, fetchProductsByCollection, loading, error } =
    useProductContext();

  useEffect(() => {
    fetchProductsByCollection(collectionSlug);
  }, [collectionSlug]);

  const products = collectionProducts[collectionSlug] || [];

  const selectedProducts = products.filter((p) => !p.isFeatured);
  if (loading) return <h2>Loading...</h2>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <header className="sec-container">
        <p>
          Collections /{" "}
          {collectionSlug.charAt(0).toUpperCase() + collectionSlug.slice(1)}
        </p>
        <p style={{color: '#0277ce'}}>
          {products.length} {products.length > 1 ? "products" : "product"}
        </p>
      </header>

      <main style={{ paddingBlock: "none", marginTop: "-110px" }}>
        <ProductsList products={selectedProducts} />
      </main>
    </div>
  );
};

export default Collection;
