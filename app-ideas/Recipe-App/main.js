// Recipe-APP Main JavaScript File

// DOM Elements
const recipeSearch = document.getElementById('recipeSearch');
const searchBtn = document.querySelector('.search-btn');
const recipeBubbles = document.getElementById('recipeBubbles');
const searchModal = document.getElementById('searchModal');
const modalBody = document.getElementById('modalBody');
const loadingState = document.getElementById('loadingState');
const resultsState = document.getElementById('resultsState');
const noResultsState = document.getElementById('noResultsState');
const errorState = document.getElementById('errorState');
const resultsGrid = document.getElementById('resultsGrid');
const closeBtn = document.querySelector('.close-btn');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// API Configuration
const API_BASE_URL = 'https://www.themealdb.com/api/json/v1/1';
const RANDOM_API = `${API_BASE_URL}/random.php`;
const SEARCH_API = `${API_BASE_URL}/search.php`;

// Application State
let currentSearchResults = [];
let isLoading = false;

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Recipe-APP initialized');
    initializeEventListeners();
    loadRandomRecipes();
});

// Event Listeners Setup
function initializeEventListeners() {
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    recipeSearch.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Modal controls
    closeBtn.addEventListener('click', hideModal);
    document.querySelector('.modal-overlay').addEventListener('click', hideModal);
    
    // Retry buttons
    document.getElementById('retryBtn')?.addEventListener('click', handleSearch);
    document.getElementById('errorRetryBtn')?.addEventListener('click', handleSearch);

    // Escape key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchModal.classList.contains('show')) {
            hideModal();
        }
    });
}

// Load Random Recipes for Bubbles
async function loadRandomRecipes() {
    console.log('Loading random recipes...');
    
    try {
        // Clear existing bubbles
        recipeBubbles.innerHTML = '';
        
        // Create loading bubbles
        for (let i = 0; i < 8; i++) {
            const bubble = createLoadingBubble();
            recipeBubbles.appendChild(bubble);
        }

        // Fetch 8 random recipes
        const promises = Array(8).fill().map(() => fetchRandomRecipe());
        const recipes = await Promise.all(promises);
        
        // Filter out failed requests
        const validRecipes = recipes.filter(recipe => recipe !== null);
        
        if (validRecipes.length > 0) {
            renderRecipeBubbles(validRecipes);
        } else {
            renderFallbackBubbles();
        }
        
    } catch (error) {
        console.error('Failed to load random recipes:', error);
        renderFallbackBubbles();
    }
}

// Fetch Single Random Recipe
async function fetchRandomRecipe() {
    try {
        const response = await fetch(RANDOM_API);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.meals && data.meals[0]) {
            return data.meals[0];
        }
        
        return null;
    } catch (error) {
        console.error('Error fetching random recipe:', error);
        return null;
    }
}

// Create Loading Bubble
function createLoadingBubble() {
    const bubble = document.createElement('div');
    bubble.className = 'recipe-bubble loading';
    bubble.innerHTML = '<span class="bubble-text">Loading...</span>';
    return bubble;
}

// Render Recipe Bubbles
function renderRecipeBubbles(recipes) {
    recipeBubbles.innerHTML = '';
    
    recipes.forEach(recipe => {
        const bubble = createRecipeBubble(recipe);
        recipeBubbles.appendChild(bubble);
    });
}

// Create Recipe Bubble
function createRecipeBubble(recipe) {
    const bubble = document.createElement('div');
    bubble.className = 'recipe-bubble';
    bubble.setAttribute('data-meal-id', recipe.idMeal);
    
    bubble.innerHTML = `
        <span class="bubble-text">${truncateText(recipe.strMeal, 20)}</span>
    `;
    
    // Add click event to navigate to recipe details
    bubble.addEventListener('click', function() {
        navigateToRecipe(recipe.idMeal);
    });
    
    return bubble;
}

// Render Fallback Bubbles
function renderFallbackBubbles() {
    const fallbackRecipes = [
        'Pasta', 'Pizza', 'Chicken', 'Beef', 
        'Fish', 'Salad', 'Soup', 'Cake'
    ];
    
    recipeBubbles.innerHTML = '';
    
    fallbackRecipes.forEach(name => {
        const bubble = document.createElement('div');
        bubble.className = 'recipe-bubble fallback';
        bubble.innerHTML = `<span class="bubble-text">${name}</span>`;
        
        // Add click event to search for this recipe
        bubble.addEventListener('click', function() {
            recipeSearch.value = name;
            handleSearch();
        });
        
        recipeBubbles.appendChild(bubble);
    });
    
    showToast('Using popular recipes due to connection issues', 'warning');
}

// Handle Search
async function handleSearch() {
    const query = recipeSearch.value.trim();
    
    // Input validation
    if (!query) {
        showToast('Please enter a recipe name', 'warning');
        recipeSearch.focus();
        return;
    }
    
    if (query.length < 2) {
        showToast('Please enter at least 2 characters', 'warning');
        return;
    }
    
    if (isLoading) {
        return;
    }
    
    try {
        isLoading = true;
        showModal();
        showLoadingState();
        
        const results = await searchRecipes(query);
        
        if (results && results.length > 0) {
            currentSearchResults = results;
            showResultsState(results);
        } else {
            showNoResultsState();
        }
        
    } catch (error) {
        console.error('Search failed:', error);
        showErrorState(error.message);
    } finally {
        isLoading = false;
    }
}

// Search Recipes via API
async function searchRecipes(query) {
    try {
        const response = await fetch(`${SEARCH_API}?s=${encodeURIComponent(query)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        return data.meals || [];
        
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('Network connection failed. Please check your internet connection.');
        }
        throw error;
    }
}

// Modal State Management
function showModal() {
    searchModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    searchModal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Reset modal state
    hideAllStates();
}

function hideAllStates() {
    loadingState.style.display = 'none';
    resultsState.style.display = 'none';
    noResultsState.style.display = 'none';
    errorState.style.display = 'none';
}

function showLoadingState() {
    hideAllStates();
    loadingState.style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Searching Recipes';
}

function showResultsState(results) {
    hideAllStates();
    resultsState.style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Search Results';
    
    renderSearchResults(results);
}

function showNoResultsState() {
    hideAllStates();
    noResultsState.style.display = 'block';
    document.getElementById('modalTitle').textContent = 'No Results Found';
}

function showErrorState(errorMessage) {
    hideAllStates();
    errorState.style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Search Error';
    document.getElementById('errorMessage').textContent = errorMessage;
}

// Render Search Results
function renderSearchResults(results) {
    resultsGrid.innerHTML = '';
    
    results.forEach(recipe => {
        const resultItem = createResultItem(recipe);
        resultsGrid.appendChild(resultItem);
    });
}

// Create Result Item
function createResultItem(recipe) {
    const item = document.createElement('div');
    item.className = 'result-item';
    item.setAttribute('data-meal-id', recipe.idMeal);
    
    item.innerHTML = `
        <div class="result-name">${recipe.strMeal}</div>
        <div class="result-category">${recipe.strCategory || 'Unknown'}</div>
        <div class="result-area">${recipe.strArea || 'International'}</div>
    `;
    
    // Add click event to navigate to recipe details
    item.addEventListener('click', function() {
        navigateToRecipe(recipe.idMeal);
    });
    
    return item;
}

// Navigate to Recipe Details
function navigateToRecipe(mealId) {
    if (!mealId) {
        showToast('Invalid recipe ID', 'error');
        return;
    }
    
    // Navigate to recipe.html with meal ID
    window.location.href = `recipe.html?id=${mealId}`;
}

// Toast Notification System
function showToast(message, type = 'info') {
    toastMessage.textContent = message;
    toast.className = `toast show ${type}`;
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Utility Functions
function truncateText(text, maxLength) {
    if (text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Error Handling for Unhandled Promises
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showToast('An unexpected error occurred', 'error');
});

// =============================================================================
// RECIPE DETAILS PAGE FUNCTIONALITY (recipe.html)
// =============================================================================

// Recipe page specific DOM elements
let recipePageElements = {};

// Initialize recipe page if we're on recipe.html
if (window.location.pathname.includes('recipe.html') || document.querySelector('.recipe-main')) {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('Recipe details page initialized');
        initializeRecipePage();
    });
}

// Initialize Recipe Page
function initializeRecipePage() {
    // Get DOM elements for recipe page
    recipePageElements = {
        recipeImage: document.getElementById('recipeImage'),
        recipeTitle: document.getElementById('recipeTitle'),
        recipeCategory: document.getElementById('recipeCategory'),
        recipeArea: document.getElementById('recipeArea'),
        recipeTags: document.getElementById('recipeTags'),
        ingredientsList: document.getElementById('ingredientsList'),
        instructionsContent: document.getElementById('instructionsContent'),
        videoSection: document.getElementById('videoSection'),
        youtubeLink: document.getElementById('youtubeLink'),
        sourceSection: document.getElementById('sourceSection'),
        sourceLink: document.getElementById('sourceLink'),
        loadingOverlay: document.getElementById('loadingOverlay'),
        errorOverlay: document.getElementById('errorOverlay'),
        backBtn: document.querySelector('.back-btn'),
        retryBtn: document.getElementById('retryBtn'),
        backToSearchBtn: document.getElementById('backToSearchBtn')
    };

    // Setup event listeners for recipe page
    setupRecipePageEventListeners();
    
    // Load recipe data
    loadRecipeFromURL();
}

// Setup Recipe Page Event Listeners
function setupRecipePageEventListeners() {
    // Back button
    if (recipePageElements.backBtn) {
        recipePageElements.backBtn.addEventListener('click', function() {
            if (document.referrer && document.referrer.includes('index.html')) {
                history.back();
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // Retry button
    if (recipePageElements.retryBtn) {
        recipePageElements.retryBtn.addEventListener('click', loadRecipeFromURL);
    }

    // Back to search button
    if (recipePageElements.backToSearchBtn) {
        recipePageElements.backToSearchBtn.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (document.referrer && document.referrer.includes('index.html')) {
                history.back();
            } else {
                window.location.href = 'index.html';
            }
        }
    });
}

// Load Recipe from URL Parameters
async function loadRecipeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const mealId = urlParams.get('id');
    
    if (!mealId) {
        showRecipeError('No recipe ID provided in URL');
        return;
    }
    
    console.log('Loading recipe with ID:', mealId);
    
    try {
        showLoadingOverlay();
        const recipeData = await fetchRecipeById(mealId);
        
        if (recipeData) {
            hideLoadingOverlay();
            renderRecipeDetails(recipeData);
            updatePageTitle(recipeData.strMeal);
        } else {
            showRecipeError('Recipe not found');
        }
        
    } catch (error) {
        console.error('Failed to load recipe:', error);
        showRecipeError(error.message);
    }
}

// Fetch Recipe by ID
async function fetchRecipeById(mealId) {
    try {
        const response = await fetch(`${API_BASE_URL}/lookup.php?i=${mealId}`);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.meals && data.meals[0]) {
            return data.meals[0];
        }
        
        return null;
        
    } catch (error) {
        if (error.name === 'TypeError') {
            throw new Error('Network connection failed. Please check your internet connection.');
        }
        throw error;
    }
}

// Render Recipe Details
function renderRecipeDetails(recipe) {
    console.log('Rendering recipe:', recipe.strMeal);
    
    // Basic information
    if (recipePageElements.recipeTitle) {
        recipePageElements.recipeTitle.textContent = recipe.strMeal;
    }
    
    if (recipePageElements.recipeImage) {
        recipePageElements.recipeImage.src = recipe.strMealThumb;
        recipePageElements.recipeImage.alt = recipe.strMeal;
        
        // Handle image load error
        recipePageElements.recipeImage.onerror = function() {
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlIEF2YWlsYWJsZTwvdGV4dD48L3N2Zz4=';
            this.alt = 'Recipe image not available';
        };
    }
    
    if (recipePageElements.recipeCategory) {
        recipePageElements.recipeCategory.textContent = recipe.strCategory || 'Unknown';
    }
    
    if (recipePageElements.recipeArea) {
        recipePageElements.recipeArea.textContent = recipe.strArea || 'International';
    }
    
    // Tags
    if (recipePageElements.recipeTags && recipe.strTags) {
        renderRecipeTags(recipe.strTags);
    }
    
    // Ingredients
    const ingredients = processRecipeIngredients(recipe);
    renderRecipeIngredients(ingredients);
    
    // Instructions
    const instructions = processRecipeInstructions(recipe.strInstructions);
    renderRecipeInstructions(instructions);
    
    // External links
    if (recipe.strYoutube) {
        showYouTubeSection(recipe.strYoutube);
    }
    
    if (recipe.strSource) {
        showSourceSection(recipe.strSource);
    }
}

// Process Recipe Ingredients
function processRecipeIngredients(recipe) {
    const ingredients = [];
    
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        
        if (ingredient && ingredient.trim() !== '') {
            ingredients.push({
                name: ingredient.trim(),
                measure: measure ? measure.trim() : ''
            });
        }
    }
    
    return ingredients;
}

// Process Recipe Instructions
function processRecipeInstructions(instructions) {
    if (!instructions) return [];
    
    // Split by line breaks and filter empty lines
    const steps = instructions
        .split(/\r?\n/)
        .map(step => step.trim())
        .filter(step => step !== '' && step.length > 1);
    
    return steps;
}

// Render Recipe Tags
function renderRecipeTags(tagsString) {
    if (!recipePageElements.recipeTags) return;
    
    const tags = tagsString.split(',').map(tag => tag.trim());
    recipePageElements.recipeTags.innerHTML = '';
    
    tags.forEach(tag => {
        if (tag) {
            const tagElement = document.createElement('span');
            tagElement.className = 'recipe-tag';
            tagElement.textContent = tag;
            recipePageElements.recipeTags.appendChild(tagElement);
        }
    });
}

// Render Recipe Ingredients
function renderRecipeIngredients(ingredients) {
    if (!recipePageElements.ingredientsList) return;
    
    recipePageElements.ingredientsList.innerHTML = '';
    
    if (ingredients.length === 0) {
        const noIngredients = document.createElement('li');
        noIngredients.className = 'ingredient-item';
        noIngredients.innerHTML = '<span class="ingredient-name">No ingredients available</span>';
        recipePageElements.ingredientsList.appendChild(noIngredients);
        return;
    }
    
    ingredients.forEach(ingredient => {
        const li = document.createElement('li');
        li.className = 'ingredient-item';
        
        li.innerHTML = `
            <span class="ingredient-name">${ingredient.name}</span>
            <span class="ingredient-measure">${ingredient.measure || 'As needed'}</span>
        `;
        
        recipePageElements.ingredientsList.appendChild(li);
    });
}

// Render Recipe Instructions
function renderRecipeInstructions(instructions) {
    if (!recipePageElements.instructionsContent) return;
    
    recipePageElements.instructionsContent.innerHTML = '';
    
    if (instructions.length === 0) {
        const noInstructions = document.createElement('p');
        noInstructions.textContent = 'No instructions available';
        noInstructions.style.color = '#666';
        noInstructions.style.fontStyle = 'italic';
        recipePageElements.instructionsContent.appendChild(noInstructions);
        return;
    }
    
    const ol = document.createElement('ol');
    ol.className = 'instructions-list';
    
    instructions.forEach(instruction => {
        const li = document.createElement('li');
        li.className = 'instruction-step';
        li.textContent = instruction;
        ol.appendChild(li);
    });
    
    recipePageElements.instructionsContent.appendChild(ol);
}

// Show YouTube Section
function showYouTubeSection(youtubeUrl) {
    if (!recipePageElements.videoSection || !recipePageElements.youtubeLink) return;
    
    recipePageElements.youtubeLink.href = youtubeUrl;
    recipePageElements.videoSection.style.display = 'block';
}

// Show Source Section
function showSourceSection(sourceUrl) {
    if (!recipePageElements.sourceSection || !recipePageElements.sourceLink) return;
    
    recipePageElements.sourceLink.href = sourceUrl;
    recipePageElements.sourceSection.style.display = 'block';
}

// Update Page Title
function updatePageTitle(recipeName) {
    if (recipeName) {
        document.title = `${recipeName} - Recipe-APP`;
    }
}

// Loading and Error State Management for Recipe Page
function showLoadingOverlay() {
    if (recipePageElements.loadingOverlay) {
        recipePageElements.loadingOverlay.style.display = 'flex';
    }
    if (recipePageElements.errorOverlay) {
        recipePageElements.errorOverlay.style.display = 'none';
    }
}

function hideLoadingOverlay() {
    if (recipePageElements.loadingOverlay) {
        recipePageElements.loadingOverlay.style.display = 'none';
    }
}

function showRecipeError(errorMessage) {
    if (recipePageElements.loadingOverlay) {
        recipePageElements.loadingOverlay.style.display = 'none';
    }
    
    if (recipePageElements.errorOverlay) {
        recipePageElements.errorOverlay.style.display = 'flex';
        
        const errorMessageElement = recipePageElements.errorOverlay.querySelector('#errorMessage');
        if (errorMessageElement) {
            errorMessageElement.textContent = errorMessage;
        }
    }
}

// Recipe Page Toast (reuse from main page)
function showRecipeToast(message, type = 'info') {
    // Reuse the toast function from the main page
    if (typeof showToast === 'function') {
        showToast(message, type);
    } else {
        // Fallback if main page toast is not available
        console.log(`Toast: ${message} (${type})`);
    }
}

// =============================================================================
// SHARED UTILITY FUNCTIONS AND EXPORTS
// =============================================================================

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        // Main page functions
        fetchRandomRecipe,
        searchRecipes,
        truncateText,
        debounce,
        // Recipe page functions
        fetchRecipeById,
        processRecipeIngredients,
        processRecipeInstructions
    };
}
