import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAuthContext();

  // Wait until auth is restored
  if (isLoading) return null; // or a loading spinner

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
