import { pool } from '../config/database';
import { Order } from '../models/types';

export class OrderRepository {
  public async create(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    let lastInsertedId = 0;
    let createdAt = new Date();

    // Insertamos cada producto comprado en la tabla 'pedidos' según el diagrama relacional
    for (const item of orderData.items) {
      const query = `
        INSERT INTO pedidos (usuario_id, producto_id, cantidad, subtotal, estado)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, fecha_pedido
      `;
      const values = [
        orderData.userId,
        item.productId,
        item.quantity,
        item.subtotal,
        orderData.status
      ];
      const result = await pool.query(query, values);
      lastInsertedId = result.rows[0].id;
      createdAt = result.rows[0].fecha_pedido;
    }

    return {
      id: lastInsertedId,
      userId: orderData.userId,
      items: orderData.items,
      total: orderData.total,
      status: orderData.status,
      createdAt
    };
  }
}

export const orderRepository = new OrderRepository();
