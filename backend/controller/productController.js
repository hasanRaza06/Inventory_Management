import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

export const createProduct = async (req, res) => {
  try {
    const { name } = req.body;

    const count = await prisma.product.count();

    const product_id = `PRD${String(count + 1).padStart(3, '0')}`;

    const product = await prisma.product.create({
      data: { product_id, name },
    });

    return res.status(201).json({success:true, message: 'Product created', product });
  } catch (err) {
    return res.status(500).json({success:false, message: 'Server error', error: err.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json({success:true, products , message: 'Products Fetched Successfully' });
  } catch (err) {
    return res.status(500).json({success:false, message: 'Server error', error: err.message });
  }
};
