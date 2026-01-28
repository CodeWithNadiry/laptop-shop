import { useDispatch, useSelector } from "react-redux";
import Modal from "../components/ui/modal/Modal";
import CartList from "../features/cart/components/cart-list/CartList";
import { closeModal } from "../store/modalSlice";
const Cart = () => {
  const dispatch = useDispatch();
  const {activeModal} = useSelector(state => state.modal)
  return (
    <Modal open={activeModal === "cart"} onClose={() => dispatch(closeModal())}>
      <CartList />
    </Modal>
  );
};

export default Cart;
