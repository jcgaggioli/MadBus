import * as model from './model.js';
import stopCardView from './views/stopCardView.js';

//> https://apidocs.emtmadrid.es/#api-Block_3_TRANSPORT_BUSEMTMAD-arrives

const state = {};

const helloUrl = 'https://openapi.emtmadrid.es/v1/hello/';
const testUrl = 'https://openapi.emtmadrid.es/';

const controlStopRqst = async function () {
  stopCardView.render(await model.busTimeArrival('1408'));
};

const main = function () {
  // getRequest(stopRqst, { stop: '100' });
  console.log(model.stopRqst(148));
  // getRequest(stopRadiusRqst, { stop: "148", radius: "1000" });
  console.log(model.busTimeArrival('1408')); //*TODO esto no funciona
  // getRequest(lineRoute, { line: "685" });
  controlStopRqst();
};

main();
