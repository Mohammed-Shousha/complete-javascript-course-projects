import View from './View.js';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded :)';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this._addHandlerOpenForm();
    this._addHandlerCloseForm();
  }

  toggleForm() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerOpenForm() {
    this._btnOpen.addEventListener('click', this.toggleForm.bind(this));
  }

  _addHandlerCloseForm() {
    this._btnClose.addEventListener('click', this.toggleForm.bind(this));
    this._overlay.addEventListener('click', this.toggleForm.bind(this));
  }

  addHandlerUploadRecipe(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      const dataEntries = [...new FormData(this._parentEl)];
      const data = Object.fromEntries(dataEntries);
      handler(data);
    });
  }
}

export default new AddRecipeView();
