/*eslint-disable */
import '@babel/polyfill';
import { login } from './login.js';
import { displayMap } from './mapbox.js';

// DOM ELEMENTS
const map = document.getElementById('map');
const loginForm = document.querySelector('.form');

// VALUES

// DELIGATION
if (map) {
  const locations = JSON.parse(map.dataset.locations);

  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    login(email, password);
  });
}
