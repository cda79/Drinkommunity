import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';


// This is the extremely basic API logic that just pulls the drinks into a list 
// + allows for searching

export default function App() {

  const [category, setCategory] = useState("Ordinary_Drink");
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // This is a function that calls the drinks as a card
  // rather than hardcoding it into the return()
function DrinkCard({ drink }) {
  return (
    <div className="card">
      <h2>{drink.strDrink}</h2>
      <p> id: {drink.idDrink}</p>
      <img className="thumbnail" src={drink.strDrinkThumb}></img>
    </div>
  );
}

// This fetches the drinks from the API
  useEffect(() => {
    getDrink();
  }, []);


  async function getDrink() {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await res.json();
    setDrinks(data.drinks || []);
  }

//search logic - 
const displayedDrinks = drinks.filter((drink) => {
    return drink.strDrink.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // The card is directly placed like this so its cleaner but its up to you
  return (
    <div>
      <h1>Cocktails Database</h1>

      <input 
        type="text" 
        placeholder="Search drinks..." 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />

        {displayedDrinks.map((drink) => (
          <DrinkCard id={drink.idDrink} drink={drink} />
        ))}

    </div>
  );
}