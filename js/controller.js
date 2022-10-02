import * as model from './model.js';
import stopCardView from './views/stopCardView.js';
import searchStopView from './views/searchStopView.js';
import menuView from './views/menuView.js';
import maps from './views/mapView.js';
import mapView from './views/mapView.js';

//> https://apidocs.emtmadrid.es/#api-Block_3_TRANSPORT_BUSEMTMAD-arrives

const controlSearchResult = async function (stop = '') {
  console.log(this);
  try {
    //1. Get search query
    const query = stop || searchStopView.getQuery();
    if (!query) return;
    stopCardView.showWindow();
    stopCardView.renderSpinner();
    //2. Load search results
    await model.getBusArrivals(query);
    await model.getStopInfo(1401);
    await model.getLineInfo(32);

    //3. Render results
    stopCardView.render(model.state.busArrivals);

    //4. Render map
    maps.renderStopArrivals(model.state);
  } catch (error) {
    console.error(error);
    stopCardView.renderError(error.message);
  }
};

const controlMenu = function (option) {
  //REFACTOR - No me gusta como queda esto aca
  // 1. Render search window and hide other windows
  if (!option) return;
  if (option === 'stop') {
    searchStopView.showWindow();
    stopCardView.showWindow();
  }
  if (option === 'map') {
    stopCardView.hideWindow();
    renderStops();
  }

  // 2. Clear map
};

const renderStops = async function () {
  await model.stopsCoordsRadius(model.state.user.location, 500);
  mapView._renderStops(model.state.nearStops);
};

const addListenersPopup = function () {
  //REFACTOR - Esto no deberia estar aca
  const map = document.getElementById('map');
  console.log(map);

  map.addEventListener('click', function (e) {
    console.log(e.target);
    const btn = e.target.closest('.stopLook');
    console.log(btn);
    if (btn) {
      const stop = btn.dataset.stop;
      controlSearchResult(stop);
    }
  });
};

const addEventHandlers = function () {
  menuView.addHandlerStop(controlMenu);
};

const main = async function () {
  addEventHandlers();
  model.getUserLocation();
  console.log('User location: ', model.state.user.location);

  addListenersPopup();
  // Get acces token
  try {
    await model.getAccessToken();
  } catch (error) {
    stopCardView.renderError(error.message);
  }
  // Add event listeners

  searchStopView.addHandlerSearch(controlSearchResult);
};

main();
