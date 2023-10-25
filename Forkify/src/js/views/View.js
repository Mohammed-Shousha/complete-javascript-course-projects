import icons from '../../img/icons.svg';

export default class View {
  _data;

  render(data) {
    if (this._isInvalidData(data)) return this.renderError();

    const markup = this.generateDataMarkup(data);

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  generateDataMarkup(data) {
    this._data = data;
    return this._generateMarkup();
  }

  update(data) {
    const newMarkup = this.generateDataMarkup(data);

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = [...newDOM.querySelectorAll('*')];
    const curElements = [...this._parentEl.querySelectorAll('*')];

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      // Updating text content
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newEl.textContent;

      // Updating attributes
      if (!newEl.isEqualNode(curEl))
        [...newEl.attributes].forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  renderSpinner() {
    const spinner = `
        <div class="spinner">
            <svg>
            <use href="${icons}#icon-loader"></use>
            </svg>
        </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', spinner);
  }

  renderError(msg = this._errorMsg) {
    const error = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', error);
  }

  renderMessage(msg = this._message) {
    const message = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${msg}</p>
        </div>
    `;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', message);
  }

  _clear() {
    this._parentEl.innerHTML = '';
  }

  _isInvalidData(data) {
    return !data || (Array.isArray(data) && data.length === 0);
  }
}
