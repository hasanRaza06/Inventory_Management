import express from 'express';
import { getLedger } from '../controller/ledgerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/',protect, getLedger);

export default router;
