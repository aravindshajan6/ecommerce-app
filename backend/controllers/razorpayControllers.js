import asyncHandler from '../middleware/asyncHandler.js'; //error handler
// import Order from '../models/orderModel.js';  
import Razorpay from 'razorpay';
import crypto from 'crypto';
// import { randomBytes, createHmac } from 'crypto';
// import  usePayOrderMutation  from '../../frontend/src/slices/orderApiSlice';


//@desc create orders (rzp)
//@route POST /api/payment/orders
//@access Private
const razorpayPayment = asyncHandler( async (req, res) => {
    
    //get orderId as return
    try {
        //create Razorpay Instance
        const instance = new Razorpay({
            key_id: process.env.KEY_ID || 'rzp_test_X02DTSTjqCuvit',
            key_secret: process.env.KEY_SECRET || 'GxokSGUvwTr01eyRF1XKxDGz'
        });

        // options object with amount, currency and receipt
        const options = {
            // amount: req.body.amount * 100,
            amount: req.body.amount * 100,
            currency: 'INR',
            receipt: crypto.randomBytes(10).toString('hex'), // create random string
        };

        console.log("options : ", options);


        //create order using instance and options object
        instance.orders.create(options, (error, order) => {
            if(error) {
                console.log(error.message);
                return res.status(500).json({ message : 'Something went wrong XXXX!'})
            }  

                res.status(200).json({ data: order });
                console.log("Order details : ", order);
            
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message : 'Internal server error' })

    }

} );


//@desc create orders (rzp)
//@route POST /api/payment/orders
//@access Private
const razorpayVerify = asyncHandler( (req, res) => {
    try {
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature 
            } = req.body;

            // console.log(razorpay_order_id,
            //     razorpay_payment_id,
            //     razorpay_signature )

            //combine order id and payment id 
            const sign = razorpay_order_id + "|" + razorpay_payment_id;
            console.log('order ID : ', razorpay_order_id);
            console.log('payment ID : ', razorpay_payment_id);
            console.log('sign : ', sign);

            //decrypt payment signature done in backend
            const expectedSign = crypto
                .createHmac('sha256', process.env.KEY_SECRET)
                .update(sign.toString())
                .digest('hex');
            
                console.log('expected sign : ', expectedSign);
                console.log('signature : ', razorpay_signature);

                if( razorpay_signature === expectedSign) {
                    return res.status(200).json({ message: "RZP payment verified successfully"})
                        //code to update payment

                    
                } else {
                    return res.status(400).json({ message: 'Invalid signature sent !'})
                }
    }catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error !'});
    }
});

export {
    razorpayPayment, razorpayVerify
}
