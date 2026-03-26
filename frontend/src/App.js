import { Route, BrowserRouter as Router, Routes, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // global state provider
import DashboardRouter from "./DashboardRouter"; // handles role-based routing
import Home from "./Home";
import Register from "./Register";
import DrinkDetails from "./DrinkDetails";
import Create from "./Create"
import AccountSettings from "./AccountSettings";

export default function App() {

  return (
    //wrap the entire app in AuthProvider so every component
    // can access the user's login status and token.

    <AuthProvider>
      <Router>
        <Routes>
          {/* public routes: anyone can access these */}
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/details" element={<DrinkDetails />} />
          
          {/* dashboard route: routes to user or admin dashboard based on role */}
          <Route path="/dashboard" element={<DashboardRouter />} />
          <Route path="/create" element={<Create />} />
          <Route path="/account" element={<AccountSettings />} />

          {/* Catch-all route - redirect any undefined routes to home */}
          <Route path="*" element={<Navigate to="/home" replace />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

