import express from 'express';
const app = express();
import cors from 'cors';


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


app.use('/api/payment', paymentRoutes); //rzp
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.get('/api/config/paypal', (req, res) => res.send({ clientId: process.env.PAYPAL_CLIENT_ID }))
app.use('/api/upload', uploadRoutes);

if(process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    //set static folder
    app.use(express.static(path.join(__dirname, '/frontend/build')));

    //any route thats not an API will be redirected to in index.html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    })
} else {
    app.get('/' , (req, res) => {
        res.send('API is running');
    });
    
}


const __dirname = path.resolve(); //set __dirname to curr directory
app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); //make static

app.use(notFound);
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});