import { apiSlice } from './apiSlice';
import { RAZORPAY_URL } from '../constants';

export const paymentApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
      createPaymentOrder: builder.mutation({
        query: (amount) => ({
          url: `${RAZORPAY_URL}/orders`,
          method: 'POST',
          body: { amount },
        }),
      }),
      verifyPayment: builder.mutation({
        query: (response) => ({
          url: `${RAZORPAY_URL}/verify`,
          method: 'POST',
          body: response,
        }),
      }),
    })
})
export const { useCreatePaymentOrderMutation,
    useVerifyPaymentMutation} = paymentApiSlice ;