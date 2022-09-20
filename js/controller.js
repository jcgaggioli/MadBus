import * as model from './model.js';
import stopCardView from './views/stopCardView.js';
import searchStopView from './views/searchStopView.js';

//> https://apidocs.emtmadrid.es/#api-Block_3_TRANSPORT_BUSEMTMAD-arrives

const state = {};

const helloUrl = 'https://openapi.emtmadrid.es/v1/hello/';
const testUrl = 'https://openapi.emtmadrid.es/';

const controlSearchResult = async function () {
  try {
    //1. Get search query
    const query = searchStopView.getQuery();
    if (!query) return;

    //2. Load search results
    await model.busTimeArrival(query);

    //3. Render results
    stopCardView.render(model.state.busArrivals);
  } catch (error) {}
};

const message = function () {
  console.log('Access Token from login: ', model.state.accessToken);
};

const main = async function () {
  // Get acces token
  await model.getAccessToken();

  // Add event listeners
  searchStopView.addHandlerSearch(controlSearchResult);

  console.log('Access Token from login: ', model.state.accessToken);
  console.log('State arrivals: ', state.busArrivals);

  // getRequest(stopRqst, { stop: '100' });
  // getRequest(stopRadiusRqst, { stop: "148", radius: "1000" });
  // getRequest(lineRoute, { line: "685" });
};

main();
