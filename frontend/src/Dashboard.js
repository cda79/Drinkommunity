import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Link } from "react-router-dom";
import logo from "./assets/logo.png";

function Dashboard() {
  const [drinks, setDrinks] = useState([]);
  const { token, logout } = useContext(AuthContext);
  const { user } = useContext(AuthContext);
  const [otherDrinks, setOtherDrinks] = useState([]);
  let username = "Guest";
  username = user?.username || username;

  // initial load
  // fetches public drinks as read only and the user's drinks (editable).
  useEffect(() => {
    // determine current user's id from server-provided user
    const userId = user?.id || null;

    // fetch public drinks for the user to just view
    fetch("http://localhost:5000/api/drinks", { method: "GET" })
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve drinks.");
        return res.json();
      })
      .then((data) => {
        if (userId) {
          const filtered = data.filter((d) => {
            const ownerId = d.owner && d.owner.toString ? d.owner.toString() : d.owner;
            return ownerId !== userId.toString();
          });
          setOtherDrinks(filtered);
        } else {
          setOtherDrinks(data);
        }
      })
      .catch((err) => console.error("Fetch error (public):", err));

    if (!token) return;

    // fetch user's own drinks (requires authorization)
    fetch("http://localhost:5000/api/drinks/my-drinks", {
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
      .catch((err) => console.error("Fetch error (my-drinks):", err));
  }, [token]);

  // delete
  // removes a drink after ownership verification on the server.
  async function handleDelete(id) {
    try {
      const res = await fetch(`http://localhost:5000/api/drinks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        setDrinks(drinks.filter((d) => d._id !== id));
      } else {
        alert(
          "Delete failed. You might not have permission to remove this item.",
        );
      }
    } catch (err) {
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
          <h1>Drink Library</h1>
          <h3 style={styles.welcomeText}>Welcome back, {username}!</h3>
        </div>
        <button onClick={logout} className="button" style={styles.logoutBtn}>
          Logout
        </button>
      </header>

      

      <div className="content-wrapper">

        <div className="right-panel">
          <h2 style={styles.gardenTitle}>
            My Cocktail Library ({drinks.length} Cocktails)
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
                          "https://via.placeholder.com/260x180?text=Image+Not+Found";
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
                  Your cocktail library is currently empty. Add a cocktail using
                  the form on the left!
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <h2 style={styles.gardenTitle}>
            Others' Cocktails ({otherDrinks.length} Cocktails)
          </h2>

          <div className="drink-grid">
            {otherDrinks.map((drink) => (
              <div key={drink._id} className="drink-card">
                <div className="image-container">
                  {drink.strDrinkThumb ? (
                    <img
                      src={getCleanImageUrl(drink.strDrinkThumb)}
                      alt={drink.strDrink}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/260x180?text=Image+Not+Found";
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
                  {/* Read-only: no deleting others' drinks!!!!!!!! */}
                </div>
              </div>
            ))}

            

            {otherDrinks.length === 0 && (
              <div style={styles.emptyMessage}>
                <p>
                  Others' cocktail library is currently empty. Looks like you are the first person here! 
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

export default Dashboard;
