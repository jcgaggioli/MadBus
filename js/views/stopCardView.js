import View from './Views.js';
import { capitalizeWords } from '../helper.js';

const renderLogs = false;
class StopCardView extends View {
  _parentElement = document.querySelector('.stop-card__info');

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
  hideWindow() {
    this._parentElement.classList.add('hidden');
  }
  showWindow() {
    this._parentElement.classList.remove('hidden');
  }

  _generateMarkup() {
    renderLogs && console.log('Data to render: ', this._data);
    const markup = `
    <div class="stop-card__result">
      <div class="stop-card__name">
        <h2>${this._data.stopInfo.stopName.toUpperCase()}</h2>
        <h4>${this._data.stopInfo.stopAddress}</h4>
      </div>
    <div class="stop-card__stop-number">${this._data.stopInfo.stopId}</div>
    </div>
  `;
    return markup;
  }
}
export default new StopCardView();
