import View from './Views';

class FavView extends View {
  _parentElement = document.querySelector('.fav__container');
  _errorMessage = 'No hay paradas favoritas guardadas';

  addHandlerViewStop(handler) {
    this._parentElement.addEventListener('click', function (e) {
      e.preventDefault();
      if (e.target.classList.contains('item__delete')) return; //REFACTOR - I don't like this
      const item = e.target.closest('.fav__item');
      if (!item) return;
      const stop = item.dataset.stop;
      handler(stop);
    });
  }

  addHandlerDeleteFav(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const item = e.target.closest('.item__delete');
      if (!item) return;
      const stop = item.dataset.stop;
      handler(stop);
    });
  }

  _generateMarkup() {
    const stops = this._data;
    console.log(stops);
    const markup = `
    <div class="fav__results">${stops
      .map(
        stop => `
    <div class="fav__item" data-stop="${stop.stopId}">
      <h4>${stop.stopId}</h4>
      <aside>
        <h5>${stop.stopName.toUpperCase()}</h5>
        <p>${stop.address}</p>
        <div class="item__lines">${stop.lines
          .map(
            line => `
        <div><strong>${line.label}</strong></div>
        `
          )
          .join('')}
        </div>
      </aside>
      <div class="item__delete" data-stop="${stop.stopId}">X</div>
    </div>
    `
      )
      .join('')}
  </div>
    `;
    return markup;
  }
}

export default new FavView();
