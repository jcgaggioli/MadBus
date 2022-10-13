import View from './Views';

class AsideView extends View {
  _parentElement = document.querySelector('.options');

  addUpdateTimeHandler(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.updateTimes');
      if (!btn) return;
      handler(btn.dataset.stop);
    });
  }

  _generateMarkup() {
    const markup = `
    <div class="options-result">
    <div class="btn updateTimes" data-stop="${this._data.stopInfo.stopId}">ACTUALIZAR TIEMPOS</div>
    <div class="btn saveFav">GUARDAR A FAVORITOS</div>
    <div class="btn mapLook">BUSCAR EN MAPA</div>
    </div>
    `;
    return markup;
  }
}

export default new AsideView();
