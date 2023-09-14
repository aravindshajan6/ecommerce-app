import asyncHandler from '../middleware/asyncHandler.js'; //error handler
import Order from '../models/orderModel.js';  

//@desc create a new order
//@route POST /api/orders
//@access Private
const addOrderItems = asyncHandler( async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if(orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        console.log("inside order");
        const order = new Order({
            orderItems: orderItems.map((x) => ({
                ...x,
                product: x._id,
                _id: undefined,
            })),
            user: req.user._id,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        }) ;

        const createOrder = await order.save();
        console.log('order saved');
        res.status(201).json(createOrder);
    }
    
} );


//@desc Get logged users order
//@route GET /api/orders/mine
//@access Private
const getMyOrders = asyncHandler( async (req, res) => {
    const orders = await Order.find({ user: req.user._id});
    res.status(200).json(orders);
} );

//@desc get order by ID
//@route GET /api/orders/:id
//@access Private/Admin
const getOrderById = asyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if(order ) {
        res.status(200).json(order);
    } else {
        res.status(404)
        throw new Error('Order not found!');
    }
} );

//@desc Update order to paid
//@route PUT /api/orders/:id/pay
//@access Private
const updateOrderToPaid = asyncHandler( async (req, res) => {
    
    const order = await Order.findById(req.params.id);

    if( order ) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };
        console.log('Order ID : ',order.paymentResult.id,"DetailsPay : ", order.paymentResult)

        const updateOrder = await order.save();
        res.status(200).json( updateOrder );

    } else {

        res.status(404);
        throw new Error('Order not found !');
        
    }
} );

//@desc Update order to delivered
//@route PUT /api/orders/:id/deliver
//@access Private/Admin
const updateOrderToDelivered = asyncHandler( async (req, res) => {
    // console.log('update Order To Delivered');

    const order = await Order.findById(req.params.id);
    // console.log(req.params.id);

    if ( order ) { 
        order.isDelivered = true;
        order.isDeliveredAt = Date.now();

        const updateOrder = await order.save();

        res.status(200).json( updateOrder );
    } else {
        res.status(404);
        throw new Error ( 'Order not found !');
    }

} );

//@desc get all Orders
//@route GET /api/orders/
//@access Private/Admin
const getOrders= asyncHandler( async (req, res) => {
    // res.send('get all orders');
    const orders = await Order.find({  }).populate('user', 'id name');
    res.status(200).json(orders);
} );


export {
    addOrderItems,
    getMyOrders,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getOrders
}


