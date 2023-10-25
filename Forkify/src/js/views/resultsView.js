import View from './View.js';
import previewView from './previewView.js';

class ResultsView extends View {
  _parentEl = document.querySelector('.results');
  _errorMsg = 'No recipes found for your query! Please try again ;)';
  _message = '';

  _generateMarkup() {
    return this._data
      .map(result => previewView.generateDataMarkup(result))
      .join('');
  }
}

export default new ResultsView();
