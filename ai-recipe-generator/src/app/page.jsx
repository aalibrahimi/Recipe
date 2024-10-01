'use client';
import { useState } from 'react';
import styles from './RecipeGenerator.module.css'; // We'll create this CSS module file next


export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [activeTab, setActiveTab] = useState('search');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ingredients = e.target.elements.ingredients.value;

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
    }
  };

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
            <h1 className={styles.title}>AI Recipe Generator</h1>
            <form className={styles.recipeForm} onSubmit={handleSubmit}>
              <input
                id="ingredients"
                name="ingredients"
                type="text"
                placeholder="Enter ingredients (e.g., chicken, tomatoes, garlic)"
                required
              />
              <button type="submit">Generate Recipe</button>
            </form>

            {recipes.length > 0 && (
              <div className={styles.recipeGrid}>
                {recipes.map((recipe) => (
                  <div key={recipe.id} className={`${styles.recipeCard} ${styles.fadeIn}`}>
                    <img src={recipe.image} alt={recipe.title} className={styles.recipeImage} />
                    <div className={styles.recipeContent}>
                      <h3 className={styles.recipeTitle}>{recipe.title}</h3>
                      <button className={styles.viewRecipeButton}>View Recipe</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div>
            <h2 className={styles.title}>Your Favorite Recipes</h2>
            <p className={styles.centerText}>You have no favorite recipes yet.</p>
          </div>
        )}

        {activeTab === 'about' && (
          <div>
            <h2 className={styles.title}>About This App</h2>
            <p className={styles.centerText}>
              This AI Recipe Generator helps you find recipes based on the ingredients you have. Powered by
              Spoonacular API.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}