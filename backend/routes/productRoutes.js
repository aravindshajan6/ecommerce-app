import express from 'express';
const router = express.Router();
// import asyncHandler from '../middleware/asyncHandler.js'; //error handler
// import Product from '../models/productModel.js';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { createProductReview } from '../controllers/productController.js';
import { getTopProducts } from '../controllers/productController.js';

router.route('/').get( getProducts ).post(protect, admin, createProduct );
router.get('/top', getTopProducts);
router.route('/:id').get( getProductById ).put(protect, admin, updateProduct ).delete( protect, admin, deleteProduct );
router.route('/:id/reviews').post( protect, createProductReview);


export default router;