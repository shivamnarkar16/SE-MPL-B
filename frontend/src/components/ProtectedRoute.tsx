import { useUserContext } from "@/context/User";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { user } = useUserContext();
  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
