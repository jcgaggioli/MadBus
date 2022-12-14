import View from './Views.js';

class SearchStopView extends View {
  _parentElement = document.querySelector('.stop__search');
  _inputField = document.querySelector('.stop__input');

  getQuery() {
    const query = this._inputField.value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.stop__input').value = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchStopView();
