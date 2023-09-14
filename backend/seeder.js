//run using script 

import mongoose from "mongoose";
import dotenv from 'dotenv';
import colors from 'colors';
import users from './data/users.js'; //users data
import products from "./data/products.js"; //products data
import User from './models/userModel.js'; //bcz we add user to db through user model
import Product from './models/productModel.js'; 
import Order from './models/orderModel.js'; //for wiping db clean
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

//import data to DB
const importData = async() => {
    try {
            //delete all data in models before inserting data
            await Order.deleteMany(); 
            await Product.deleteMany();
            await User.deleteMany();

            //for inserting initial user values
            const createdUsers = await User.insertMany(users);
        
            //for getting admin user id
            const adminUser = createdUsers[0]._id;

            //for inserting products with admin userId
            const sampleProducts = products.map((product) => {
            return{ ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data imported!'.green.inverse);
        process.exit();

    } catch (error) {
        console.log(`${error}`.red.inverse);
        process.exit(1);
    }
}

//destroy data in DB
const destroyData = async () => {
        try {
                //delete all data in models before inserting data
                await Order.deleteMany(); 
                await Product.deleteMany();
                await User.deleteMany();
                console.log('Data destroyed!'.red.inverse);
                process.exit();

        } catch (error) {
            console.error(`$(error)`.red.inverse);
            process.exit(1);
        }
    }

//destroy data in Orders
const destroyOrdersData = async () => {
    try {
        await Order.deleteMany(); 
        console.log('Order data destroyed !'.green.inverse);
        process.exit();
    } catch ( error ) {
        console.error(`${error.message}`.red.inverse);
        process.exit(1);
    }
}


// if( process.env[2] === '-od') { //-od for invoking deletion of orders collection
//     destroyOrdersData();
// }

// console.log(process.argv); this gives us arguments passed, index 0,1 are paths
if ( process.argv[2] === '-d' ) { //-d for invoking destroy function
    destroyData();
} else if (process.argv[2] === '-i' ){
    importData();
} else {
    destroyOrdersData();
}

 