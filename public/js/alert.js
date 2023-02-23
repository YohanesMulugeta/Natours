/* eslint-disable */
export const removeAlert = () => {
  document.querySelector('.alert')?.remove();
};
export const showAlert = (type, message) => {
  removeAlert();
  const markup = `<div class='alert alert--${type}'>${message}</div>`;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  setTimeout(() => {
    removeAlert();
  }, 4000);
};
  