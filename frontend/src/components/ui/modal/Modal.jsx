import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./Modal.module.css";

const Modal = ({ children, open, onClose, variant = 'cart' }) => {
  const dialog = useRef();

  // Handle open/close and body scroll
  useEffect(() => {
    const modal = dialog.current;
    if (!modal) return;

    if (open) {
      if (variant === 'cart') {
        modal.show(); // Side drawer
      } else {
        if (!modal.open) modal.showModal(); // Quick view
        document.body.style.overflow = 'hidden'; // Prevent background scroll
      }
    } else {
      if (modal.open) modal.close();
      document.body.style.overflow = ''; // Restore scroll
    }
  }, [open, variant]);

  // Prevent closing QuickView by clicking outside
  const handleClickOutside = (e) => {
    if (variant === 'quick-view') e.stopPropagation();
  };

  return createPortal(
    <dialog
      ref={dialog}
      className={`${styles.modal} ${styles[variant]}`}
      onClick={handleClickOutside}
      onClose={onClose}
    >
      {children}
    </dialog>,
    document.getElementById("modal")
  );
};

export default Modal;