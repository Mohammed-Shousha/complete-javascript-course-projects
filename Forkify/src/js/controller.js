import 'regenerator-runtime/runtime'; // Plolyfilling async/await
import 'core-js/stable'; // Plolyfilling everything else

import * as model from './model.js';

import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

import { MODAL_CLOSE_TIME } from './config.js';

const controlRecipe = async () => {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());

    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchRecipe = async () => {
  try {
    resultsView.renderSpinner();

    const query = searchView.getQuery();
    if (!query) return;

    await model.loadSearchResults(query);

    resultsView.render(model.getSearchResultsPage());

    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
  }
};

const controlPagination = gotoPage => {
  resultsView.render(model.getSearchResultsPage(gotoPage));

  paginationView.render(model.state.search);
};

const controlServings = servings => {
  model.updateServings(servings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = () => {
  if (model.state.recipe.bookmarked)
    model.removeBookmark(model.state.recipe.id);
  else model.addBookmark(model.state.recipe);

  recipeView.update(model.state.recipe);

  bookmarksView.render(model.state.bookmarks);
};

const controlBookmarks = () => {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async newRecipe => {
  try {
    addRecipeView.renderSpinner();

    await model.uploadRecipe(newRecipe);

    recipeView.render(model.state.recipe);

    addRecipeView.renderMessage();

    bookmarksView.render(model.state.bookmarks);

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    setTimeout(() => addRecipeView.toggleForm(), MODAL_CLOSE_TIME);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};

const init = () => {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUploadRecipe(controlAddRecipe);
};

init();
