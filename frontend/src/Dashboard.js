import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";

function Dashboard() {
  const [drinks, setDrinks] = useState([]);
  const { token, user, logout } = useContext(AuthContext);

  // local state for the form, match models/Drink.js and database
  const [formData, setFormData] = useState({
    strDrink: "",
    strCategory: "",
    strAlcoholic: "",
    strGlass: "",
    strInstructions: "",
    strIngredient1: "",
    strIngredient2: "",
    strIngredient3: "",
    strIngredient4: "",
    strIngredient5: "",
    strIngredient6: "",
    strIngredient7: "",
    strIngredient8: "",
    strIngredient9: "",
    strIngredient10: "",
    strIngredient11: "",
    strIngredient12: "",
    strIngredient13: "",
    strIngredient14: "",
    strIngredient15: "",
    strMeasure1: "",
    strMeasure2: "",
    strMeasure3: "",
    strMeasure4: "",
    strMeasure5: "",
    strMeasure6: "",
    strMeasure7: "",
    strMeasure8: "",
    strMeasure9: "",
    strMeasure10: "",
    strMeasure11: "",
    strMeasure12: "",
    strMeasure13: "",
    strMeasure14: "",
    strMeasure15: "",
    strImageSource: "",
  });

  // initial load
  // fetches only the drinks belonging to the logged-in user.
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/drinks/my-drinks", {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Could not retrieve your cocktail library.");
        return res.json();
      })
      .then((data) => setDrinks(data))
      .catch((err) => console.error("Fetch error:", err));
  }, [token]);

  // handle input changes for the controlled form
  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // create
  // adds a new drink to the user's collection after validating the input and receiving a successful response from the server.
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/drinks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const newDrink = await res.json();
        // update local state instantly for a smooth UI experience
        setDrinks([...drinks, newDrink]);
        // reset the form
        setFormData({
          strDrink: "",
          strCategory: "",
          strAlcoholic: "",
          strGlass: "",
          strInstructions: "",
          strIngredient1: "",
          strIngredient2: "",
          strIngredient3: "",
          strIngredient4: "",
          strIngredient5: "",
          strIngredient6: "",
          strIngredient7: "",
          strIngredient8: "",
          strIngredient9: "",
          strIngredient10: "",
          strIngredient11: "",
          strIngredient12: "",
          strIngredient13: "",
          strIngredient14: "",
          strIngredient15: "",
          strMeasure1: "",
          strMeasure2: "",
          strMeasure3: "",
          strMeasure4: "",
          strMeasure5: "",
          strMeasure6: "",
          strMeasure7: "",
          strMeasure8: "",
          strMeasure9: "",
          strMeasure10: "",
          strMeasure11: "",
          strMeasure12: "",
          strMeasure13: "",
          strMeasure14: "",
          strMeasure15: "",
          strImageSource: "",
        });
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Failed to add drink");
      }
    } catch (err) {
      console.error("Submission error:", err);
    }
  }

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
      <header className="main-header" style={styles.header}>
        <div>
          <h1>Drink Library</h1>
          {user && (
            <h3 style={styles.welcomeText}>Welcome back, {user.username}!</h3>
          )}
        </div>
        <button
          onClick={logout}
          className="delete-btn"
          style={styles.logoutBtn}
        >
          Logout
        </button>
      </header>

      <div className="content-wrapper">
        <div className="left-panel">
          <div className="card">
            <h3>Add New Drink</h3>
            <form onSubmit={handleSubmit} className="drink-form">
              <label>Common Name</label>
              <input
                name="common_name"
                value={formData.common_name}
                onChange={handleChange}
                placeholder="e.g. Janet Craig"
                required
              />

              <label>Family</label>
              <input
                name="family"
                value={formData.family}
                onChange={handleChange}
                placeholder="e.g. Liliaceae"
              />

              <label>Category</label>
              <input
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                placeholder="e.g. Dracaena"
              />

              <label>Origin</label>
              <input
                name="origin"
                value={formData.origin}
                onChange={handleChange}
                placeholder="e.g. Cultivar"
              />

              <label>Climate</label>
              <input
                name="climate"
                value={formData.climate}
                onChange={handleChange}
                placeholder="e.g. Tropical"
              />

              <label>Image URL</label>
              <input
                name="img_url"
                value={formData.img_url}
                onChange={handleChange}
                placeholder="http://..."
              />

              <button type="submit">Add to Garden</button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <h2 style={styles.gardenTitle}>My Cocktail Library ({drinks.length} Cocktails)</h2>

          <div className="drink-grid">
            {drinks.map((drink) => (
              <div key={drink._id} className="drink-card">
                <div className="image-container">
                  {drink.img_url ? (
                    <img
                      src={getCleanImageUrl(drink.img_url)}
                      alt={drink.common_name}
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
                  <h3>{drink.common_name || "Unnamed Cocktail"}</h3>
                  <p>
                    <strong>Family:</strong> {drink.family || "N/A"}
                  </p>
                  <p>
                    <strong>Category:</strong> {drink.categories || "N/A"}
                  </p>
                  <p>
                    <small>Origin: {drink.origin || "N/A"}</small>
                  </p>
                  <p>
                    <small>Climate: {drink.climate || "N/A"}</small>
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
                  Your cocktail library is currently empty. Add a cocktail using the form on the left!
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
    color: "#2e7d32",
    marginTop: "5px",
  },
  logoutBtn: {
    width: "auto",
    padding: "10px 25px",
    background: "#c62828",
    color: "white",
  },
  gardenTitle: {
    color: "#2e7d32",
    borderBottom: "2px solid #a5d6a7",
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
