import { useUser } from "@clerk/clerk-react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return null;

  return user ? <Outlet /> : <Navigate to="/sign-in" />;
};

export default PrivateRoute;
