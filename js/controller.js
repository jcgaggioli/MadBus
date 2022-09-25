import * as model from './model.js';
import stopCardView from './views/stopCardView.js';
import searchStopView from './views/searchStopView.js';
import menuView from './views/menuView.js';

//> https://apidocs.emtmadrid.es/#api-Block_3_TRANSPORT_BUSEMTMAD-arrives

const controlSearchResult = async function () {
  try {
    //1. Get search query
    const query = searchStopView.getQuery();
    if (!query) return;
    stopCardView.renderSpinner();
    //2. Load search results
    await model.getBusArrivals(query);

    //3. Render results
    stopCardView.render(model.state.busArrivals);
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
