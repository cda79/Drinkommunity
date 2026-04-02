import { useContext, useEffect, useState } from "react";
import "./App.css";
import { AuthContext } from "./context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import logo from "./assets/logo.png";

function Create() {
    const [drinks, setDrinks] = useState([]);
    const { token } = useContext(AuthContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    let username = "Guest";
    username = user?.username || username;

    // local state for the form, match models/Drink.js and database
    const [formData, setFormData] = useState({
        strDrink: "",
        strTags: "",
        strCategory: "Ordinary Drink",
        strAlcoholic: "Alcoholic",
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
        strDrinkThumb: "https://thumbs.dreamstime.com/b/web-324671699.jpg",
    });


    // some janky thing to handle quantity + unit of measurement inputs into one strMeasure //
    const [ingredientParts, setIngredientParts] = useState(
        Array.from({ length: 15 }, (_, i)  => ({
            quantity: "",
            unit: "",
            ingredient: "",
        }))
    );

    const [tags, setTags] = useState(
        {
            tag1: "",
            tag2: "",
            tag3: "",
            tag4: "",
        }
    );

    function handleIngredientChange(index, field, value) {
        const updatedParts = [...ingredientParts];
        updatedParts[index] = { ...updatedParts[index], [field]: value };
        setIngredientParts(updatedParts)
    }

    function handleTagsChange(e) {
        setTags({ ...tags, [e.target.name]: e.target.value })
    }

    // handle input changes for the controlled form
    function handleChange(e) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    
    useEffect(() => {
        if (!token) {
        navigate("/home");
        }
    }, [token, navigate]);
  
    // create
    // adds a new drink to the user's collection after validating the input and receiving a successful response from the server.
    async function handleSubmit(e) {
        e.preventDefault();

        let finalSubmissionData = {...formData};

        ingredientParts.forEach((item, index) => {
            const slot = index + 1;
            finalSubmissionData[`strMeasure${slot}`] = `${item.quantity} ${item.unit}`.trim();
            finalSubmissionData[`strIngredient${slot}`] = item.ingredient;
        });

        const filledTags = Object.values(tags).filter(t => t.trim() !== "");
        finalSubmissionData.strTags = filledTags.join(",");

        try {
        const res = await fetch("http://localhost:5000/api/drinks", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(finalSubmissionData),
        });

        if (res.ok) {
            const newDrink = await res.json();
            // update local state 
            setDrinks([...drinks, newDrink]);
            // reset the form
            setFormData({
            strDrink: "",
            strTags: "",
            strCategory: "Ordinary Drink",
            strAlcoholic: "Alcoholic",
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

            setTags({
            tag1: "",
            tag2: "",
            tag3: "",
            tag4: "",
            })

            setIngredientParts(
                Array.from({ length: 15 }, (_, i)  => ({
                quantity: "",
                unit: "",
                ingredient: "",
            })))

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

            {/* main drink creation content */}
            <div>
                <h3>Create Drink</h3>
                <form onSubmit={handleSubmit} className="drink-form">
                <img src={formData.strDrinkThumb} style={{ width: "100px", marginBottom: "10px" }}/>

                <label>Drink Name</label>
                <input
                    name="strDrink"
                    value={formData.strDrink}
                    onChange={handleChange}
                    placeholder="e.g. Negroni"
                    required
                />
                
                <label>Alcoholic?</label>
                <select name="strAlcoholic" value={formData.strAlcoholic} onChange={handleChange} required>
                    <option value="Alcoholic">Alcoholic</option>
                    <option value="Non-Alcoholic">Non-Alcoholic</option>
                </select>

                <label>Category</label>
                <select name="strCategory" value={formData.strCategory} onChange={handleChange} required>
                    <option value="Ordinary Drink">Ordinary Drink</option>
                    <option value="Beer">Beer</option>
                    <option value="Cocktail">Cocktail</option>
                    <option value="Cocoa">Cocoa</option>
                    <option value="Coffee/Tea">Coffee/Tea</option>
                    <option value="Handmade Liqueur">Handmade Liqueur</option>
                    <option value="Other/Unknown">Other/Unknown</option>
                    <option value="Punch/Party Drink">Punch/Party Drink</option>
                    <option value="Shake">Shake</option>
                    <option value="Soft Drink">Soft Drink</option>
                </select>

                <label>Tag-1</label>
                <input
                    name="tag1"
                    type="text"
                    value={tags.tag1}
                    onChange={handleTagsChange}
                />

                <label>Tag-2</label>
                <input
                    name="tag2"
                    type="text"
                    value={tags.tag2}
                    onChange={handleTagsChange}
                />

                <label>Tag-3</label>
                <input
                    name="tag3"
                    type="text"
                    value={tags.tag3}
                    onChange={handleTagsChange}
                />

                <label>Tag-4</label>
                <input
                    name="tag4"
                    type="text"
                    value={tags.tag4}
                    onChange={handleTagsChange}
                />

                <label>Image URL</label>
                <input
                    name="strDrinkThumb"
                    value={formData.strDrinkThumb}
                    onChange={handleChange}
                    placeholder="http://..."
                />

                <label>Instructions</label>
                <textarea name="strInstructions" value={formData.strInstructions} onChange={handleChange}></textarea>

                <label>Ingredients (Max.15)</label>
                {ingredientParts.map((item, index) => (
                    <div key={index}>
                        <span>{index + 1}</span>

                        <input 
                            type="text"
                            placeholder="Quantity"
                            value={item.quantity}
                            onChange={(e)=> handleIngredientChange(index, "quantity", e.target.value)}
                        />

                        <select
                            value={item.unit}
                            onChange={(e) => handleIngredientChange(index, "unit", e.target.value)}
                        >
                            <option value="oz">oz</option>
                            <option value="ml">ml</option>
                            <option value="cl">cl</option>
                            <option value="tsp">tsp</option>
                            <option value="parts">parts</option>
                            <option value="dash">dash</option>
                            <option value="drop">drop</option>
                            <option value="splash">splash</option>                        
                        </select>

                        <input
                            type="text"
                            placeholder="ingredient"
                            value={item.ingredient}
                            onChange={(e) => handleIngredientChange(index, "ingredient", e.target.value)}
                        />
                    </div>
                ))}

                <button type="submit">Add to Drink List</button>

                </form>
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
