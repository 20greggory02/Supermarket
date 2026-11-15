import { pool } from '../config/database';
import { Product } from '../models/types';

export class ProductRepository {
  public async findAll(category?: string, search?: string): Promise<Product[]> {
    const conditions: string[] = [];
    const values: any[] = [];

    if (category && category.trim() !== '' && category !== 'Todos') {
      values.push(category.trim());
      conditions.push(`LOWER(categoria) = LOWER($${values.length})`);
    }

    if (search && search.trim() !== '') {
      values.push(`%${search.trim()}%`);
      conditions.push(`nombre ILIKE $${values.length}`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const query = `
      SELECT id, nombre AS name, descripcion AS description, categoria AS category,
             precio::float AS price, stock, imagen AS img
      FROM productos
      ${whereClause}
      ORDER BY id ASC
    `;

    const result = await pool.query(query, values);
    return result.rows;
  }

  public async findById(id: number): Promise<Product | undefined> {
    const query = `
      SELECT id, nombre AS name, descripcion AS description, categoria AS category,
             precio::float AS price, stock, imagen AS img
      FROM productos
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  public async create(productData: Omit<Product, 'id'>): Promise<Product> {
    const query = `
      INSERT INTO productos (nombre, descripcion, categoria, precio, stock, imagen)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, nombre AS name, descripcion AS description, categoria AS category,
                precio::float AS price, stock, imagen AS img
    `;
    const values = [
      productData.name,
      productData.description || '',
      productData.category,
      productData.price,
      productData.stock,
      productData.img
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  public async updateStock(id: number, quantityToSubtract: number): Promise<void> {
    const query = `UPDATE productos SET stock = stock - $1 WHERE id = $2`;
    await pool.query(query, [quantityToSubtract, id]);
  }
}

export const productRepository = new ProductRepository();
