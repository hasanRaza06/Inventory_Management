import express from 'express';
import cors from 'cors';

import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoute.js"
import simulatorRoutes from './routes/simulatorRoute.js';
import stockRoutes from './routes/stockRoutes.js';
import ledgerRoutes from './routes/ledgerRoutes.js';
//import transactionRoutes from './routes/transactionRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/simulate', simulatorRoutes);
app.use('/api/stock-overview', stockRoutes);
app.use('/api/ledger', ledgerRoutes);
//app.use('/api/transactions', transactionRoutes);

export default app;
