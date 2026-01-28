import { useCartContext } from "../context/CartContext";
function useCartTotalAmount() {
  const { items } = useCartContext();
  const totalAmount = items.reduce(
    (totalPrice, item) => totalPrice + (item.quantity * item.price),
    0
  );

  return totalAmount;
}

export default useCartTotalAmount;
