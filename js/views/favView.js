import View from './Views';

class FavView extends View {
  _parentElement = document.querySelector('.fav__container');

  _generateMarkup() {
    const stops = this._data;
    console.log(stops);
    const markup = `
    <div class="fav__results">${stops
      .map(
        stop => `
    <div class="fav__item">
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
