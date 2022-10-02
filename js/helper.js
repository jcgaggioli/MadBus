export const LOGIN_URL =
  'https://openapi.emtmadrid.es/v1/mobilitylabs/user/login/';
export const API_URL = 'https://openapi.emtmadrid.es/v2/transport/busemtmad/';
export const X_CLIENT_ID = 'ea33971b-dd47-439b-a1d4-d4118046a843';
export const PASSKEY =
  '8D4A5A95CAB39544921F42CF51901563B4DCC0C6F51265F19C39BA0A8BECD3850E19DCA7AC871C708BE59F31AD97B382DB74B93041925BA25FA11BF39329CD2B';

const renderLogs = false;

// AJAX call function //REFACTOR - Mejorar esta funcion
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
    if (response.code === '90')
      throw new Error('El valor ingresado debe ser un número');
    return response.data;
  } catch (error) {
    console.error(error.message);
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

export const today = function () {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  const yyyy = today.getFullYear();
  return yyyy + mm + dd;
};
