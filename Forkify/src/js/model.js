import { sendRequest } from './helpers.js';

import { API_URL, RES_PER_PAGE, KEY } from './config.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = data => {
  const { recipe } = data.data;

  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), // to only add the key property if it exits in the recipe
  };
};

export const loadRecipe = async id => {
  try {
    const data = await sendRequest(`${API_URL}/${id}?key=${KEY}`);

    state.recipe = createRecipeObject(data);

    state.bookmarks.some(bookmark => bookmark.id === id)
      ? (state.recipe.bookmarked = true)
      : (state.recipe.bookmarked = false);
  } catch (err) {
    throw err; // rethrowing error to the controller
  }
};

export const loadSearchResults = async query => {
  try {
    state.search.query = query;

    const data = await sendRequest(`${API_URL}?search=${query}&key=${KEY}`);

    state.search.results = data.data.recipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      image: recipe.image_url,
      ...(recipe.key && { key: recipe.key }),
    }));

    state.search.page = 1; // resetting search page
  } catch (error) {
    throw err; // rethrowing error to the controller
  }
};

export const getSearchResultsPage = (page = state.search.page) => {
  state.search.page = page;

  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;

  return state.search.results.slice(start, end);
};

export const updateServings = newServings => {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings; //newQty = oldQty * newServings / oldServings
  });

  state.recipe.servings = newServings;
};

const persistBookmarks = () => {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = recipe => {
  state.bookmarks.push(recipe);

  if (state.recipe.id === recipe.id) state.recipe.bookmarked = true;

  persistBookmarks();
};

export const removeBookmark = id => {
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  state.bookmarks.splice(index, 1);

  if (state.recipe.id === id) state.recipe.bookmarked = false;

  persistBookmarks();
};

const clearBookmarks = () => {
  localStorage.clear('bookmarks');
};

// clearBookmarks();

const loadBookmarks = () => {
  const savedBookmarks = localStorage.getItem('bookmarks');

  if (savedBookmarks) state.bookmarks = JSON.parse(savedBookmarks);
};

loadBookmarks();

const parseIngredients = newRecipe => {
  const ingredients = Object.entries(newRecipe)
    .filter(([key, value]) => key.startsWith('ingredient') && value)
    .map(([_, ing]) => {
      const ingArr = ing.split(',').map(el => el.trim());

      if (ingArr.length !== 3)
        throw new Error(
          'Wrong ingredient fromat! Please use the correct format'
        );

      const [quantity, unit, description] = ingArr;

      return { quantity: quantity ? +quantity : null, unit, description };
    });

  return ingredients;
};

export const uploadRecipe = async newRecipe => {
  try {
    const ingredients = parseIngredients(newRecipe);

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendRequest(`${API_URL}?key=${KEY}`, recipe);

    state.recipe = createRecipeObject(data);

    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
