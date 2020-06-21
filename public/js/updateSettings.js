import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'passowrd' or 'data'
export const updateUserAccount = async (
 data,
 type
) => {
 try {
  const res = await axios({
   url: `http://127.0.0.1:8000/api/v1/users/${
    type === 'password'
     ? 'updateMyPassword'
     : 'updateMe'
   }`,
   method: 'PATCH',
   data,
  });

  if (res.data.status === 'success') {
   showAlert(
    'success',
    `Updated your account ${type} successfully`
   );
   //  window.setTimeout((_) => {
   //   location.assign('/me');
   //  }, 1500);
  }
 } catch (error) {
  showAlert('error', error.response.data.message);
 }
};
