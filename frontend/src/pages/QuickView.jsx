import { useDispatch, useSelector } from "react-redux";
import Modal from "../components/ui/modal/Modal";
import { closeModal } from "../store/modalSlice";
import Product from "./Product";
import styles from "./QuickView.module.css";

const QuickView = () => {
  const dispatch = useDispatch();
  const { activeModal, modalData } = useSelector(state => state.modal);

  // Only render if modal is open and modalData exists
  if (activeModal !== "quickview" || !modalData) return null;

  return (
    <Modal
      variant="quick-view"
      open={true}
      onClose={() => dispatch(closeModal())}
    >
      <div className={styles.quickViewCard}>
        {/* Close Button */}
        <button
          className={styles.closeBtn}
          onClick={() => dispatch(closeModal())}
        >
          ✕
        </button>

        {/* Product Details */}
        <Product product={modalData} isModal />
      </div>
    </Modal>
  );
};

export default QuickView;