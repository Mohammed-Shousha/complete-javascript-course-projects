class SearchView {
  _parentEl = document.querySelector('.search');

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value;

    this._clearInput();

    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
