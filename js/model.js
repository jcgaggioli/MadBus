// SECTION - Imports --------------------------------------------------------------------------------------
import { API_URL, LOGIN_URL } from './helper.js';
import { X_CLIENT_ID } from './helper.js';
import { PASSKEY } from './helper.js';
import { AJAX } from './helper.js';
import { today } from './helper.js';

const renderLogs = false;

// SECTION - Model State ----------------------------------------------------------------------------------
export const state = {
  accessToken: '',
  user: {
    name: 'Juan Cruz',
    location: '',
  },
  stopDetails: '',
  nearStops: '',
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

export const getUserLocation = function () {
  const success = function (pos) {
    const { latitude } = pos.coords;
    const { longitude } = pos.coords;
    const coords = [latitude, longitude]; //! Coordinates are in reverse order!!!
    state.user.location = coords;
  };
  const error = function () {
    alert('Could not get your position');
  };

  if (navigator.geolocation)
    navigator.geolocation.watchPosition(success, error, {
      //> use getCurrentPosition() or watchPosition()
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    });
};

//SECTION - Data transformation ----------------------------------------------------------------------------------
const mergeLines = function (arr, stopInfo) {
  //REFACTOR - This function is too complicated
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
          busCoords: arrive.geometry.coordinates.reverse(), //! Coordinates are in reverse order
        })
      : res.push({
          line: arrive.line,
          lineColor:
            '#' +
            stopInfo.lines[
              stopInfo.lines.findIndex(el => el.label === arrive.line) //! This could lead to errors, 'label' and 'line' properties makes reference to the same data, but thery're written different i.e. > '014' and '14'
            ].color,
          destination: arrive.destination,
          lineArrivals: [
            {
              busNumber: arrive.bus,
              busEta: arrive.estimateArrive,
              busDeviation: arrive.deviation,
              busDistance: arrive.DistanceBus,
              busCoords: arrive.geometry.coordinates.reverse(), //! Coordinates are in reverse order
            },
          ],
        })
  );
  return res;
};

//SECTION - API Data ---------------------------------------------------------------------------------------
// login API server and get access token
export const getAccessToken = async function () {
  const loginHeader = {
    headers: {
      'X-ClientID': X_CLIENT_ID,
      passKey: PASSKEY,
    },
  };
  renderLogs && console.log('Getting access token...');
  try {
    const data = await fetch(LOGIN_URL, loginHeader);
    const res = await data.json();
    renderLogs && console.log('Access token: ', res.data[0].accessToken);
    state.accessToken = res.data[0].accessToken;
    document.querySelector('.login').classList.add('hidden'); //REFACTOR - DOM control should not be here
  } catch (error) {
    if (error.message === 'Failed to fetch')
      throw new Error('Hay problemas de conexion');
  }
};

const dataAPI = function (met, urlEnd, desc) {
  const data = JSON.stringify({
    //TODO - Look what is this data for
    DateTime_Referenced_Incidencies_YYYYMMDD: '20190923',
    Text_EstimationsRequired_YN: 'Y',
    Text_IncidencesRequired_YN: 'Y',
    Text_StopRequired_YN: 'Y',
    cultureInfo: 'EN',
    statistics: 'N',
  });
  const fetchData = {
    method: met,
    url: API_URL + urlEnd,
    header: {
      accessToken: state.accessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    ...(met != 'GET' && { body: data }),
    description: desc,
  };
  return fetchData;
};

// Gives arrival time of buses on a given stop
const busArrivalsAPI = function (stop) {
  const urlEnd = `stops/${stop}/arrives/`;
  const data = dataAPI('POST', urlEnd, 'Bus time arrival');
  return data;
};

// Gets detailed information about a particular stop
const stopInfoAPI = function (stop) {
  const urlEnd = `stops/${stop}/detail/`;
  const data = dataAPI('GET', urlEnd, 'Stop details');
  return data;
};

// Gets the bus stops in a given radius from a stop, in meters
const stopRadiusAPI = function (stop, radius) {
  const urlEnd = `stops/arroundstop/${stop}/${radius}/`;
  const data = dataAPI('GET', urlEnd, 'Stops at radius from stop');
  return data;
};

// Gets the bus stops in a given radius from coords, in meters
const stopRadiusCoordsAPI = function (coords, radius) {
  const urlEnd = `stops/arroundxy/${coords[0]}/${coords[1]}/${radius}/`;
  const data = dataAPI('GET', urlEnd, 'Stops at radius from coords');
  return data;
};

// Gives de route line of a given bus
const lineRouteAPI = function (line) {
  const urlEnd = `lines/${line}/route/`;
  const data = dataAPI('GET', urlEnd, 'Bus route line');
  return data;
};

const lineInfoAPI = function (line) {
  const urlEnd = `lines/${line}/info/${today()}/`;
  const data = dataAPI('GET', urlEnd, 'Line info');
  return data;
};

//SECTION - API Calls ---------------------------------------------------------------------------------------
export const getStopInfo = async function (stop) {
  const data = await AJAX(stopInfoAPI(stop));
  const response = data[0];
  return response;
};

export const stopsRadius = async function (stop, radius) {
  const response = await AJAX(stopRadiusAPI(stop, radius));
  return response;
};
export const stopsCoordsRadius = async function (coords, radius) {
  const response = await AJAX(stopRadiusCoordsAPI(coords.reverse(), radius)); //! Coordinates are in reverse order!!!
  state.nearStops = response;
};

const createStopObject = function (data) {
  return {
    stopId: data.stopId,
    stopName: data.stopName,
    stopAddress: data.Direction,
    stopCoords: data.geometry.coordinates.reverse(),
    lines: data.lines,
  };
};

export const getBusArrivals = async function (stop) {
  try {
    state.busArrivals.stopQuery = stop;
    const data = await AJAX(busArrivalsAPI(stop));
    const response = data[0];
    if (!response.StopInfo[0]) {
      throw new Error('No se encontró la parada');
    }
    const stopInfo = response.StopInfo[0];
    state.busArrivals.stopInfo = createStopObject(response.StopInfo[0]);
    state.busArrivals.arrivals = mergeLines(
      response.Arrive,
      response.StopInfo[0]
    );
  } catch (error) {
    throw error;
  }
};

export const getLineRoute = async function (line) {
  return await AJAX(lineRouteAPI(line));
};

export const getLineInfo = async function (line) {
  const response = await AJAX(lineInfoAPI(line));
  return response;
};
