import View from './View.js';

import icons from '../../img/icons.svg';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', e => {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const { gotoPage } = btn.dataset;

      handler(+gotoPage);
    });
  }

  _generateMarkup() {
    const curPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    // page 1 and there are other pages
    if (curPage === 1 && numPages > 1)
      return this._generateMarkupNextButton(curPage);

    // page 1 and there are NO other pages
    if (curPage === 1 && numPages === 1) return '';

    // last page
    if (curPage === numPages) return this._generateMarkupPrevButton(curPage);

    // other pages
    return `
       ${this._generateMarkupPrevButton(curPage)}
       ${this._generateMarkupNextButton(curPage)}
    `;
  }

  _generateMarkupPrevButton(curPage) {
    return `
        <button data-goto-page="${
          curPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>${curPage - 1}</span>
        </button>
    `;
  }

  _generateMarkupNextButton(curPage) {
    return `
        <button data-goto-page="${
          curPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>${curPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
  }
}

export default new PaginationView();
