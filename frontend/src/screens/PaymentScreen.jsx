import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Button, Col } from 'react-bootstrap';
import FormContainer from '../components/FormContainer';
import CheckoutSteps from '../components/CheckoutSteps';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { savePaymentMethod } from '../slices/cartSlice';
import { toast } from 'react-toastify';


const PaymentScreen = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const cart = useSelector((state) =>state.cart);
  console.log(cart);
  const { shippingAddress } = cart;

  useEffect(() => {
    if(!shippingAddress) {
      navigate('/shipping');
    }
  }, [shippingAddress, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();

    const buttonChecked1 = document.getElementById('Razorpay').checked;
    const buttonChecked2 = document.getElementById('PayPal').checked;
    console.log("button check", buttonChecked1, buttonChecked2);
      
    //if none of the radio buttons is checked then show error message and return to payment
    if (!buttonChecked1 && !buttonChecked2){ 
      toast.error('select one payment method to proceed!');
      return
    } 


    if(paymentMethod === 'Razorpay') {
      try {
        dispatch(savePaymentMethod(paymentMethod));
        console.log(paymentMethod);
        navigate('/placeorder');

        // console.log('inside handle payment');
        // const orderUrl = 'http://localhost:5000/api/payment/orders';
        // const { data } =  await axios.post(orderUrl, { amount: cart.totalPrice * 80 }, { timeout: 10000 })
        // // console.log(data);
        // console.log(paymentMethod);
        // initPayment(data.data);
       
      } catch (error) {
        console.log(error.message);
        console.log(error);
      }
    } else {
      dispatch(savePaymentMethod(paymentMethod));
      console.log(paymentMethod);
      navigate('/placeorder');
    }
    
}

// const submitHandler = (e) => {
//   e.preventDefault();
//   dispatch(savePaymentMethod(paymentMethod));
//   console.log(paymentMethod);
//   navigate('/placeorder');
// }

    const [ paymentMethod, setPaymentMethod ] = useState('Razorpay');

    const changePaymentMethod = (e) => {
      const paymentMethod = e.target.id;
      setPaymentMethod(paymentMethod);
      console.log(paymentMethod);
    }
    // (e) => {
    //   console.log('inside change payment method')
    //   console.log(e.target.id);
    //   setPaymentMethod(e.target.id);
    //   console.log('payment method : ',paymentMethod);
    // }

  return (
    <FormContainer>
        <CheckoutSteps step1 step2 step3 />
            <h1>Payment Method</h1>
            <Form onSubmit={ handlePayment }>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                        name="payment_method"
                        type='radio'
                        className='my-2'
                        label='Razorpay'
                        id='Razorpay' 
                        onChange={(e) =>{ changePaymentMethod(e) }}
                      ></Form.Check>
                    </Col>
                    <Col>
                        <Form.Check
                        name="payment_method"
                        type='radio'
                        className='my-2'
                        label='PayPal or Credit Card'
                        id='PayPal'  
                        onChange={(e) =>{ changePaymentMethod(e) }}
                         ></Form.Check>
                    </Col>
                    
                </Form.Group>
                <Button type='submit'>Continue</Button>
            </Form>
        
    </FormContainer>
  )
}

export default PaymentScreen