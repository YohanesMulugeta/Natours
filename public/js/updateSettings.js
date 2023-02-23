/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

// API ROUte for updating 127.0.0.1:8000/api/v1/users/updateMe patch request
// Type is either password or data
export async function updateSettings(data, type) {
  try {
    // send API request to update data
    if (!['password', 'data'].includes(type))
      return console.error(
        'the second argument to updataSettings function has to be either password or data'
      );

    const urlExtension = type === 'password' ? 'MyPassword' : 'Me';

    const response = await axios({
      method: 'patch',
      url: `http://127.0.0.1:8000/api/v1/users/update${urlExtension}`,
      data,
    });

    if (response.data.status === 'success')
      showAlert('success', `${type.toUpperCase()} Update successful`);

    setTimeout(() => {
      location.reload(true);
    }, 1500);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response ? err.response.data.message : err.message);
  }
}
