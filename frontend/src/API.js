import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';


// This is the extremely basic API logic that just pulls the drinks into a list 
// + allows for searching

export default function App() {

  const [category, setCategory] = useState("Ordinary_Drink");
  const [drinks, setDrinks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

function DrinkCard({ drink }) {
  return (
    <div className="card">
      <h2>{drink.strDrink}</h2>
      <p> id: {drink.idDrink}</p>
      <img className="thumbnail" src={drink.strDrinkThumb}></img>
    </div>
  );
}

  useEffect(() => {
    getDrink();
  }, []);

  async function getDrink() {
    const res = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`);
    const data = await res.json();
    setDrinks(data.drinks || []);
  }

const displayedDrinks = drinks.filter((drink) => {
    return drink.strDrink.toLowerCase().includes(searchTerm.toLowerCase());
  });

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