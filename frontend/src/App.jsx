import AuthContextProvider from "./context/AuthContext";
import CartContextProvider from "./context/CartContext";
import ProductContextProvider from "./context/ProductContext";
import AppRouter from "./router/AppRouter";

const App = () => {
  return (
    <AuthContextProvider>
        <ProductContextProvider>
          <CartContextProvider>
            <AppRouter />
          </CartContextProvider>
        </ProductContextProvider>
    </AuthContextProvider>
  );
};

export default App;
