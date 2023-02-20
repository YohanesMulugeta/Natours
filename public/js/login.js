/* eslint-disable */
const loginForm = document.querySelector('.form');

const login = async (email, password) => {
  try {
    const { data } = await axios.post(
      'http://127.0.0.1:8000/api/v1/users/login',
      {
        email,
        password,
      }
    );

    if (data.status === 'success') {
      alert('Logged in successfully');

      setTimeout(() => {
        console.log('lala');
        location.assign('/');
      }, 1500);
    }
    console.log(data);
  } catch (err) {
    alert(err.response.data.message);
  }
};

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  login(email, password);
});
