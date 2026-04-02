import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import Dashboard from "./Dashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardRouter() {
  const { token, user } = useContext(AuthContext);

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/home" replace />;
  }

  // If user data hasn't decoded yet, wait (show nothing briefly)
  if (!user) {
    return null;
  }

  // Route based on user role
  if (user.role === "admin") {
    return <AdminDashboard />;
  }

  return <Dashboard />;
}
