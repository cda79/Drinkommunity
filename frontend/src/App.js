import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // global state provider
import Dashboard from "./Dashboard";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute"; // the "bounce" component
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
          <Route path="/register" element={<Register />} />{" "}
          {/* ADD ROUTE HERE */}
          {/* protected route: the Dashboard is nested inside ProtectedRoute.
              It checks for a token before allowing the 
              Dashboard component to render
          */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// If you want to preview the basic API code, backslash the code above this

// export default function App() {

//   const [category, setCategory] = useState("Ordinary_Drink");
//   const [drinks, setDrinks] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");

// function DrinkCard({ drink }) {
//   return (
//     <div className="card">
//       <h2>{drink.strDrink}</h2>
//       <p> id: {drink.idDrink}</p>
//       <img className="thumbnail" src={drink.strDrinkThumb}></img>
//     </div>
//   );
// }

//   useEffect(() => {
//     getDrink();
//   }, []);

//   async function getDrink() {
//     const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
//     const data = await res.json();
//     setDrinks(data.drinks || []);
//   }

// const displayedDrinks = drinks.filter((drink) => {
//     return drink.strDrink.toLowerCase().includes(searchTerm.toLowerCase());
//   });

//   return (
//     <div>
//       <h1>Cocktails Database</h1>
      
//       <input 
//         type="text" 
//         placeholder="Search drinks..." 
//         onChange={(e) => setSearchTerm(e.target.value)} 
//       />

//         {displayedDrinks.map((drink) => (
//           <DrinkCard id={drink.idDrink} drink={drink} />
//         ))}

//     </div>
//   );
// }
