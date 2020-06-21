// type is 'success' or 'error'

export const hideAlert = () => {
 const alertEl = document.querySelector('.alert');

 if (alertEl) {
  alertEl.parentElement.removeChild(alertEl);
 }
};

export const showAlert = (type, msg) => {
 hideAlert();
 const markup = `<div class="alert alert--${type}">${msg}</div>`;
 document
  .querySelector('body')
  .insertAdjacentHTML('afterbegin', markup);
 console.log(markup);
 window.setTimeout(hideAlert, 5000);
};
