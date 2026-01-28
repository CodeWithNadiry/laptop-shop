/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-unused-vars */
import { createContext, useContext, useReducer, useEffect } from "react";
import { useAuthContext } from "./AuthContext";

const CartContext = createContext({
  items: [],
  addItem: (item) => {},
  removeItem: (id) => {},
  clearCart: () => {},
  updateQuantity: (id, quantity) => {},
});

function cartReducer(state, action) {
  const updatedItems = [...state.items];

  switch (action.type) {
    case "SET_CART":
      return { items: action.items };

    case "ADD_TO_CART": {
      const index = updatedItems.findIndex((item) => item._id === action.item._id);
      if (index !== -1) {  // means if already exist
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity + 1,
        };
      } else {
        updatedItems.push({ ...action.item, quantity: 1 });
      }
      return { items: updatedItems };
    }

    case "REMOVE_FROM_CART": {
      const index = updatedItems.findIndex((item) => item._id === action.id);
      if (index === -1) return state;

      if (updatedItems[index].quantity === 1) {
        updatedItems.splice(index, 1);
      } else {
        updatedItems[index] = {
          ...updatedItems[index],
          quantity: updatedItems[index].quantity - 1,
        };
      }
      return { items: updatedItems };
    }

    case "UPDATE_QUANTITY": {
      const index = updatedItems.findIndex((item) => item._id === action.id);
      if (index === -1) return state;

      updatedItems[index] = { ...updatedItems[index], quantity: action.quantity };
      return { items: updatedItems };
    }

    case "CLEAR_CART":
      return { items: [] };

    default:
      return state;
  }
}

const CartContextProvider = ({ children }) => {
  const [cart, dispatchCartAction] = useReducer(cartReducer, { items: [] });
  const { token, isAuthenticated, isAdmin } = useAuthContext();

  // Fetch cart from backend on login
  useEffect(() => {
    if (!isAuthenticated) {
      dispatchCartAction({ type: "CLEAR_CART" });
      return;
    }

    fetch("https://backend-production-fccb.up.railway.app/cart", {
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const backendItems = data.data.cart.items.map((item) => ({
          _id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          image: `${item.productId.image}`,
          quantity: item.quantity,
        }));
        dispatchCartAction({ type: "SET_CART", items: backendItems });
      })
      .catch(() => {
        dispatchCartAction({ type: "CLEAR_CART" });
      });
  }, [isAuthenticated, token]);

  // Cart actions
  function addItem(item) {
    if (!isAuthenticated) return { ok: false, reason: "NOT_AUTH" };
    if (isAdmin) return { ok: false, reason: "ADMIN" };

    // Optimistic update
    dispatchCartAction({ type: "ADD_TO_CART", item:{_id: item._id, name: item.name, price: item.price, image: item.image, quantity: 1} });

    fetch("https://backend-production-fccb.up.railway.app/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ prodId: item._id }),
    }).catch(() => {
      dispatchCartAction({ type: "REMOVE_FROM_CART", id: item._id });
    });

    return { ok: true };
  }

  function removeItem(id) {
    dispatchCartAction({ type: "REMOVE_FROM_CART", id });

    fetch(`https://backend-production-fccb.up.railway.app/cart/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
  }

  function clearCart() {
    dispatchCartAction({ type: "CLEAR_CART" });

    fetch("https://backend-production-fccb.up.railway.app/cart/clear", {
      method: "DELETE",
      headers: { Authorization: "Bearer " + token },
    });
  }

  function updateQuantity(id, quantity) {
    dispatchCartAction({ type: "UPDATE_QUANTITY", id, quantity });

    // Optional: sync with backend
    fetch(`https://backend-production-fccb.up.railway.app/cart/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({ prodId: id, quantity }),
    });
  }

  return (
    <CartContext.Provider
      value={{
        items: cart.items,
        addItem,
        removeItem,
        clearCart,
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCartContext = () => useContext(CartContext);
export default CartContextProvider;