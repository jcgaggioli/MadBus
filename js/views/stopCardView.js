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
  hideWindow() {
    this._parentElement.classList.add('hidden');
  }
  showWindow() {
    this._parentElement.classList.remove('hidden');
  }

  _generateMarkup() {
    //TODO - Separar encabezado de tarjetas en 2 vistas distintas
    renderLogs && console.log('Data to render: ', this._data);
    const markup = `
    <div class="stop-card__info">
      <div class="stop-card__name">
        <h2>${this._data.stopInfo.stopName.toUpperCase()}</h2>
        <h4>${this._data.stopInfo.stopAddress}</h4>
      </div>
      <div class="stop-card__stop-number">${this._data.stopInfo.stopId}</div>
      </div>
      <div class="results-display">
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
      <aside class="options">
        <div class="btn">ACTUALIZAR MAPA</div>
        <div class="btn">GUARDAR A FAVORITOS</div>
        <div class="btn">BUSCAR EN MAPA</div>
      </aside></div>
    `;
    return markup;
  }
}

export default new StopCardView();
