import { useContext, useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import logo from './assets/logo.png';

function Login() {
  const [category, setCategory] = useState("Ordinary_Drink");
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [allDrinks, setAllDrinks] = useState([]); // store everything for filtering
  const [error, setError] = useState("");

  const { token } = useContext(AuthContext);

  // search state - the search term
  const [searchTerm, setSearchTerm] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // fetch drinks from API
  const getDrink = useCallback(async() => {
    try {
      const apiPromise = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
      const mongoPromise = await fetch(`http://localhost:5000/api/drinks`);

      const [apiRes,  mongoRes] = await Promise.all([apiPromise, mongoPromise]);

      const apiData = await apiRes.json();
      const mongoData = await mongoRes.json();

      const apiDrinks = apiData.drinks || [];
      const mongoDrinks = Array.isArray(mongoData) ? mongoData : [];

      setAllDrinks([...apiDrinks, ...mongoDrinks]);
    } catch (err) {
      console.error("Error fetching drinks:", err);
    }
  }, [category]);

  // Drink cards in drink previews
  function DrinkCard({ drink }) {
  return (
    <div className="drink-card">
      <div className="image-container">
        <img src={drink.strDrinkThumb} alt={drink.strDrink} />
      </div>
      <div className="card-details">
        <h3>{drink.strDrink}</h3>
        <p>id: {drink.idDrink}</p>
        <small><strong>{category}</strong></small>
      </div>
      <div className="view-details">View Details</div>
    </div>
  );
}

  // data fetching - GET all drinks (GET is the default method)
  useEffect(() => {
    getDrink();
  }, [getDrink]);

  useEffect(() => {
    if (token) {
      navigate("/dashboard"); // redirect to dashboard if already logged in
    }
  }, [token, navigate]);

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
        navigate("/");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  }

  // search logic
  const filteredDrinks = allDrinks
    .filter((drink) => {
      return (drink.strDrink || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    })
    .slice(0, 10); // Show only top 10 (5 per row)

  return (
    <div className="page-container" style={styles.pageContainer}>
    <div>
      <img src={logo} alt="Company Logo" style={{ width: '100px', marginBottom:'10px'}} />
    </div>
      
      {/* login form */}
      <div style={styles.formWrapper}>
        <div style={styles.loginCard}>

          {error && <div style={styles.errorBanner}>{error}</div>}

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

            <button type="submit" className="button">
              Sign In
            </button>
          </form>

          <p style={styles.footerText}>
            Need an account?{" "}
            <Link to="/register" style={styles.registerLink}>
              Register here
            </Link>
          </p>
        </div>
      </div>

      {/* search by name only */}
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
          </div>

          <button onClick={() => setSearchTerm("")} className="button">
            Clear
          </button>
        </div>
      </div>

      {/* 5-col grid (top 10 results) */}
      <div style={styles.gridWrapper}>
        <div style={styles.drinkGrid}>
          {filteredDrinks.length > 0 ? (
            filteredDrinks.map((drink) => (
              <DrinkCard key={drink.idDrink || drink._id} drink={drink} />
            ))
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
  pageContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  // -------LOGIN-----
  formWrapper: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    marginBottom: "30px",
  },
  loginCard: {
    width: "80%",
    flexDirection: "row",
    background: "#EFE7DF",
    display:"flex",
    padding: "20px",
    alignItems: "end",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)",
    borderRadius: "11px",
  },
  errorBanner: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "15px",
    textAlign: "center",
  },
  footerText: {
    marginTop: "15px",
    fontSize: "0.9rem",
    marginLeft: "0.5rem",
    color:"#A12F0D"
  },
  registerLink: {
    color: "#A12F0D",
    transition: "all 2s",
    fontWeight: "bold",
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
    padding:"20px",
    border:"1px solid #D4D4D4"
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

export default Login;
