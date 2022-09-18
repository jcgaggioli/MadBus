import View from './Views.js';

class stopCardView extends View {
  _parentElement = document.querySelector('.stop-card__container');

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }

  _generateMarkup() {
    console.log(this._data);
    const markup = `
    <div class="stop-card__info">
      <div class="stop-card__name">
        <h2>${this._data.StopInfo[0].stopName.toUpperCase()}</h2>
        <h4>${this._data.StopInfo[0].Direction}</h4>
      </div>
      <div class="stop-card__stop-number">${this._data.StopInfo[0].stopId}</div>
      </div>
      <div class="stop-card__lines">
    ${this._data.Arrive.map(
      bus => `      
    <div class="stop-card__line">
    <div class="line__label">${bus.line}</div>
    <div class="line__heading">${bus.destination}</div>
    <div class="line__min-frq">${bus.estimateArrive}</div>
    <div class="line__max-freq">35</div>
    </div>
  `
    ).join('')}
    </div>
    `;
    return markup;
  }
}

export default new stopCardView();
