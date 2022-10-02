import View from './Views.js';

class MenuView extends View {
  _parentElement = document.querySelector('.menu');
  _btnMenu = document.querySelector('.menu-btn');
  _overlay = document.querySelector('.overlay');

  constructor() {
    super();
    this._addHandlerMenu();
  }

  _toggleMenu() {
    if (window.innerWidth > 768) return;
    this._parentElement.classList.toggle('is-active');
    this._overlay.classList.toggle('hidden');
  }

  _addHandlerMenu() {
    this._btnMenu.addEventListener('click', this._toggleMenu.bind(this));
    this._overlay.addEventListener('click', this._toggleMenu.bind(this));
  }

  addHandlerStop(handler) {
    this._parentElement.addEventListener(
      'click',
      function (e) {
        const option = e.target.dataset.option;
        this._toggleMenu();
        handler(option);
      }.bind(this)
    );
  }
}

export default new MenuView();
