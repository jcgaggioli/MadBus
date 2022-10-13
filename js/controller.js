import * as model from './model.js';
import stopCardView from './views/stopCardView.js';
import searchStopView from './views/searchStopView.js';
import menuView from './views/menuView.js';
import maps from './views/mapView.js';
import mapView from './views/mapView.js';
import asideView from './views/asideView.js';
import arrivalsView from './views/arrivalsView.js';

const controlSearchResult = async function (stop = '') {
  try {
    // 1. Get search query
    const query = stop || searchStopView.getQuery();
    if (!query) return;

    // 2. Render spinners and show results window
    stopCardView.showWindow();
    stopCardView.renderSpinner();
    arrivalsView.renderSpinner();

    // 3. Get results and load search results to state
    await model.getBusArrivals(query);

    // 4. Render results
    renderStopInfo();
    renderArrivalsInfo();

    // 4. Render map
    maps.renderStopArrivals(model.state);
  } catch (error) {
    console.error(error);
    stopCardView.renderError(error.message);
  }
};

const renderArrivalsInfo = async function (stop = '') {
  // 1. If stop is given then render spinner and get new results to update
  if (stop) {
    arrivalsView.renderSpinner();
    await model.getBusArrivals(stop);
  }

  // 2. Render results
  asideView.render(model.state.busArrivals);
  arrivalsView.render(model.state.busArrivals);
};

const renderStopInfo = async function () {
  stopCardView.render(model.state.busArrivals);
};

const renderStops = async function () {
  await model.stopsCoordsRadius(model.state.user.location, 1000);
  mapView.renderStops(
    model.state.nearStops,
    model.state.user.location.reverse() //! Coordinates are in reverse order!!!
  );
};

const controlMenu = function (option) {
  //REFACTOR - This could be somewhere else
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
};

const addEventHandlers = function () {
  menuView.addHandlerStop(controlMenu);
  asideView.addUpdateTimeHandler(renderArrivalsInfo);
  mapView.addHandlerPopup(controlSearchResult);
  searchStopView.addHandlerSearch(controlSearchResult);
};

const main = async function () {
  // Get user location
  model.getUserLocation();

  // Get access token
  try {
    await model.getAccessToken();
  } catch (error) {
    stopCardView.renderError(error.message);
  }

  // Add event handlers
  addEventHandlers();
};

main();
