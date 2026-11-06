# Drinkommunity
> (IAT459 final project)

A full-stack web application for cocktail enthusiasts and mixologists to explore, customize, and share drink recipes.

[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## Project Overview

**Drinkommunity** is a resource for visitors and mixologists featuring a robust database of cocktails. Users can explore drinks across different criteria and filters, view detailed ingredient breakdowns and instructions, bookmark their favorite recipes, and add custom drink creations to a community database.

---

## Tech Stack

* **Frontend:** React, JavaScript (ES6+), CSS3
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ORM)
* **External API:** [TheCocktailDB](https://www.thecocktaildb.com/api.php) via custom backend proxy server
* **Authentication:** JWT (JSON Web Tokens)

---

## Key Features

* **Cocktail Discovery & Search:** Browse drinks filtered by category, alcohol content, and ingredients.
* **Custom Recipe Creation:** Registered members can add their own unique cocktail recipes with ingredients, measurements, and instructions to the database.
* **Favorites System:** Save preferred drinks to a personalized user dashboard for quick access.
* **Community Discussions:** Comment section on individual drink pages allowing users to leave feedback and tips.
* **Role-Based Access Control (RBAC):** 🔒 Distinct permission levels for Guests, Users, and Admins.
  * **Guests:** Browse drinks and view detailed instructions.
  * **Users:** Add/delete personal drinks, favorite items, leave comments, and edit profile settings.
  * **Admins:** High-level administrative permissions to moderate content and remove any drink.

---

## Data Architecture

Here is the clean, structured markdown text representation of the Drinkommunity data architecture that you can easily copy and paste without table formatting issues:

* **User Collection**


* `_id` (Primary Key)


* `username` (String)


* `password` (String)


* `role` (String)


* `favourites` (Array)


* `nickname` (String)


* *Relationship:* Maintains a 1-to-many relationship with the **Drinks** collection through the `owner` foreign key.




* **Drinks Collection**


* `_id` (Primary Key)


* `owner` (Foreign Key referencing User)


* `idDrink` (String)


* `strDrink` (String)


* `strCategory` (String)


* `strAlcoholic` (String)


* `strInstructions` (String)


* `strGlass` (String)


* `strDrinkThumb` (String)


* `stringredient1` through `stringredient15` (String)


* `strMeasure1` through `strMeasure15` (String)


* *Relationship:* Maintains a 1-to-many relationship with the **Comments** collection through the `drinkid` field.




* **Comments Collection**


* `_id` (Primary Key)


* `user` (Foreign Key referencing User)


* `drinkid` (Foreign Key referencing Drinks)


* `text` (String)


* `createdAt` (Date)


* `updatedAt` (Date)


---

## API Endpoints Summary

### Authentication & Users
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register a new user account |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT |
| `GET` | `/api/auth/me` | Fetch logged-in user profile |
| `POST` | `/api/auth/favourite/:drinkId` | Toggle add/remove drink from favorites |
| `GET` | `/api/auth/favourites` | Fetch user's favorited drinks |

### Cocktails & Proxy
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/drinks/` | Fetch all custom drinks from MongoDB |
| `POST` | `/api/drinks/` | Add a new cocktail to MongoDB |
| `GET` | `/api/proxy/cocktails` | Fetch third-party cocktails via backend proxy] |
| `GET` | `/api/drinks/my-drinks` | Fetch drinks created by current user |
| `GET` | `/api/drinks/:id` | Get details for a specific drink |
| `DELETE` | `/api/drinks/:id` | Delete drink (Owner or Admin only) |

### Comments
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/comments/:drinkId` | Fetch all comments for a specific drink |
| `POST` | `/api/comments/` | Post a new comment |

---

## Technical Challenges & Solutions

### CORS & External API Proxy Setup
* **Issue:** Direct frontend requests from the client browser to *TheCocktailDB* were blocked due to Cross-Origin Resource Sharing (CORS) security restrictions.
* **Solution:** Engineered a dedicated backend server proxy route (`/api/proxy/cocktails`) in Node.js/Express[cite: 47]. The frontend routes requests through the local backend, performing secure server-to-server API fetches without triggering CORS blocks.

---

## Individual Contributions (Stin Dang)

* Developed custom **CSS styling** and executed **frontend debugging** to create a responsive, polished UI.
* Configured backend connections and schema integration with **MongoDB**.
* Engineered the **API Proxy server** route to resolve CORS blocks and manage third-party external data fetching.
* Implemented foundational backend **POST, GET, and DELETE API endpoints** and error-handling logic between client and server.
