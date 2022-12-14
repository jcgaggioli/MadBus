import View from './Views';

const renderLogs = false;
class Maps extends View {
  _parentElement = document.getElementById('map');
  #map;
  #mapZoomLevel = 16;

  // Map layers
  #busesGroup;
  #stopGroup;
  #stopsGroup;

  // Map icons
  //REFACTOR - There must be some way to put svgs data somewhere else
  #busIcon = L.divIcon({
    html: `          
    <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M6 24h-2c-.552 0-1-.448-1-1v-1c-.53 0-1.039-.211-1.414-.586s-.586-.884-.586-1.414v-8c-.552 0-1-.448-1-1v-3c0-.552.448-1 1-1v-4c0-1.657 1.343-3 3-3h16c1.657 0 3 1.343 3 3v4c.552 0 1 .448 1 1v3c0 .552-.448 1-1 1v8c0 .53-.211 1.039-.586 1.414s-.884.586-1.414.586v1c0 .552-.448 1-1 1h-2c-.552 0-1-.448-1-1v-1h-10v1c0 .552-.448 1-1 1zm-1.5-7c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm15 0c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-5 1h-5c-.276 0-.5.224-.5.5s.224.5.5.5h5c.276 0 .5-.224.5-.5s-.224-.5-.5-.5zm6.5-12.5c0-.276-.224-.5-.5-.5h-17c-.276 0-.5.224-.5.5v8.5s3.098 1 9 1 9-1 9-1v-8.5zm-5-3.5h-8v1h8v-1z"/></svg>
  `,
    className: 'icon_bus',
  });
  #stopIcon = L.divIcon({
    html: `          
    <svg xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
    <path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm4.667 19c.322 0 .583-.261.583-.583v-.584c.309 0 .606-.123.825-.341.219-.219.342-.516.342-.825v-4.667c.322 0 .583-.261.583-.583v-1.75c0-.322-.261-.584-.583-.584v-2.333c0-.966-.784-1.75-1.75-1.75h-9.334c-.966 0-1.75.784-1.75 1.75v2.333c-.322 0-.583.262-.583.584v1.75c0 .322.261.583.583.583v4.667c0 .309.123.606.342.825.219.218.516.341.825.341v.584c0 .322.261.583.583.583h1.167c.322 0 .583-.261.583-.583v-.584h5.834v.584c0 .322.261.583.583.583h1.167zm-9.042-4.083c.483 0 .875.392.875.875s-.392.875-.875.875-.875-.392-.875-.875.392-.875.875-.875zm8.75 0c.483 0 .875.392.875.875s-.392.875-.875.875-.875-.392-.875-.875.392-.875.875-.875zm-2.917.583c.161 0 .292.131.292.292 0 .161-.131.291-.292.291h-2.916c-.161 0-.292-.13-.292-.291 0-.161.131-.292.292-.292h2.916zm3.792-7.292c0-.161-.131-.291-.292-.291h-9.916c-.161 0-.292.13-.292.291v4.959s1.807.583 5.25.583 5.25-.583 5.25-.583v-4.959zm-2.917-2.041v.583h-4.666v-.583h4.666z"/>
    </svg>
  `,
    className: 'icon_bus-stop',
    iconSize: [24, 24],
  });

  #userLocation = L.divIcon({
    html: `          
    <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm4.047 7.107c-.235 0-1.893.576-4.044.576-2.167 0-3.792-.576-4.045-.576-.378 0-.687.308-.687.687 0 .318.225.599.531.669.613.16 1.262.293 1.757.542.459.231.78.566.78 1.14 0 2.027-1.325 3.92-1.859 4.817-.001 0-.001 0-.001.001-.061.105-.092.224-.092.344 0 .379.308.687.687.687.184 0 .358-.072.488-.204.447-.449 1.334-1.784 1.739-2.429.2-.319.395-.621.705-.622.302.001.498.303.699.622.405.645 1.29 1.98 1.737 2.429.13.132.304.204.489.204.379 0 .687-.308.687-.687 0-.119-.031-.237-.098-.353 0-.001 0-.001-.001-.002-.546-.919-1.853-2.778-1.853-4.807 0-.609.368-.956.851-1.186.519-.247 1.167-.362 1.681-.495.31-.071.536-.352.536-.67 0-.379-.309-.687-.687-.687zm-4.031-3.113c-.875 0-1.586.713-1.586 1.593 0 .879.711 1.592 1.586 1.592.876 0 1.586-.713 1.586-1.592 0-.88-.71-1.593-1.586-1.593z" fill-rule="nonzero"/></svg>
  `,
    className: 'icon_user-location',
    iconSize: [24, 24],
  });

  constructor() {
    super();
    this._getPosition();
  }

  addHandlerPopup(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.stopLook');
      if (btn) {
        const stop = btn.dataset.stop;
        handler(stop);
      }
    });
  }

  _getPosition() {
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert('Could not get your position');
        }
      );
  }

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords = [latitude, longitude];

    this.#map = L.map('map', {
      dragging: !L.Browser.mobile,
      gestureHandling: true,
    }).setView(coords, this.#mapZoomLevel);

    L.tileLayer(
      '	https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }
    ).addTo(this.#map);
    L.marker(coords, { icon: this.#userLocation }).addTo(this.#map);
    this.#busesGroup = L.layerGroup().addTo(this.#map);
    this.#stopGroup = L.layerGroup().addTo(this.#map);
    this.#stopsGroup = L.layerGroup().addTo(this.#map);
  }

  _setView(coords) {
    this.#map.setView(coords, this.#mapZoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  renderStopArrivals(data) {
    this.renderStop(data.busArrivals);
    this.renderBuses(data.busArrivals);
  }

  renderStops(stops, point) {
    this.#stopsGroup.clearLayers();
    this.#busesGroup.clearLayers();
    stops.forEach(stop => {
      L.marker(stop.geometry.coordinates.reverse(), { icon: this.#stopIcon }) //! Coordinates are in reverse order!!!
        //REFACTOR - This function could call another function that renders stops individually. But data should be adapted.
        .addTo(this.#stopsGroup)
        .bindPopup(
          L.popup({
            maxWidth: 250,
            minWidth: 100,
            autoClose: true,
            closeOnClick: true,
            className: `<stand-alone-popup>`,
          })
        )
        .setPopupContent(`<p><strong>${stop.stopName.toUpperCase()}</strong></br> ${
        stop.address
      }</p>

        <button class="btn stopLook" data-stop="${
          stop.stopId
        }">BUSCAR PARADA</button>
        `);
    });
    this._setView(point);
  }

  renderBuses(data) {
    const buses = data.arrivals;
    if (this.#stopsGroup) this.#stopsGroup.clearLayers();
    if (this.#busesGroup) this.#busesGroup.clearLayers();
    buses.forEach(element => {
      element.lineArrivals.forEach(el => {
        L.marker(el.busCoords, { icon: this.#busIcon })
          .addTo(this.#busesGroup)
          .bindPopup(
            L.popup({
              maxWidth: 250,
              minWidth: 100,
              autoClose: true,
              closeOnClick: true,
              className: `stand-alone-popup`,
            })
          )
          .setPopupContent(
            `<strong> Linea: </strong>${
              element.line
            } </br> <strong>Hacia:</strong> ${
              element.destination
            }</br> <strong>Bus:</strong> ${
              el.busNumber
            } </br> <strong>Llegada:</strong> ${Math.trunc(el.busEta / 60)} min`
          );
      });
    });
  }

  renderStop(data) {
    this.#stopGroup.clearLayers();
    L.marker(data.stopInfo.stopCoords, { icon: this.#stopIcon })
      .addTo(this.#stopGroup)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: true,
          closeOnClick: true,
          className: `stand-alone-popup`,
        })
      )
      .setPopupContent(
        `<strong>${data.stopInfo.stopName}</strong> </br> ${data.stopInfo.stopAddress}</br> N: ${data.stopInfo.stopId} `
      );

    this._setView(data.stopInfo.stopCoords);
  }
}

export default new Maps();
