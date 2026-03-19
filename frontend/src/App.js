import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // global state provider
import DashboardRouter from "./DashboardRouter"; // handles role-based routing
import Login from "./Login";
import Register from "./Register";

export default function App() {

  return (
    //wrap the entire app in AuthProvider so every component
    // can access the user's login status and token.

    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes: anyone can access these */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* dashboard route: routes to user or admin dashboard based on role */}
          <Route path="/dashboard" element={<DashboardRouter />} />

          {/* Catch-all route - redirect any undefined routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

