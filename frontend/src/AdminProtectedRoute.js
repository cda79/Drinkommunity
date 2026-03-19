import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

export default function AdminProtectedRoute({ children }) {
  const { token, user } = useContext(AuthContext);

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token exists but user isn't an admin, redirect to regular dashboard
  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // User is logged in AND is an admin, render 
  return children;
}
