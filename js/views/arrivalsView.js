import View from './Views';
import { capitalizeWords } from '../helper';

class ArrivalsView extends View {
  _parentElement = document.querySelector('.stop-card__lines');

  _generateMarkup() {
    console.log(this._parentElement);
    console.log(this._data);
    const markup = `
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
      .join('')}`;
    return markup;
  }
}

export default new ArrivalsView();
