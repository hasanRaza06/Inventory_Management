import express from 'express'
import { getStockOverview } from '../controller/stockController.js'
import { protect } from '../middleware/authMiddleware.js';


const router = express.Router();

router.get('/',protect, getStockOverview);

export default router;