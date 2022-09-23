export const LOGINURL =
  'https://openapi.emtmadrid.es/v1/mobilitylabs/user/login/';
export const XCLIENDID = 'ea33971b-dd47-439b-a1d4-d4118046a843';
export const PASSKEY =
  '8D4A5A95CAB39544921F42CF51901563B4DCC0C6F51265F19C39BA0A8BECD3850E19DCA7AC871C708BE59F31AD97B382DB74B93041925BA25FA11BF39329CD2B';

const renderLogs = false;

// export const AJAX = async function (url, uploadData = undefined) {
//   try {
//     const fetchPro = uploadData
//       ? fetch(url, {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(uploadData),
//         })
//       : fetch(url);

//     const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message} (${res.status})`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };

// AJAX call function //TODO - Mejorar esta funcion
export const AJAX = async function (rqstData) {
  try {
    const data = await fetch(rqstData.url, {
      method: rqstData.method,
      headers: rqstData.header,
      ...(rqstData.body != '' && { body: rqstData.body }),
    });
    renderLogs && console.log(`Data from '${rqstData.description}': `, data);
    const response = await data.json();
    if (!data.ok)
      throw new Error(
        `💀 Error while getting "${rqstData.description}" (${response.description})`
      );
    renderLogs &&
      console.log(`Response from '${rqstData.description}': `, response);
    return response.data[0];
  } catch (error) {
    throw error;
  }
};

export const capitalizeWords = function (str) {
  const arr = str.split(' ');
  return arr
    .map(element => {
      return element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
    })
    .join(' ');
};

const testArr = [
  {
    line: '150',
    stop: '125',
    isHead: 'False',
    destination: 'SOL SEVILLA',
    deviation: 0,
    bus: 2554,
    geometry: {
      type: 'Point',
      coordinates: [-3.6687874655861776, 40.477408505067125],
    },
    estimateArrive: 278,
    DistanceBus: 1029,
    positionTypeBus: '0',
  },
  {
    line: '174',
    stop: '125',
    isHead: 'False',
    destination: 'PLAZA CASTILLA',
    deviation: 0,
    bus: 2073,
    geometry: {
      type: 'Point',
      coordinates: [-3.6686261415820987, 40.49338164140787],
    },
    estimateArrive: 353,
    DistanceBus: 2238,
    positionTypeBus: '0',
  },
  {
    line: '129',
    stop: '125',
    isHead: 'False',
    destination: 'PLAZA CASTILLA',
    deviation: 0,
    bus: 2137,
    geometry: {
      type: 'Point',
      coordinates: [-3.6625002409353433, 40.482256567689696],
    },
    estimateArrive: 401,
    DistanceBus: 1977,
    positionTypeBus: '0',
  },
  {
    line: '129',
    stop: '125',
    isHead: 'False',
    destination: 'PLAZA CASTILLA',
    deviation: 0,
    bus: 2139,
    geometry: {
      type: 'Point',
      coordinates: [-3.6570251770763487, 40.48074695157227],
    },
    estimateArrive: 827,
    DistanceBus: 4124,
    positionTypeBus: '0',
  },
  {
    line: '174',
    stop: '125',
    isHead: 'False',
    destination: 'PLAZA CASTILLA',
    deviation: 0,
    bus: 2077,
    geometry: {
      type: 'Point',
      coordinates: [-3.6466132695767404, 40.485902073673344],
    },
    estimateArrive: 987,
    DistanceBus: 5292,
    positionTypeBus: '0',
  },
  {
    line: '150',
    stop: '125',
    isHead: 'False',
    destination: 'SOL SEVILLA',
    deviation: 0,
    bus: 2552,
    geometry: {
      type: 'Point',
      coordinates: [-3.6650473983997025, 40.48791306863569],
    },
    estimateArrive: 1134,
    DistanceBus: 3590,
    positionTypeBus: '0',
  },
];

console.log('Unmerged array: ', testArr);

/*
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

*/
