import express from 'express';
import {createProduct,getAllProducts} from '../controller/productController.js'
import { protect } from '../middleware/authMiddleware.js';

const router=express.Router();

router.post("/create",protect,createProduct);
router.get("/all",protect,getAllProducts);

export default router;