import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import logo from "./assets/logo.svg";
import placeholder from "./assets/drink-placeholder.png";
import { AuthContext } from "./context/AuthContext";

function DrinkDetails() {
  const location = useLocation();
  const initialDrink = location.state?.drinkData;
  const [drinkDetails, setDrinkDetails] = useState(null);
  const [ownerName, setOwnerName] = useState("");

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const token = localStorage.getItem("token");

  const [isFavourited, setIsFavourited] = useState(false);
  // Other users
  const userItem = JSON.parse(localStorage.getItem("user"));
  // Current user
  const { user } = useContext(AuthContext);

  // fetch drink details
  useEffect(() => {
    if (!initialDrink) return;

    const getDrinkDetails = async () => {
      try {
        const id = initialDrink.idDrink || initialDrink._id;
        const isMongo = !!initialDrink._id || (id && id.startsWith("user-"));

        const url = isMongo
          ? `http://localhost:5000/api/drinks/${id}`
          : `http://localhost:5000/api/proxy/cocktails?i=${id}`;
        // `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;

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
  }, [initialDrink]);

  // fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      const id = initialDrink.idDrink || initialDrink._id;
      const res = await fetch(`http://localhost:5000/api/comments/${id}`);
      const data = await res.json();
      setComments(data);
    };
    if (drinkDetails) {
      fetchComments();
    }
  }, [drinkDetails, token, initialDrink._id, initialDrink.idDrink]);

  // check if the drink has already been favourited
  useEffect(() => {
    const checkFavourite = async () => {
      if (!token) return;
      const res = await fetch(`http://localhost:5000/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = await res.json();
      const currentId = drinkDetails._id || drinkDetails.idDrink;
      setIsFavourited(userData.favourites.includes(currentId));
    };
    if (drinkDetails) checkFavourite();
  }, [drinkDetails, token]);

  const toggleFavourite = async () => {
    const id = drinkDetails._id || drinkDetails.idDrink;
    const token = localStorage.getItem("token");

    if (!token)
      return alert("please log in to add this drink to your favourites!");

    try {
      const res = await fetch(
        `http://localhost:5000/api/auth/favourite/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.ok) {
        setIsFavourited(!isFavourited);
      } else {
        console.error("Server rejected the favourite toggle");
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  // ingredients list function
  const renderIngredients = () => {
    const ingredients = [];

    for (let i = 1; i <= 15; i++) {
      const ingredient = drinkDetails[`strIngredient${i}`];
      const measure = drinkDetails[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push(
          <li key={i}>
            {measure} {ingredient}
          </li>,
        );
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

    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://localhost:5000/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          drinkId: drinkDetails.idDrink || drinkDetails._id,
          text: newComment,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComments((prev) => [data, ...prev]);
        setNewComment("");
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || "Could not post comment"}`);
      }
    } catch (err) {
      console.error("Connection error:", err);
    }
  };

  // url cleaner
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
      {/* Header */}
      <div className="header-container">
        <Link to="/home">
          <img src={logo} alt="Company Logo" className="logo-container" />{" "}
        </Link>
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

      <div className="details-container">
        <div className="details-container-row-wrapper">
          <img
            className="details-image-container"
            src={drinkDetails.strDrinkThumb}
            alt={placeholder || drinkDetails.strDrink}
          />
          <div className="details-container-column-wrapper">
            <h1>{drinkDetails.strDrink}</h1>
            <small>
              <strong>{drinkDetails.strCategory}</strong>
            </small>
            <p>
              <strong>Tags:</strong> { drinkDetails.strTags ? drinkDetails.strTags : "This drink has no assigned tags" }
            </p>

            <h3>Ingredients</h3>
            <ul>{renderIngredients()}</ul>
          </div>
        </div>
        <button onClick={toggleFavourite}>
          {isFavourited ? "Favourited" : "Favourite"}
        </button>
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
          user?.imageThumb ? (
            <img
              src={getCleanImageUrl(user.imageThumb)}
              crossOrigin="anonymous"
              alt="User Icon"
              className="user-icon"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = placeholder;
              }}
            />
          ) : (
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
              alt="No Avatar"
              className="user-icon"
            />
          )
        ) : null}
        {token ? (
          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Leave Comment"
              required
            />
            <button className="button" type="submit">
              Post
            </button>
          </form>
        ) : (
          <p>Please log in to leave a comment</p>
        )}
      </div>

      <div className="commentList-container">
        {comments.map((c) => (
          <div key={c._id} className="comment-box">
            <img
              src={
                getCleanImageUrl(c.imageThumb) ||
                "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
              }
              crossOrigin="anonymous"
              alt="User Icon"
              className="user-icon"
              onError={(e) => {
                e.currentTarget.src =
                  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";
              }}
            />
            <div className="comment">
              <strong>{c.user?.username || "Anon"}:</strong>
              <p> {c.text} </p>
              <small>{new Date(c.createdAt).toLocaleDateString()}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DrinkDetails;
