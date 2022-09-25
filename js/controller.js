import * as model from './model.js';
import stopCardView from './views/stopCardView.js';
import searchStopView from './views/searchStopView.js';
import menuView from './views/menuView.js';
import maps from './views/mapView.js';

//> https://apidocs.emtmadrid.es/#api-Block_3_TRANSPORT_BUSEMTMAD-arrives

const controlSearchResult = async function () {
  try {
    const testCoords = [-3.6650704678381243, 40.48791692053226];
    //1. Get search query
    const query = searchStopView.getQuery();
    if (!query) return;
    stopCardView.renderSpinner();
    //2. Load search results
    await model.getBusArrivals(query);

    //3. Render results
    stopCardView.render(model.state.busArrivals);

    //4. Render map
    maps.renderView(
      model.state.busArrivals.stopInfo.geometry.coordinates.reverse(),
      13
    ); //TODO - Corregir el orden de las coordenadas en otro lado
    maps.renderBuses(model.state);
  } catch (error) {
    console.error(error);
    stopCardView.renderError(error.message);
  }
};

const main = async function () {
  // Get acces token
  await model.getAccessToken();
  // Add event listeners

  searchStopView.addHandlerSearch(controlSearchResult);
};

main();
