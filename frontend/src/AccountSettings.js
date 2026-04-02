import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

function AccountSettings() {
    const { token, logout } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    let username = "Guest";
    username = user?.username || username;

    useEffect(() => {
        if (!token) {
        navigate("/home");
        }
    }, [token, navigate]);

    return (
        
        <div className="page-container">
            { token && (
                <div>
                    <div>
                        <img
                            src={logo}
                            alt="Company Logo"
                            style={{ width: "100px", marginBottom: "10px" }}
                        />
                        <div>
                            <Link to="/home">Home</Link>
                            <Link to="/dashboard">Dashboard</Link>
                            <Link to="/create">Create</Link>
                            <Link to="/account">Account</Link>
                        </div>
                    </div>
            
                    <header className="main-header" style={styles.header}>
                        <div>
                        <h1>Account</h1>
                        <h3 style={styles.welcomeText}>{username}</h3>
                        </div>
                        <button onClick={logout} className="button" style={styles.logoutBtn}>
                        Logout
                        </button>
                    </header>
                </div>
            )}
            
        </div>
    )
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  welcomeText: {
    color: "#A12F0D",
    marginTop: "5px",
  },
  gardenTitle: {
    color: "#A12F0D",
    borderBottom: "2px solid #EFE7DF",
    paddingBottom: "10px",
    marginBottom: "20px",
  },
  imagePlaceholder: {
    color: "#999",
  },
  emptyMessage: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
    color: "#666",
  },
};

export default AccountSettings;
