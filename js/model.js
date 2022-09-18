import { LOGINURL } from './helper.js';
import { XCLIENDID } from './helper.js';
import { PASSKEY } from './helper.js';
import { AJAX } from './helper.js';

const renderLogs = false;

// const accessTokenProv = 'd6b8ea66-3744-11ed-8fab-02dc46503f61';

//SECTION - API Calls---------------------------------------------------------------------------------------
const loginHeader = {
  headers: {
    'X-ClientID': XCLIENDID,
    passKey: PASSKEY,
  },
};
// login API server and get access token
const getAccessToken = async function () {
  renderLogs && console.log('Getting access token...');
  const data = await fetch(LOGINURL, loginHeader);
  const res = await data.json();
  renderLogs && console.log('Response from access token call: ', res);
  renderLogs && console.log('Access token: ', res.data[0].accessToken);
  return res.data[0].accessToken;
};

// Gets detailed information about a particular stop
export const stopRqst = async function (stop) {
  const fetchData = {
    method: 'GET',
    url: `https://openapi.emtmadrid.es/v2/transport/busemtmad/stops/${stop}/detail/`,
    header: {
      accessToken: await getAccessToken(),
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
      accessToken: await getAccessToken(),
      'Content-Type': 'application/json',
    },
    description: 'Stop at radius',
  };
  return await AJAX(fetchData);
};

// Gives arrival time of buses on a given stop
export const busTimeArrival = async function (stop) {
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
      accessToken: await getAccessToken(),
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: data,
    description: 'Bus time arrival',
  };
  renderLogs && console.table(await AJAX(fetchData));
  return await AJAX(fetchData);
};

// Gives de route line of a given bus
export const lineRoute = async function (line) {
  const fetchData = {
    method: 'GET',
    url: `https://openapi.emtmadrid.es/v1/transport/busemtmad/lines/${line}/route/`,
    header: {
      accessToken: await getAccessToken(),
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
