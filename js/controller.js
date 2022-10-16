import * as model from './model.js';
import stopCardView from './views/stopCardView.js';
import searchStopView from './views/searchStopView.js';
import menuView from './views/menuView.js';
import maps from './views/mapView.js';
import mapView from './views/mapView.js';
import asideView from './views/asideView.js';
import arrivalsView from './views/arrivalsView.js';
import loginView from './views/loginView.js';
import favView from './views/favView.js';
import stopsView from './views/stopsView.js';

const controlSearchResult = async function (stop = '') {
  try {
    // 1. Get search query
    const query = stop || searchStopView.getQuery();
    if (!query) return;

    // 2. Render spinners and show results window
    controlMenu('stop');
    // stopCardView.showWindow();
    stopCardView.renderSpinner();
    arrivalsView.renderSpinner();
    favView.hideWindow();

    // 3. Get results and load search results to state
    await model.getBusArrivals(query);

    // 4. Render results
    renderStopInfo();
    renderArrivalsInfo();

    // 4. Render map
    maps.renderStopArrivals(model.state);
  } catch (error) {
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
    stopCardView.showWindow();
    searchStopView.showWindow();
    stopsView.showWindow();
    asideView.showWindow();
    arrivalsView.showWindow();
    favView.hideWindow();
  }
  if (option === 'map') {
    // Display/Hide containers
    arrivalsView.hideWindow();
    asideView.hideWindow();
    stopsView.showWindow();
    stopCardView.hideWindow();
    searchStopView.hideWindow();
    favView.hideWindow();

    // Render stops
    renderStops();
  }
  if (option === 'fav') {
    // Display/Hide containers
    stopsView.hideWindow();
    favView.showWindow();

    // Render favorites
    showFavs();
  }
  if (option === 'contact') {
    // Do something
    // console.log('Apretaste contacto');
  }
};

const showFavs = async function () {
  favView.renderSpinner();
  await model.getFavStopsInfo();
  favView.renderMessage('esto es un mensaje');
  favView.render(model.state.savedStopsInfo);
};

const controlFav = function (stop) {
  model.addFavStop(stop);

};

const controlDelFav = function (stop) {
  // 1. Delete stop
  model.deleteFav(stop);

  // 2. Render new stops
  favView.render(model.state.savedStopsInfo);
};

const addEventHandlers = function () {
  menuView.addHandlerStop(controlMenu);
  mapView.addHandlerPopup(controlSearchResult);
  asideView.addUpdateTimeHandler(renderArrivalsInfo);
  asideView.addHandlerFav(controlFav);
  searchStopView.addHandlerSearch(controlSearchResult);
  favView.addHandlerViewStop(controlSearchResult);
  favView.addHandlerDeleteFav(controlDelFav);
};

const main = async function () {
  try {
    // Get user location and saved data
    model.getUserLocation();
    model.loadFavStops();

    // Get access token and fav info
    await model.getAccessToken();
    model.getFavStopsInfo();

    // Update window
    loginView.hideWindow();
  } catch (error) {
    stopCardView.renderError(error.message);
  }

  // Add event handlers
  addEventHandlers();
};

main();
