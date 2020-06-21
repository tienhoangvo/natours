import axios from 'axios';
import { showAlert } from './alerts';

export const signup = async (
 email,
 name,
 password,
 passwordConfirm
) => {
 try {
  const res = await axios({
   method: 'POST',
   url:
    'http://127.0.0.1:8000/api/v1/users/signup',
   data: {
    email,
    name,
    password,
    passwordConfirm,
   },
  });

  if (res.data.status === 'success') {
   showAlert('success', 'Signed up succesfully');
   window.setTimeout(() => {
    location.assign('/');
   }, 1500);
  }

  console.log(res);
 } catch (error) {
  showAlert('error', error.response.data.message);
 }
};
