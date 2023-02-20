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
    console.log(data);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
