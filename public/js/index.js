import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, logout } from './login';
import { signup } from './signup';
import { updateUserAccount } from './updateSettings';
import { bookTour } from './stripe';

// DOM ELEMENTS
const mapBox = document.querySelector('#map');
const loginForm = document.querySelector(
 '.login-form .form'
);

const signupForm = document.querySelector(
 '.signup-form .form'
);

const userDataForm = document.querySelector(
 '.form-user-data'
);

const userPasswordForm = document.querySelector(
 '.form-user-settings'
);

const logOutBtn = document.querySelector(
 '.nav__el--logout'
);

const bookBtn = document.querySelector(
 '#book-tour'
);

// DELEGATION
if (mapBox) {
 const locations = JSON.parse(
  mapBox.dataset.locations
 );
 displayMap(locations);
}

if (loginForm) {
 loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email')
   .value;
  const password = document.getElementById(
   'password'
  ).value;
  login(email, password);
 });
}

if (signupForm) {
 signupForm.addEventListener(
  'submit',
  (event) => {
   event.preventDefault();

   const email = document.getElementById('email')
    .value;
   const name = document.getElementById('name')
    .value;
   const password = document.getElementById(
    'password'
   ).value;

   const passwordConfirm = document.getElementById(
    'passwordConfirm'
   ).value;

   signup(email, name, password, passwordConfirm);
  }
 );
}

if (logOutBtn) {
 logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
 userDataForm.addEventListener(
  'submit',
  async (event) => {
   event.preventDefault();
   const form = new FormData();
   form.append(
    'name',
    document.querySelector('#name').value
   );
   form.append(
    'email',
    document.querySelector('#email').value
   );
   form.append(
    'photo',
    document.querySelector('#photo').files[0]
   );
   console.log(form);

   document.querySelector(
    '.btn--save-password'
   ).textContent = 'Updating •••';

   await updateUserAccount(form, 'userData');
   document.querySelector(
    '.btn--save-password'
   ).textContent = 'SAVE SETTINGS';
  }
 );
}

if (userPasswordForm) {
 userPasswordForm.addEventListener(
  'submit',
  async (event) => {
   event.preventDefault();
   document.querySelector(
    '.btn--save-password'
   ).textContent = 'Updating •••';
   const password = document.querySelector(
    '#password'
   ).value;
   const passwordCurrent = document.querySelector(
    '#password-current'
   ).value;
   const passwordConfirm = document.querySelector(
    '#password-confirm'
   ).value;

   await updateUserAccount(
    {
     password,
     passwordCurrent,
     passwordConfirm,
    },
    'password'
   );

   document.querySelector('#password').value = '';
   document.querySelector(
    '#password-current'
   ).value = '';
   document.querySelector(
    '#password-confirm'
   ).value = '';

   document.querySelector(
    '.btn--save-password'
   ).textContent = 'Save password';
  }
 );
}

if (bookBtn)
 bookBtn.addEventListener(
  'click',
  async (event) => {
   event.target.textContent = 'Processing...';
   const { tourId } = event.target.dataset;
   await bookTour(tourId);
  }
 );
