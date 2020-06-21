import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
 try {
  const stripe = Stripe(
   'pk_test_51GwLqZFXNPheHUOwThtSCsBq1RdAIFDbNkiY3Y6EzBpZ9VgTpqaccoGhv065a3s2GGPwe6TqmWt0nmnWagtvjVSR00BzvBnT4r'
  );
  // 1) Get the checkout session from API
  const session = await axios(
   `http://127.0.0.1:8000/api/v1/bookings/checkout-session/${tourId}`
  );

  console.log(session);
  // 2) Create checkout form + charge credit card
  await stripe.redirectToCheckout({
   sessionId: session.data.session.id,
  });
 } catch (error) {
  console.log(error);
  showAlert('error', error);
 }
};
