const BASE_URL = "/cart";
export async function handleResponse(res) {
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Something went wrong!");
  }

  return { data };
}

export async function addToCart(prodId) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prodId }),
  });
  return handleResponse(res);
}

export async function removeFromCart(prodId) {
  const res = await fetch(`${BASE_URL}/${prodId}`, {
    method: "DELETE",
  });

  return handleResponse(res);
}

export async function clearCart() {
  const res = await fetch(`${BASE_URL}`, {
    method: "DELETE",
  });

  return handleResponse(res);
}
