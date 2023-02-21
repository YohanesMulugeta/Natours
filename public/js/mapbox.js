/*eslint-disable */

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoieW9oYW5lczIxIiwiYSI6ImNsZTYyemh1djBmbWszdnM0ZHdwYm02czYifQ._NwU-4qyQ2dl9DVZq0GvvQ';

  const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/yohanes21/cle72qxev004601q9fdmbazeo/draft', // style URL
    scrollZoom: false,
    // center: location[0], // starting position [lng, lat]
    // zoom: 2, // starting zoom
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create Marker
    const el = document.createElement('div');
    el.classList.add('marker');

    // Add Marker
    const marker = new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setPopup(
        // Create Popup
        new mapboxgl.Popup({ offset: 30 })
          .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
          .addTo(map)
      )
      .setLngLat(loc.coordinates)
      .addTo(map);

    marker.togglePopup();
    // Include the current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 100,
      left: 100,
      right: 100,
    },
  });
};
