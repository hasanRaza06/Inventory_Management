import pkg from '@prisma/client';
import Decimal from 'decimal.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const getStockOverview = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        batches: true 
      }
    });

    const overview = products.map(product => {
      let totalQty = 0;
      let totalValue = new Decimal(0);

      for (const batch of product.batches) {
        const qty = batch.remaining_quantity;
        const price = new Decimal(batch.unit_price);

        totalQty += qty;
        totalValue = totalValue.plus(price.mul(qty));
      }

      return {
        product_id: product.product_id,
        name: product.name,
        total_quantity_available: totalQty,
        total_stock_value: totalValue.toFixed(2),
        batch_count: product.batches.length
      };
    });

    return res.status(200).json({success:true, overview });
  } catch (err) {
    res.status(500).json({success:false, message: 'Server error', error: err.message });
  }
};
