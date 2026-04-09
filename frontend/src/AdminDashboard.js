import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";

function AdminDashboard() {
  const [drinks, setDrinks] = useState([]);
  const { token, logout } = useContext(AuthContext);

  const { user } = useContext(AuthContext);
  let username = user?.username || "Admin";

  // initial load
  // fetches all drinks for admin, only owned drinks for regular users.
  useEffect(() => {
    if (!token) return;

    let endpoint = "http://localhost:5000/api/drinks/my-drinks";
    if (user?.role === "admin") endpoint = "http://localhost:5000/api/drinks";

    fetch(endpoint, {
      method: "GET",
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok)
          throw new Error("Could not retrieve your cocktail library.");
        return res.json();
      })
      .then((data) => setDrinks(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [token, user.role]);

  // delete
  // removes a drink after ownership verification on the server.
  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/drinks/${id}`, {
        //DELETE ID from db
        method: "DELETE",
        headers: {
          Authorization: token, // Include the auth token
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMsg =
          errorData.message || `Failed to delete drink (Status: ${res.status})`;
        alert("Error: " + errorMsg);
        console.error("Delete failed:", errorMsg);
        return;
      }

      // Remove from the UI after successful deletion from the db
      setDrinks(drinks.filter((d) => d._id !== id));
      console.log("Drink deleted successfully");
    } catch (err) {
      alert("Delete error: " + (err.message || "Unknown error occurred"));
      console.error("Delete error:", err);
    }
  }

  // helper function to clean image URLs.
  // extracts direct image links from Google Search redirects found in the CSV.
  function getCleanImageUrl(url) {
    if (!url) return null;
    if (url.includes("search?q=")) {
      try {
        const directUrl = url.split("search?q=")[1];
        return decodeURIComponent(directUrl);
      } catch (e) {
        return url;
      }
    }
    return url;
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header-container">
        <Link to="/home">
          <img src={logo} alt="Company Logo" className="logo-container" />{" "}
        </Link>
        <hr className="plain-line" />
        <div className="header-wrapper">
          <Link className="header-item" to="/home">
            Home
          </Link>
          <Link className="header-item-active" to="/dashboard">
            Dashboard
          </Link>
          <Link className="header-item" to="/create">
            Create
          </Link>
          <Link className="header-item" to="/account">
            Account
          </Link>
        </div>
      </div>

      <div className="user-panel-container">
        <header className="user-header">
          <div>
            {user?.imageThumb ? (
              <img
                src={getCleanImageUrl(user.imageThumb)}
                crossOrigin="anonymous"
                alt="User Icon"
                className="user-icon"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
                }}
              />
            ) : (
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
                alt="No Avatar"
                className="user-icon"
              />
            )}
          </div>
          <div>
            <h1>Drink Library (ADMIN DASHBOARD -- PROCEED WITH CAUTION)</h1>
            <h2>
              <strong>{username}'s</strong> Dashboard
            </h2>
            <button
              onClick={logout}
              className="button"
              id="logout-button"
              style={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </header>
      </div>

      <div className="content-wrapper">
        <div className="right-panel">
          <h2 style={styles.gardenTitle}>
            All User Created Cocktails ({drinks.length} Cocktails)
          </h2>

          <div className="drink-grid">
            {drinks.map((drink) => (
              <div key={drink._id} className="drink-card">
                <div className="image-container">
                  {drink.strDrinkThumb ? (
                    <img
                      src={getCleanImageUrl(drink.strDrinkThumb)}
                      alt={drink.strDrink}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
                      }}
                    />
                  ) : (
                    <div
                      className="placeholder"
                      style={styles.imagePlaceholder}
                    >
                      No Image Provided
                    </div>
                  )}
                </div>
                <div className="card-details">
                  <h3>{drink.strDrink || "Unnamed Cocktail"}</h3>
                  <p>
                    <strong>Category:</strong> {drink.strCategory || "N/A"}
                  </p>
                  <p>
                    <strong>Alcoholic?:</strong> {drink.strAlcoholic || "N/A"}
                  </p>
                  <p>
                    <small>Glass: {drink.strGlass || "N/A"}</small>
                  </p>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(drink._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

            {drinks.length === 0 && (
              <div style={styles.emptyMessage}>
                <p>
                  The cocktail library is currently empty.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
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

export default AdminDashboard;
