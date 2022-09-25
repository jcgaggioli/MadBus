import View from './Views.js';
import { capitalizeWords } from '../helper.js';

const renderLogs = false;
class StopCardView extends View {
  _parentElement = document.querySelector('.stop-card__container');

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _generateMarkup() {
    renderLogs && console.log('Data to render: ', this._data);
    const markup = `
    <div class="stop-card__info">
      <div class="stop-card__name">
        <h2>${this._data.stopInfo.stopName.toUpperCase()}</h2>
        <h4>${this._data.stopInfo.Direction}</h4>
      </div>
      <div class="stop-card__stop-number">${this._data.stopInfo.stopId}</div>
      </div>
      <div class="stop-card__lines">
    ${this._data.arrivals
      .map(
        bus => `      
    <div class="stop-card__line">
      <div class="line__label" style="--line-color: ${bus.lineColor}">
      ${bus.line}
      </div>
      <div class="line__buses"> 
        <div class="line__etas">${bus.lineArrivals
          .map(
            busArrive =>
              `<div>
              <strong>${Math.trunc(busArrive.busEta / 60)}</strong> min
            </div>`
          )
          .join('')}
        </div>
        <div class="line__heading">
        A ${capitalizeWords(bus.destination)}
        </div>
      </div>
    </div>
  `
      )
      .join('')}
    </div>
    `;
    return markup;
  }
}

export default new StopCardView();
