import { createSlice } from "@reduxjs/toolkit"; 
//createApiSlice is not required cuz we don't have async end points
import { updateCart} from '../utils/cartUtils'

//get cart items if any from localStorage
const initialState = localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : {cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal' };

// console.log(localStorage.getItem('cart'));

const cartSlice = createSlice({
    name: 'cart',
    initialState, //get the cart items if any from localStorage and add to state
    reducers: {
        addToCart: (state, action) => {
            //item to be added to cart
            const item = action.payload;
            //check to see if item is already in cart
            const existItem = state.cartItems.find((x) => x._id === item._id );

            if (existItem) {
                state.cartItems = state.cartItems.map((x) => x._id === existItem._id ? item : x);
            } else {
                state.cartItems = [...state.cartItems, item];
            }
            
            return updateCart(state);
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((x) => x._id !==action.payload);

            return updateCart(state);
        },
        saveShippingAddress : (state, action) => {
            state.shippingAddress = action.payload;
            return updateCart(state);
        },
        savePaymentMethod : (state, action ) => {
            state.paymentMethod = action.payload;
            return updateCart(state);
        },
        clearCartItems: (state, action) => {
            state.cartItems = [];
            return updateCart(state);
        }
    },
});

export const {addToCart, removeFromCart, clearCartItems, saveShippingAddress, savePaymentMethod } = cartSlice.actions;

export default cartSlice.reducer;