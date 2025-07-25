import pkg from '@prisma/client';
import Decimal from 'decimal.js';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const getLedger = async (req, res) => {
  try {
    const purchases = await prisma.inventoryBatch.findMany({
      include: { product: true },
      orderBy: { timestamp: 'asc' }
    });

    const sales = await prisma.sale.findMany({
      include: { product: true },
      orderBy: { timestamp: 'asc' }
    });

    const ledger = [
      ...purchases.map(batch => ({
        type: 'purchase',
        product_id: batch.product_id,
        name: batch.product.name,
        quantity: batch.quantity,
        unit_price: batch.unit_price.toString(),
        timestamp: batch.timestamp
      })),
      ...sales.map(sale => ({
        type: 'sale',
        product_id: sale.product_id,
        name: sale.product.name,
        quantity: sale.quantity,
        total_cost: sale.total_cost.toString(),
        timestamp: sale.timestamp,
        details: sale.details
      }))
    ];

    ledger.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    return res.status(200).json({success:true, ledger });
  } catch (err) {
    return res.status(500).json({success:false, message: 'Server error', error: err.message });
  }
};
