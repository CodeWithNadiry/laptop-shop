export async function createStripeSession() {
  const res = await fetch("/orders/create-checkout-session", {
    method: "POST",
  });
  return res.json();
}