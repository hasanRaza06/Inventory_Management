import pool from '../config/db.js';

export const createProduct = async ({ product_id, name }) => {
  const query = `
    INSERT INTO products (product_id, name)
    VALUES ($1, $2)
    ON CONFLICT (product_id) DO NOTHING
    RETURNING *;
  `;
  const values = [product_id, name];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const getProductById = async (product_id) => {
  const query = `SELECT * FROM products WHERE product_id = $1`;
  const result = await pool.query(query, [product_id]);
  return result.rows[0];
};
