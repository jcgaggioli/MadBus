import View from './Views.js';

class MenuView extends View {
  _parentElement = document.querySelector('.menu');
  _btnMenu = document.querySelector('.menu-btn');

  constructor() {
    super();
    this._addHandlerMenu();
  }

  _toggleMenu() {
    this._parentElement.classList.toggle('is-active');
  }

  _addHandlerMenu() {
    this._btnMenu.addEventListener('click', this._toggleMenu.bind(this));
  }
}

export default new MenuView();
