import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function DrinkDetails() {
    const location = useLocation();

    const [drinkDetails, setDrinkDetails ] = useState(null);
    const [ownerName, setOwnerName] = useState("");

    const initialDrink = location.state?.drinkData

    useEffect(() => {
        if (!initialDrink) return;

        const getDrinkDetails = async () => {
            try {
                const id = initialDrink.idDrink || initialDrink._id;
                const isMongo = id.startsWith('user-') || id.length === 24;

                const url = isMongo ? `http://localhost:5000/api/drinks/${id}` : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
            
                const res = await fetch(url);
                const data = await res.json();

                setDrinkDetails(isMongo ? data : data.drinks[0]);
            } catch (err) {
                console.error("Error fetching details:", err);
            }
        };

        getDrinkDetails();
    }, [initialDrink])

    useEffect(() => {
        const fetchOwner = async () => {
            if (drinkDetails && drinkDetails.owner) {
                try {
                    const res = await fetch(`http://localhost:5000/api/users/${drinkDetails.owner}`);
                    const userData = await res.json();
                    setOwnerName(userData.username || "Unknown User")
                } catch (err) {
                    console.error("Error fetching owner:", err);
                    setOwnerName( "Anonymous User" );
                }
            } else if (drinkDetails) {
                setOwnerName("TheCocktailDB");
            }
        };
        fetchOwner();
    }, [drinkDetails])

    const renderIngredients = () => {
        const ingredients = [];

        for (let i = 1; i<=15; i++) {
            const ingredient = drinkDetails[`strIngredient${i}`];
            const measure = drinkDetails[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                ingredients.push(<li key={i}>{measure} {ingredient}</li>);
            }
        }
        return ingredients;
    };

    if (!drinkDetails) {
        return <div className="details-container">Loading drink details...</div>;
    }

    return (
        <div className="details-container">
            <img src={drinkDetails.strDrinkThumb}/>
            <h1>{drinkDetails.strDrink}</h1>
            <small><strong>{drinkDetails.strCategory}</strong></small>
            <p><strong>Tags:</strong> idk tags this is hardcoded I'll get back to this</p>

            <h3>Ingredients</h3>
            <ul>
                {renderIngredients()}
            </ul>

            <h3>Instructions</h3>
            <p>{drinkDetails.strInstructions || "No instructions provided."}</p>

            <p>{ownerName === "TheCocktailDB" ? `Provided by TheCocktailDB` : `Uploaded by ${ownerName}` }</p> 
        </div>
    )

}

export default DrinkDetails