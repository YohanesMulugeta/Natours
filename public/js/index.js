/*eslint-disable */
import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';
import { updateSettings } from './updateSettings.js';

// DOM ELEMENTS
const map = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const dataForm = document.querySelector('.form-user-data');
const settingsForm = document.querySelector('.form-user-settings');
const photoField = document.getElementById('photo');

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

logoutBtn?.addEventListener('click', logout);
dataForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append('name', document.getElementById('name').value);
  form.append('email', document.getElementById('email').value.toLowerCase());
  photoField.files.length && form.append('photo', photoField.files[0]);

  updateSettings(form, 'data');
});

settingsForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const password = document.getElementById('password-current').value;
  const newPassword = document.getElementById('password').value;
  const passwordConfirm = document.getElementById('password-confirm').value;
  const btn = document.querySelector('.btn--password-update');
  console.log(btn);

  if (newPassword !== passwordConfirm)
    return showAlert(
      'error',
      'New password and password confirm has to be the same'
    );

  btn.innerHTML = 'Updating...';

  await updateSettings({ newPassword, password, passwordConfirm }, 'password');

  btn.innerHTML = 'Save password';
});

// photoField?.addEventListener('change', (e) => {
//   userPic.setAttribute('src', e.target.value);
// });
