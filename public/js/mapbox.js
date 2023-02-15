/*eslint-disable */

mapboxgl.accessToken =
  'pk.eyJ1IjoieW9oYW5lczIxIiwiYSI6ImNsZTYyemh1djBmbWszdnM0ZHdwYm02czYifQ._NwU-4qyQ2dl9DVZq0GvvQ';
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [-74.5, 40], // starting position [lng, lat]
  zoom: 9, // starting zoom
});
