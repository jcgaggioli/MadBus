class Maps {
  #map;
  #mapZoomLevel = 16;
  #mapEvent;
  #busIcon = L.divIcon({
    html: `          
    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" class="icon_bus"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 1c6.071 0 11 4.929 11 11s-4.929 11-11 11-11-4.929-11-11 4.929-11 11-11zm-3.5 18h-1.167c-.322 0-.583-.261-.583-.583v-.584c-.309 0-.606-.123-.825-.341-.219-.219-.342-.516-.342-.825v-4.667c-.322 0-.583-.261-.583-.583v-1.75c0-.322.261-.584.583-.584v-2.333c0-.966.784-1.75 1.75-1.75h9.334c.966 0 1.75.784 1.75 1.75v2.333c.322 0 .583.262.583.584v1.75c0 .322-.261.583-.583.583v4.667c0 .309-.123.606-.342.825-.219.218-.516.341-.825.341v.584c0 .322-.261.583-.583.583h-1.167c-.322 0-.583-.261-.583-.583v-.584h-5.834v.584c0 .322-.261.583-.583.583zm-.875-4.083c.483 0 .875.392.875.875s-.392.875-.875.875-.875-.392-.875-.875.392-.875.875-.875zm8.75 0c.483 0 .875.392.875.875s-.392.875-.875.875-.875-.392-.875-.875.392-.875.875-.875zm-2.917.583h-2.916c-.161 0-.292.131-.292.292 0 .161.131.291.292.291h2.916c.161 0 .292-.13.292-.291 0-.161-.131-.292-.292-.292zm3.792-7.292c0-.161-.131-.291-.292-.291h-9.916c-.161 0-.292.13-.292.291v4.959s1.807.583 5.25.583 5.25-.583 5.25-.583v-4.959zm-2.917-2.041h-4.666v.583h4.666v-.583z"/></svg>
  `,
    className: 'icon_bus',
    iconSize: [24, 24],
    // iconAnchor: [12, 40],
  });

  constructor() {
    // Get user's position
    this._getPosition();

    // Get data from local storage
    // this._getLocalStorage();

    // Attach event handlers
    // form.addEventListener('submit', this._newWorkout.bind(this));
    // inputType.addEventListener('change', this._toggleElevationField);
    // containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
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

    this.#map = L.map('map').setView(coords, this.#mapZoomLevel);

    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
  }

  renderBuses(state) {
    const markers = L.layerGroup().addTo(this.#map);
    const buses = state.busArrivals.arrivals;
    markers.clearLayers();
    buses.forEach(element => {
      element.lineArrivals.forEach(
        el =>
          L.marker(el.busCoords, { icon: this.#busIcon })
            .addTo(markers)
            .bindPopup(
              L.popup({
                maxWidth: 250,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `stand-alone-popup`,
              })
            )
            .setPopupContent(`Contenido del popup`)
        // .openPopup()
      );
    });
  }

  renderView(coords, zoom = this.#mapZoomLevel) {
    // const newCoords = coords.reverse();
    this.#map.setView(coords, zoom, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }
}

export default new Maps();
