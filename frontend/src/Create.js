import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

function Create() {
    const [drinks, setDrinks] = useState([]);
    const { token, logout } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    let username = "Guest";
    username = user?.username || username;

    // local state for the form, match models/Drink.js and database
    const [formData, setFormData] = useState({
        strDrink: "",
        strTags: "",
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

    // handle input changes for the controlled form
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    useEffect(() => {
        if (!token) {
        navigate("/register");
        }
    }, [token, navigate]);
  
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
            // update local state 
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

export default Create;
