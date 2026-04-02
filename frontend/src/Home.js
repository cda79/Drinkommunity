import { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import logo from "./assets/logo.svg";

function Home() {
  // Drink Browsing Initializations
  // Search name
  const [searchTerm, setSearchTerm] = useState("");

  // Alcohol filter
  const alcholicTags = ["All", "Alcoholic", "Non alcoholic"];
  const [alcoholic, setAlcoholic] = useState("All");

  // Category
  const [category, setCategory] = useState("Ordinary Drink");
  const categories = [
    "Ordinary Drink",
    "Beer",
    "Cocktail",
    "Cocoa",
    "Coffee / Tea",
    "Homemade Liqueur",
    "Other / Unknown",
    "Punch / Party Drink",
    "Shake",
    "Soft Drink",
  ];

  const [allDrinks, setAllDrinks] = useState([]); // store everything for filtering

  // Login Initializations
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const { token } = useContext(AuthContext);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // -------------------------------------------------------------------------
  // --------------------------- Functions -----------------------------------
  // -------------------------------------------------------------------------

  // --------------------- Browse Functions ---------------------

  // search logic
  const filteredDrinks = allDrinks
    .filter((drink) => {
      return drink.strDrink.toLowerCase().includes(searchTerm.toLowerCase());
    })
    .slice(0, 10); // Show only top 10 (5 per row)

  const handleClearSearch = () => {
    setCategory("Ordinary Drink");
    setSearchTerm("");
  };

  const getDrink = useCallback(async () => {
    setAllDrinks([]); // Clear previous results
    try {
      //fetch category URL first
      const categoryURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`;
      const apiPromise = await fetch(categoryURL, { method: "GET" });
      const mongoPromise = await fetch(`http://localhost:5000/api/drinks`);

      const [apiRes, mongoRes] = await Promise.all([apiPromise, mongoPromise]);
      const apiData = await apiRes.json();
      const mongoData = await mongoRes.json();

      let apiDrinks = Array.isArray(apiData.drinks) ? apiData.drinks : [];
      const mongoDrinks = Array.isArray(mongoData) ? mongoData : [];

      // Alcohol filtering -- seperate URL fetching
      // We grab the ids of the drinks and then cross reference them
      if (alcoholic !== "All") {
        const alchUrl = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=${alcoholic.replace(/ /g, "_")}`;
        const alchRes = await fetch(alchUrl);
        const alchData = await alchRes.json();

        const alchDrinks = Array.isArray(alchData.drinks)
          ? alchData.drinks
          : [];
        // get IDS for drinks that are alcoholic or not (usestate)
        const alchIds = new Set(alchDrinks.map((d) => d.idDrink));
        // Compare IDS from when we fetched the category ones to see if theyre the same
        apiDrinks = apiDrinks
          .filter((d) => alchIds.has(d.idDrink))
          .map((d) => ({ ...d, alcoholicStatus: alcoholic })); //object label
      }

      setAllDrinks([...apiDrinks, ...mongoDrinks]);
    } catch (err) {
      console.error("Error fetching drinks:", err);
    }
  }, [category, alcoholic]);

  // Drink Cards
  function DrinkCard({ drink }) {
    const statusColor =
      drink.alcoholicStatus === "Non alcoholic" ? "#2e7d32" : "#A12F0D";
    return (
      <div className="drink-card">
        <div className="image-container">
          <img src={drink.strDrinkThumb} alt={drink.strDrink} />
        </div>
        <div className="card-details">
          {/* name */}
          <h3>{drink.strDrink}</h3>
          {/* alcohol status */}
          <p
            style={{
              fontSize: "0.8rem",
              fontWeight: "600",
              color: statusColor,
              fontStyle: "italic",
            }}
          >
            {drink.alcoholicStatus}
          </p>
          <p>id: {drink.idDrink}</p>
          <small>
            <strong>{category}</strong>
          </small>
        </div>
        <Link to="/details" state={{ drinkData: drink }}>
          <div className="view-details">View Details</div>
        </Link>
      </div>
    );
  }

  // data fetching - GET all drinks (GET is the default method)
  useEffect(() => {
    getDrink();
  }, [getDrink]);

  // --------------------- Login Functions ---------------------

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  // authentication logic
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token);
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  }

  // --------------------- Render View ---------------------

  return (
    <div className="page-container">
      {/* Header */}
      <div className="header-container">
        <img src={logo} alt="Company Logo" className="logo-container" />
        <hr className="plain-line" />
        <div className="header-wrapper">
          <Link className="header-item-active" to="/home">
            Home
          </Link>
          <Link className="header-item" to="/dashboard">
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

      {/* login form */}
      {!token && (
        <div className="form-wrapper">
          <div className="login-card">
            <div className="login-wrapper">
              <form onSubmit={handleSubmit} className="login-form">
                <div className="login-input">
                  <label>Username</label>
                  <input
                    name="username"
                    type="text"
                    placeholder="Username"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="login-input">
                  <label>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="button" id="button-login">
                  Sign In
                </button>
                <p className="footer-text">
                  Need an account?{" "}
                  <Link to="/register" className="register-link">
                    Register here
                  </Link>
                </p>
              </form>

              {error && <div style={styles.errorBanner}>X {error}</div>}
            </div>
          </div>
        </div>
      )}
      {/* ------------------------ Browse Drinks ------------------------ */}
      {/* SEARCH - NAME */}
      <div style={styles.searchCard}>
        <div style={styles.searchRow}>
          <div style={styles.searchInputGroup}>
            <label style={styles.searchLabel}>Drink Name</label>
            <input
              type="text"
              placeholder="Start typing a drink name (e.g. 'Cuba Libre' or 'Paloma')..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
            {/* CATEGORY (DROPDOWN) */}
            <div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "150px" }}
              >
                {categories.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            {/* ALCOHOLIC (DROPDOWN) */}
            <div>
              <select
                value={alcoholic}
                onChange={(e) => setAlcoholic(e.target.value)}
                style={{ width: "150px" }}
              >
                {alcholicTags.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button onClick={handleClearSearch} className="button">
            Clear
          </button>
        </div>
      </div>

      {/* 5-col grid (top 10 results) */}
      <div style={styles.gridWrapper}>
        <div style={styles.drinkGrid}>
          {filteredDrinks.length > 0 ? (
            filteredDrinks.map((drink) => {
              const uniqueKey = drink.uniqueKey || `api-${drink.idDrink}`;
              return <DrinkCard key={uniqueKey} drink={drink} />;
            })
          ) : (
            <div style={styles.noResults}>
              <p>No drinks match your search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  errorBanner: {
    color: "#c62828",
    marginTop: "5px",
  },
  // SEARCH CARD
  searchCard: {
    width: "100%",
    maxWidth: "1200px",
    marginBottom: "40px",
  },
  searchRow: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  searchInputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
    width: "100%",
    maxWidth: "500px",
  },
  searchLabel: {
    fontSize: "0.8rem",
    fontWeight: "bold",
    color: "#A12F0D",
  },
  searchInput: {
    padding: "10px",
    borderRadius: "4px",
    border: "1px solid #C5C5C5",
    fontSize: "1rem",
  },

  // DATABASE PREVIEW
  gridWrapper: {
    width: "85%",
    maxWidth: "1200px",
    background: "#F9F9F9",
    padding: "20px",
    border: "1px solid #D4D4D4",
  },
  drinkGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
  },
  noResults: {
    gridColumn: "1 / -1",
    textAlign: "center",
    padding: "40px",
  },
};

export default Home;
