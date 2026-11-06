# Drinkommunity
> (IAT459 final project)

A full-stack web application for cocktail enthusiasts and mixologists to explore, customize, and share drink recipes.

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

* 🔍 **Cocktail Discovery & Search:** Browse drinks filtered by category, alcohol content, and ingredients.
* 📝 **Custom Recipe Creation:** Registered members can add their own unique cocktail recipes with ingredients, measurements, and instructions to the database.
* ⭐ **Favorites System:** Save preferred drinks to a personalized user dashboard for quick access.
* 💬 **Community Discussions:** Comment section on individual drink pages allowing users to leave feedback and tips.
* 🔒 **Role-Based Access Control (RBAC):** Distinct permission levels for Guests, Users, and Admins.
  * **Guests:** Browse drinks and view detailed instructions.
  * **Users:** Add/delete personal drinks, favorite items, leave comments, and edit profile settings.
  * **Admins:** High-level administrative permissions to moderate content and remove any drink.

---

## 📐 Data Architecture

The application utilizes three main relational MongoDB collections[cite: 45]:
