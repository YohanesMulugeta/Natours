/* eslint-disable */
import axios from 'axios';
import { showAlert, removeAlert } from './alert';

export const login = async (email, password) => {
  try {
    const { data } = await axios.post(
      'http://127.0.0.1:8000/api/v1/users/login',
      {
        email,
        password,
      }
    );

    if (data.status === 'success') {
      // alert('Logged in successfully');
      showAlert('success', 'You are successfully loged in.');

      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/v1/users/logout');
    showAlert('success', 'Success fully loged out');

    setTimeout(() => {
      location.reload(true);
    }, 1000);
  } catch (err) {
    showAlert('error', 'Error on logout.');
  }
};
