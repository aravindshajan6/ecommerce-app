import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import { Row, Col, ListGroup, Image, Card, Button } from 'react-bootstrap';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { useGetOrderDetailsQuery, usePayOrderMutation, useGetPayPalClientIdQuery, useDeliverOrderMutation } from '../slices/orderApiSlice';

import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

import { toast } from 'react-toastify';
// import asyncHandler from '../../../backend/middleware/asyncHandler';

// import { savePaymentMethod } from '../slices/cartSlice';

import axios from 'axios';

const OrderScreen = () => {

    const {id: orderId } = useParams();
    // const dispatch = useDispatch();

    const {data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    // const cart = useSelector((state) => state.cart);
    // console.log(data.isPaid);

    // const paymentMethod = cart.paymentMethod;

    // const {data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const [deliverOrder, { isLoading: loadingDeliver} ] = useDeliverOrderMutation();

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    const { data: paypal, isLoading: loadingPayPal, errpr: errorPayPal } = useGetPayPalClientIdQuery();
    
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if( !errorPayPal && !loadingPayPal && paypal.clientId ) {
            const loadPayPalScript = async () => {
                paypalDispatch({
                    type: 'resetOptions',
                    value: {
                        'client-id': paypal.clientId,
                        currency: 'USD',
                    }
                });
                paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            }
                // { console.log(order.isPaid) }
                if ( order && !order.isPaid ) {
                    if(!window.paypal) {
                        loadPayPalScript();
                    }
                }
            }
    }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal ]);

    function onApprove(data, actions) { 
        console.log("inside razorpay paid status update");
        return actions.order.capture()
                            .then( async function (details) {
                                try {
                                    await payOrder({ orderId, details });
                                    refetch(); 
                                    toast.success('Payment Successful!')
                                } catch (err) {
                                    toast.error(err?.data?.messsage || err.message);
                                }
                             })
    }


    //test for changing payment status
    async function  onApproveTest() { 
        await payOrder({ orderId, details: { payer: { } } });
        refetch(); 
        toast.success('Payment Successful!');
    }

    function onError(err) { 
        toast.error(err.message);
    }

    function createOrder(data, actions) {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId) => {
            return orderId;
        });
    }

    const deliverOrderHandler = async () => {
        try {
            console.log(orderId);
           await deliverOrder( orderId );
           refetch();
           toast.success('Order delivered !')
        } catch (err) {
            toast.error(err?.data?.message || err.message);
        }
    }

    const razorpayHandler = async (e) => {
        e.preventDefault();
        console.log(order.totalPrice);
        try {
            console.log(order.totalPrice);
            console.log('inside razorpay handler');
            const orderUrl = 'http://localhost:5000/api/payment/orders';
            const { data } =  await axios.post(orderUrl, { amount: order.totalPrice * 80 }, { timeout: 10000 })
            // console.log(data);
            console.log(order.paymentMethod);
            const initReturn = initPayment(data.data);
            console.log(initReturn);
        } catch (error) {
            console.log(error.message);
            console.log(error);
        }
        
    }

    const initPayment = (data) => {
		const options = {
			key: "rzp_test_X02DTSTjqCuvit",
			amount: data.amount,
			currency: data.currency,
			name: data.name,
			description: "Test Transaction",
			// image: cart.cartItems[0].image,
			order_id: data.id,
			handler: async (response) => {
				try {
					const verifyUrl = "http://localhost:5000/api/payment/verify";
					const { data } = await axios.post(verifyUrl, response);
					console.log(data);
				} catch (error) {
					console.log(error);
				}
			},
			theme: {
				color: "#3399cc",
			},
		};
    // create new razorpay instance using options 
		const rzp1 = new window.Razorpay(options);
        console.log("log in razorpay " ,rzp1);
		rzp1.open(); //open checkout page
	};



  return isLoading ? ( <Loader />) : ( error ? <Message variant='danger' /> : (<>
  <Row>
    <h1>Order {order._id}</h1>
    {/* {console.log('SHIPPING PRICE : ', order.shippingPrice)} */}
    <Row>
        <Col md={8}>
            <ListGroup variant='flush'>
                <ListGroup.Item>
                    <h2>Shipping</h2>
                    <p>
                        <strong>Name: </strong> {order.user.name}
                    </p>
                    <p>
                        <strong>Email: </strong> {order.user.email}
                    </p>
                    <p>
                        <strong>Address: </strong> {order.shippingAddress.address} , {order.shippingAddress.city} ,{order.shippingAddress.postalCode} , {order.shippingAddress.country} 
                    </p>
                    {/* <p>
                        <strong>Email: </strong> {order.user.email}
                    </p> */}
                    {
                        order.isDelivered ? (<Message variant='success'>Delivered on: { order.isDeliveredAt}</Message>) : (<Message variant='danger'>Not Delivered !</Message>)
                    }
                    
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Payment Method</h2>
                    <p>
                        <strong>Method: </strong>
                        {order.paymentMethod}
                    </p>
                    {order.isPaid ? (<Message variant='success'>Paid on: {order.paidAt}</Message>) : (<Message variant='danger'>Not Paid !</Message>)}
                </ListGroup.Item>
                <ListGroup.Item>
                    <h2>Order Items</h2>
                    {
                        order.orderItems.map((item, index) => (
                            <ListGroup.Item key={index}>
                                <Row>
                                    <Col md={2} >
                                        <Image src={item.image} alt={item.name} fluid rounded />
                                    </Col>
                                    <Col> 
                                        <Link to={`/product/${item.product}`}> {item.name} 
                                        </Link>
                                    </Col>
                                    <Col md={4}>
                                        {item.qty} x ${item.price} = ${item.qty * item.price}
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))
                    }
                </ListGroup.Item>
            </ListGroup>
        </Col>
        <Col md={4}>
            <Card>
                <ListGroup>
                    <ListGroup.Item>
                        <h2>Order Summary</h2>
                    </ListGroup.Item>
                    <ListGroup.Item>
                        <Row>
                            <Col>Items:</Col>
                            {/* {console.log('itemsPrice : ',order.itemsPrice)} */}

                            <Col>$ {order.itemsPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Shipping: </Col>
                            {/* {console.log('shippingPrice: ', order.shippingPrice)} */}
                            <Col>$ {order.shippingPrice}</Col>
                        </Row>
                        <Row>
                            <Col>Tax:</Col>
                            <Col>$ {order.taxPrice }</Col>
                        </Row>
                        <Row>
                            <Col>Total:</Col>
                            <Col>$ {order.totalPrice}</Col>
                        </Row>
                    </ListGroup.Item>
                    { /* {console.log(order.isPaid)}  for paypal*/ }
                    { (!order.isPaid, order.paymentMethod === 'PayPal') && (
                        console.log('paypal active') ,
                            <ListGroup.Item>
                                { loadingPay && <Loader /> }

                                { isPending ? <Loader /> : ( 
                                    <div>
                                        <Button onClick={ onApproveTest} style={{marginBottom: '10px'}}>Test Pay Order
                                        </Button>
                                        <div>
                                            <PayPalButtons 
                                            createOrder= {createOrder } onApprove= {onApprove} 
                                            onError= {onError}
                                            ></PayPalButtons>
                                        </div>
                                    </div>
                                ) }

                            </ListGroup.Item>
                        )
                    }
                    { (!order.isPaid, order.paymentMethod === 'Razorpay') && (
                        console.log('Razorpay active') ,
                            <ListGroup.Item>
                                { loadingPay && <Loader /> }

                                { isPending ? <Loader /> : ( 
                                    <div>
                                        <Button onClick={ onApproveTest} style={{marginBottom: '10px'}}>Test Pay Order
                                        </Button>
                                        <div>
                                            <Button 
                                            createOrder= {createOrder } 
                                            onApprove= {onApprove} 
                                            onError= {onError}
                                            onClick={ razorpayHandler }>pay using RazorPay</Button>
                                        </div>
                                    </div>
                                ) }

                            </ListGroup.Item>
                        )
                    }

                    {loadingDeliver && ( <Loader /> ) }

                    { userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && ( 
                        <ListGroup.Item>
                            <Button type='button' className='btn btn-block ' onClick={ deliverOrderHandler }>
                                Mark as Delivered    

                            </Button>
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </Col>
    </Row>
  </Row>
  </>));
}

export default OrderScreen;
