/* eslint-disable react-hooks/set-state-in-effect */
import { FiSearch } from "react-icons/fi";
import { RxCross2 } from "react-icons/rx";
import styles from "./Search.module.css";
import { BestSellingProducts } from "../../products";
import { useProductContext } from "../../../context/ProductContext";
import { useState, useEffect } from "react";

const Search = () => {
  const { products } = useProductContext();
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Update filteredProducts whenever query changes
  useEffect(() => {
    if (query.trim() === "") {
      // If no input, show top 6 products
      setFilteredProducts(products.filter((p) => !p.isFeatured).slice(0, 5));
    } else {
      // Filter products by name (case-insensitive)
      const filtered = products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [query, products]);

  return (
    <div className={styles.search}>
      <div className={styles.searchInputBtn}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => setShowSearchResult(true)}
        />
        <button onClick={() => setShowSearchResult(!showSearchResult)}>
          {showSearchResult ? <RxCross2 /> : <FiSearch />}
        </button>
      </div>

      {showSearchResult && filteredProducts.length > 0 && (
        <div className={styles.products}>
          <BestSellingProducts
            products={filteredProducts}
            shouldScroll
            heading={"Top Searched"}
            isSearch
          />
        </div>
      )}
    </div>
  );
};

export default Search;
