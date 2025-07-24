import pkg from '@prisma/client';
import Decimal from 'decimal.js';

const { PrismaClient } = pkg;
const prisma = new PrismaClient();

export const handleEvent = async (event) => {
  const { product_id, event_type, quantity, unit_price, timestamp } = event;

  if (event_type === 'purchase') {
    return await prisma.inventoryBatch.create({
      data: {
        product_id,
        quantity,
        unit_price: new Decimal(unit_price), // must wrap in Decimal
        timestamp: new Date(timestamp),
        remaining_quantity: quantity
      }
    });
  }

  if (event_type === 'sale') {
    let remainingToSell = quantity;
    let totalCost = new Decimal(0);
    const details = [];

    const batches = await prisma.inventoryBatch.findMany({
      where: {
        product_id,
        remaining_quantity: { gt: 0 }
      },
      orderBy: { timestamp: 'asc' }
    });

    for (const batch of batches) {
      if (remainingToSell === 0) break;

      const available = batch.remaining_quantity;
      const toUse = Math.min(available, remainingToSell);

      await prisma.inventoryBatch.update({
        where: { id: batch.id },
        data: { remaining_quantity: available - toUse }
      });

      details.push({
        batch_id: batch.id,
        quantity_used: toUse,
        unit_price: batch.unit_price
      });

      totalCost = totalCost.plus(new Decimal(toUse).mul(batch.unit_price));
      remainingToSell -= toUse;
    }

    if (remainingToSell > 0) {
      throw new Error('Insufficient inventory to fulfill the sale.');
    }

    return await prisma.sale.create({
      data: {
        product_id,
        quantity,
        total_cost: totalCost,
        timestamp: new Date(timestamp),
        details
      }
    });
  }

  throw new Error('Invalid event_type');
};
