// SECTION - Imports --------------------------------------------------------------------------------------
import { LOGINURL } from './helper.js';
import { XCLIENDID } from './helper.js';
import { PASSKEY } from './helper.js';
import { AJAX } from './helper.js';

// SECTION - Auxiliary data--------------------------------------------------------------------------------
const renderLogs = false;
const accessTokenProv = 'd6b8ea66-3744-11ed-8fab-02dc46503f61';

// SECTION - Model State ----------------------------------------------------------------------------------
export const state = {
  accessToken: '',
  user: {},
  busArrivals: {
    stopQuery: '',
    stopInfo: {},
    arrivals: [
      {
        line: '150',
        destination: 'Virgen Cortijo',
        lineArrivals: [
          {
            busNumber: 550,
            busEta: 50,
            busDeviation: 25,
            busDistance: 50,
            busCoords: [],
          },
        ],
      },
    ],
    incidents: {},
  },
};

//SECTION - Data transformation
const mergeLines = function (arr) {
  const res = [];
  arr.map(arrive =>
    res.some(
      el => (el.line === arrive.line) & (el.destination === arrive.destination)
    )
      ? res[
          res.findIndex(
            el =>
              (el.line === arrive.line) &
              (el.destination === arrive.destination)
          )
        ].lineArrivals.push({
          busNumber: arrive.bus,
          busEta: arrive.estimateArrive,
          busDeviation: arrive.deviation,
          busDistance: arrive.DistanceBus,
          busCoords: arrive.geometry.coordinates,
        })
      : res.push({
          line: arrive.line,
          destination: arrive.destination,
          lineArrivals: [
            {
              busNumber: arrive.bus,
              busEta: arrive.estimateArrive,
              busDeviation: arrive.deviation,
              busDistance: arrive.DistanceBus,
              busCoords: arrive.geometry.coordinates,
            },
          ],
        })
  );
  return res;
};

//SECTION - API Calls---------------------------------------------------------------------------------------
const loginHeader = {
  //TODO mejorar esto
  headers: {
    'X-ClientID': XCLIENDID,
    passKey: PASSKEY,
  },
};
// login API server and get access token
export const getAccessToken = async function () {
  //TODO separar el login del access token, tal vez
  renderLogs && console.log('Getting access token...');
  const data = await fetch(LOGINURL, loginHeader);
  const res = await data.json();
  renderLogs && console.log('Response from access token call: ', res);
  renderLogs && console.log('Access token: ', res.data[0].accessToken);
  state.accessToken = res.data[0].accessToken;
  return res.data[0].accessToken;
};

// Gets detailed information about a particular stop
export const stopRqst = async function (stop) {
  //TODO Sacar data de api fuera de la llamada
  const fetchData = {
    method: 'GET',
    url: `https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/${stop}/detail/`,
    header: {
      accessToken: state.accessToken,
      // accessToken: accessTokenProv,
      'Content-Type': 'application/json',
    },
    description: 'Stop details',
  };
  renderLogs && console.table(await AJAX(fetchData));
  return await AJAX(fetchData);
};

// Gets the bus stops in a given radius, in meters
export const stopRadiusRqst = async function (stop, radius) {
  const fetchData = {
    method: 'GET',
    url: `https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/arroundstop/${stop}/${radius}/`,
    header: {
      accessToken: state.accessToken,
      'Content-Type': 'application/json',
    },
    description: 'Stop at radius',
  };
  return fetchData;
};

const busArrivalsApi = function (stop) {
  const data = JSON.stringify({
    DateTime_Referenced_Incidencies_YYYYMMDD: '20190923',
    Text_EstimationsRequired_YN: 'Y',
    Text_IncidencesRequired_YN: 'Y',
    Text_StopRequired_YN: 'Y',
    cultureInfo: 'EN',
    statistics: 'N',
  });
  const fetchData = {
    method: 'POST',
    url: `https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/${stop}/arrives/`, ///${data.line}/`,
    header: {
      accessToken: state.accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
    description: 'Bus time arrival',
  };
  return fetchData;
};

// Gives arrival time of buses on a given stop
export const busTimeArrival = async function (stop) {
  state.busArrivals.stopQuery = stop;
  const response = await AJAX(busArrivalsApi(stop));
  console.log('response: ', response);
  state.busArrivals.stopInfo = response.StopInfo[0];
  state.busArrivals.arrivals = mergeLines(response.Arrive);
  console.log('state arrivals: ', state.busArrivals.arrivals);
  return await AJAX(busArrivalsApi(stop));
};

// Gives de route line of a given bus
export const lineRoute = async function (line) {
  //TODO Sacar data de api fuera de la llamada
  const fetchData = {
    method: 'GET',
    url: `https://openapi.emtmadrid.es/v1/transport/busemtmad/lines/${line}/route/`,
    header: {
      accessToken: state.accessToken,
      'Content-Type': 'application/json',
    },
    description: 'Bus route line',
  };
  return await AJAX(fetchData);
};

/* LPM esto sirve, pero ya no es necesario. Es la llamada a la misma api pero usamo XHR 
const request = new XMLHttpRequest();
request.open(
  'POST',
  'https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/148/arrives/',
  true
);
request.setRequestHeader(
  'accesstoken',
  'd6b8ea66-3744-11ed-8fab-02dc46503f61',
  'Accept',
  'application/json',
  'Content-Type',
  'application/json'
);
request;
request.send(
  JSON.stringify({
    DateTime_Referenced_Incidencies_YYYYMMDD: '20190923',
    Text_EstimationsRequired_YN: 'Y',
    Text_IncidencesRequired_YN: 'Y',
    Text_StopRequired_YN: 'Y',
    cultureInfo: 'EN',
    statistics: 'N',
  })
);
request.addEventListener('load', function () {
  console.log(JSON.parse(this.responseText));
});

*/
