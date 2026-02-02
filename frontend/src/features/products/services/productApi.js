const BASE_URL = "https://laptop-shop-production.up.railway.app/products";

const handleResponse = async (res) => {
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Something went wrong");
  }

  return data.data; 
};

export const fetchAllProducts = async () => {
  const res = await fetch(`${BASE_URL}`);
  return handleResponse(res);
};

export const fetchProductsByCollection = async (collectionSlug) => {
  const res = await fetch(`${BASE_URL}/collections/${collectionSlug}/products`);
  return handleResponse(res);
};

export const fetchProductBySlug = async (collectionSlug, productSlug) => {
  const res = await fetch(
    `${BASE_URL}/collections/${collectionSlug}/products/${productSlug}`
  );
  return handleResponse(res);
};
