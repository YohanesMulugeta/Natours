/* eslint-disable */
const loginForm = document.querySelector('.form');
loginForm.addEventListener('submit', async (e) => {
  try {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const res = await axios.post(
      'http://127.0.0.1:8000/api/v1/users/login',
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    console.log(res.data);
  } catch (err) {
    console.log(err.response);
  }
});
