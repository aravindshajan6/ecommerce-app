import express from 'express';
const router = express.Router();
// import Razorpay from 'razorpay';
// import crypto from 'crypto';
// import { randomBytes, createHmac } from 'crypto';

import { razorpayPayment, razorpayVerify } from '../controllers/razorpayControllers.js';
import { protect, admin } from '../middleware/authMiddleware.js';


router.post('/orders',  razorpayPayment);
router.post('/verify', razorpayVerify);

export default router;





//create orders 
// router.post('/orders', async (req, res) => {
//     //get orderId as return
//     try {
//         //create Razorpay Instance
//         const instance = new Razorpay({
//             key_id: process.env.KEY_ID || 'rzp_test_X02DTSTjqCuvit',
//             key_secret: process.env.KEY_SECRET || 'GxokSGUvwTr01eyRF1XKxDGz'
//         });

//         // options object with amount, currency and receipt
//         const options = {
//             // amount: req.body.amount * 100,
//             amount: req.body.amount * 100,
//             currency: 'INR',
//             receipt: crypto.randomBytes(10).toString('hex'), // create random string
//         };

//         console.log("options : ", options);


//         //create order using instance and options object
//         instance.orders.create(options, (error, order) => {
//             if(error) {
//                 console.log(error.message);
//                 return res.status(500).json({ message : 'Something went wrong XXXX!'})
//             }  

//                 res.status(200).json({ data: order });
//                 console.log("Order details : ",order);
            
//         });
//     } catch (error) {
//         console.log(error.message);
//         return res.status(500).json({ message : 'Internal server error' })

//     }
//     // res.json({ message: 'helloooooo'});
// })

//payment verify
// router.post('/verify', async (req, res) => {
//     try {
//             const {
//                 razorpay_order_id,
//                 razorpay_payment_id,
//                 razorpay_signature 
//             } = req.body;

//             // console.log(razorpay_order_id,
//             //     razorpay_payment_id,
//             //     razorpay_signature )

//             //combine order id and payment id 
//             const sign = razorpay_order_id + "|" + razorpay_payment_id;

//             //decrypt payment signature done in backend
//             const expectedSign = crypto
//                 .createHmac('sha256', process.env.KEY_SECRET)
//                 .update(sign.toString())
//                 .digest('hex');

//                 if(razorpay_signature === expectedSign) {
//                     return res.status(200).json({ message: "payment verified successfully"})
//                 } else {
//                     return res.status(400).json({ message: 'Invalid signature sent !'})
//                 }
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal server error !'});
//     }
// })


