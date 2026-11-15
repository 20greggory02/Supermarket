import { AppError, CreateOrderDTO, Order, OrderItem } from '../models/types';
import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';

export class OrderService {
  public async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const { userId, items } = dto;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('El pedido debe contener al menos un producto', 400);
    }

    const orderItems: OrderItem[] = [];
    let totalOrder = 0;

    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new AppError('Cada ítem debe tener un productId válido y cantidad > 0', 400);
      }

      const product = await productRepository.findById(item.productId);
      if (!product) {
        throw new AppError(`Producto con ID ${item.productId} no existe`, 404);
      }

      if (product.stock < item.quantity) {
        throw new AppError(
          `Stock insuficiente para "${product.name}". Disponible: ${product.stock} uds`,
          400
        );
      }

      const subtotal = product.price * item.quantity;
      totalOrder += subtotal;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal
      });
    }

    for (const item of items) {
      await productRepository.updateStock(item.productId, item.quantity);
    }

    return await orderRepository.create({
      userId: userId || null,
      items: orderItems,
      total: totalOrder,
      status: 'CONFIRMADO'
    });
  }
}

export const orderService = new OrderService();
