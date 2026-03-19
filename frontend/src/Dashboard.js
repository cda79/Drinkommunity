import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { jwtDecode } from "jwt-decode"

function Dashboard() {
  const [drinks, setDrinks] = useState([]);
  const { token, logout } = useContext(AuthContext);

  let username = "Guest";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.username;
    } catch (error) {
      console.error("Token decoding failed", error);
    }
  }

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
    strDrinkThumb: "",
  });

  // initial load
  // fetches only the drinks belonging to the logged-in user.
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:5000/api/drinks/my-drinks", {
      method: "GET",
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
          strDrinkThumb: "",
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
            <h3 style={styles.welcomeText}>Welcome back, {username}!</h3>
        </div>
        <button
          onClick={logout}
          className="button"
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
              <label>Drink Name</label>
              <input
                name="strDrink"
                value={formData.strDrink}
                onChange={handleChange}
                placeholder="e.g. Negroni"
                required
              />

              <label>Category</label>
              <input
                name="strCategory"
                value={formData.strCategory}
                onChange={handleChange}
                placeholder="e.g. Apertif"
              />

              <label>Alcoholic</label>
              <input
                name="strAlcoholic"
                value={formData.strAlcoholic}
                onChange={handleChange}
                placeholder="e.g. Alcoholic"
              />

              <label>Glass</label>
              <input
                name="strGlass"
                value={formData.strGlass}
                onChange={handleChange}
                placeholder="e.g. Tall Glass"
              />

              <label>Image URL</label>
              <input
                name="strDrinkThumb"
                value={formData.strDrinkThumb}
                onChange={handleChange}
                placeholder="http://..."
              />

              <button type="submit">Add to Drink List</button>
            </form>
          </div>
        </div>

        <div className="right-panel">
          <h2 style={styles.gardenTitle}>My Cocktail Library ({drinks.length} Cocktails)</h2>

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
