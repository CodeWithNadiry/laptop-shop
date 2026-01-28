import { Navigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";

const ProfileRouter = ({ children }) => {
  const { token, isAdmin } = useAuthContext();

  if (!token) {
    return <Navigate to={"/auth/login"} replace />;
  }

  if (isAdmin) return <Navigate to={"/"} replace />;

  return children;
};

export default ProfileRouter;
