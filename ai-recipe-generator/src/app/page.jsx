'use client';

import React, { useState, useEffect } from 'react';
import styles from './RecipeGenerator.module.css';

export default function RecipeGenerator() {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('search');
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = localStorage.getItem('favoriteRecipes');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredients = e.target.elements.ingredients.value;
    setLoading(true);

    try {
      const response = await fetch('/api/get-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredients }),
      });
      const recipesData = await response.json();
      setRecipes(recipesData);
    } catch (error) {
      console.error('Error fetching recipes:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (recipe) => {
    const newFavorites = favorites.some(fav => fav.id === recipe.id)
      ? favorites.filter(fav => fav.id !== recipe.id)
      : [...favorites, recipe];
    
    setFavorites(newFavorites);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
  };

  const RecipeCard = ({ recipe, isFavorite }) => (
    <div className={`${styles.recipeCard} ${styles.fadeIn}`}>
      <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
      <div className={styles.recipeContent}>
        <h3 className={styles.recipeTitle}>{recipe.title}</h3>
        <button 
          className={styles.viewRecipeButton}
          onClick={() => toggleFavorite(recipe)}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav>
          <div className={styles.logo}>AI Recipe Generator</div>
          <div className={styles.navTabs}>
            <button
              className={`${styles.tabButton} ${activeTab === 'search' ? styles.active : ''}`}
              onClick={() => setActiveTab('search')}
            >
              Recipe Search
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'favorites' ? styles.active : ''}`}
              onClick={() => setActiveTab('favorites')}
            >
              Favorites
            </button>
            <button
              className={`${styles.tabButton} ${activeTab === 'about' ? styles.active : ''}`}
              onClick={() => setActiveTab('about')}
            >
              About
            </button>
          </div>
        </nav>
      </header>

      <main>
        {activeTab === 'search' && (
          <div>
            <h1 className={`${styles.title} ${styles.pulse}`}>AI Recipe Generator</h1>
            <form className={styles.recipeForm} onSubmit={handleSubmit}>
              <input
                id="ingredients"
                name="ingredients"
                type="text"
                placeholder="Enter ingredients (e.g., chicken, tomatoes, garlic)"
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Generating...' : 'Generate Recipe'}
              </button>
            </form>

            {loading && <p className={styles.centerText}>Cooking up some recipes...</p>}

            {!loading && recipes.length > 0 && (
              <div className={styles.recipeGrid}>
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.some(fav => fav.id === recipe.id)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className={styles.title}>Your Favorite Recipes</h2>
            {favorites.length > 0 ? (
              <div className={styles.recipeGrid}>
                {favorites.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={true}
                  />
                ))}
              </div>
            ) : (
              <p className={styles.centerText}>You have no favorite recipes yet.</p>
            )}
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 className={styles.title}>About This App</h2>
            <p className={styles.centerText}>
              This AI Recipe Generator helps you find recipes based on the ingredients you have. Powered by
              Spoonacular API and enhanced with modern design and animations.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}