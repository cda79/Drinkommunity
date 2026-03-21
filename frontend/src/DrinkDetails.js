import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function DrinkDetails() {
    const location = useLocation();
    const initialDrink = location.state?.drinkData
    const [ drinkDetails, setDrinkDetails ] = useState(null);
    const [ ownerName, setOwnerName ] = useState("");

    const [ comments, setComments ] = useState([]);
    const [ newComment, setNewComment ] = useState("");
    const token = localStorage.getItem("token");

    // fetch drink details
    useEffect(() => {
        if (!initialDrink) return;

        const getDrinkDetails = async () => {
            try {
                const id = initialDrink.idDrink || initialDrink._id;
                const isMongo = !!initialDrink._id || (id && id.startsWith('user-'));

                const url = isMongo ? `http://localhost:5000/api/drinks/${id}` : `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
            
                const res = await fetch(url);
                const data = await res.json();

                if (isMongo) {
                    setDrinkDetails(data);
                    setOwnerName("");
                } else {
                    setDrinkDetails(data.drinks[0]);
                    setOwnerName("TheCocktailDB");
                }
            } catch (err) {
                console.error("Error fetching details:", err);
            }
        };

        getDrinkDetails();
    }, [initialDrink])

    // fetch comments
     useEffect(() => {
        const fetchComments = async () => {
            const id = initialDrink.idDrink || initialDrink._id;
            const res = await fetch (`http://localhost:5000/api/comments/${id}`);
            const data = await res.json();
            setComments(data);
        };
        if (drinkDetails) {
            fetchComments();
        }
    }, [drinkDetails]);

    // ingredients list function
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

    // submit comment function
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch("http://localhost:5000/api/comments", {
            method: "POST",
            body: JSON.stringify({
                drinkId: drinkDetails.idDrink || drinkDetails._id,
                text: newComment
            }),
        });
        const data = await res.json();
        setComments([data, ...comments]);
        setNewComment("");
    };


    return (
        <div className="drinkDetails-container">
            
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

                <p>
                    {ownerName === "TheCocktailDB" 
                        ? "Provided by TheCocktailDB" 
                        : `Uploaded by ${drinkDetails.owner?.username || "Anonymous"}`}
                </p>     
            </div>


            <div className="writeComment-container">
                <h3>Comments</h3>

                {token ? ( 
                    <form onSubmit = {handleCommentSubmit}>
                        <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="What you think of drink" required />
                            <button type="submit">Post</button>
                    </form>
                ) : (
                    <p>Please log in to leave a comment</p>
                )}
            </div>

            <div className="commentList-container">
                {comments.map(c => (
                    <div key={c._id} className="comment">
                        <strong>{c.user?.username || "Anon"}:</strong>
                        <p> {c.text} </p>
                        <small>{new Date(c.createdAt).toLocaleDateString()}</small>
                    </div>
                ))}
            </div>
            
        </div>
    );
}

export default DrinkDetails