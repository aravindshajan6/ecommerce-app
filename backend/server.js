import express from 'express';
const app = express();
import cors from 'cors';

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
//     next();
//   });

//body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(cors());

//cookie-parser middleware
import cookieParser from 'cookie-parser';
app.use(cookieParser());


import dotenv from 'dotenv'; //for environment variables
dotenv.config();
import connectDB from './config/db.js';
import path from 'path';
const port = process.env.PORT || 5000; //PORT

import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes  from './routes/uploadRoutes.js'
import paymentRoutes from './routes/razorpayRoutes.js'; //rzp

import { notFound, errorHandler } from './middleware/errorMiddleware.js';

connectDB(); //invoking mongoDB connection

app.get('/' , (req, res) => {
    res.send('API is running');
});

// app.post('/api/payment/orders', (req, res) => {
//     try {
//         console.log('create order API');
//         //create Razorpay Instance
//         const instance = new Razorpay({
//             key_id: process.env.KEY_ID || 'rzp_test_X02DTSTjqCuvit',
//             key_secret: process.env.KEY_SECRET || 'GxokSGUvwTr01eyRF1XKxDGz'
//         });

//         // options object with amount, currency and receipt
//         const options = {
//             // amount: req.body.amount * 100,
//             amount: 50000,
//             currency: 'INR',
//             receipt: crypto.randomBytes(10).toString('hex'), // create random string
//         };

//         console.log(options);


//         //create order using instance and options object
//         instance.orders.create(options, (error, order) => {
//             if(error) {
//                 console.log(error);
//                 return res.status(500).json({ message : 'Something went wrong XXXX!'})
//             }
//             res.status(200).json({ data: order });
//             console.log(data.data);
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ message : 'Internal server error' || 'something not working'})

//     }

// });

// app.post('/api/payment/verify', (req, res) => {
//     try {
//         const {
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature 
//         } = req.body;

//         // console.log(razorpay_order_id,
//         //     razorpay_payment_id,
//         //     razorpay_signature )

//         //combine order id and payment id 
//         const sign = razorpay_order_id + "|" + razorpay_payment_id;

//         //decrypt payment signature done in backend
//         const expectedSign = crypto
//             .createHmac('sha256', process.env.KEY_SECRET)
//             .update(sign.toString())
//             .digest('hex');

//             if(razorpay_signature === expectedSign) {
//                 return res.status(200).json({ message: "payment verified successfully"})
//             } else {
//                 return res.status(400).json({ message: 'Invalid signature sent !'})
//             }
//     }catch (error) {
//         console.log(error);
//         res.status(500).json({ message: 'Internal server error !'});
//     }
// })

app.use('/api/payment', paymentRoutes); //rzp
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))
app.use('/api/upload', uploadRoutes);

const __dirname = path.resolve(); //set __dirname to curr directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});