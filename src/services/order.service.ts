import { AppError, CreateOrderDTO, Order, OrderItem } from '../models/types';
import { orderRepository } from '../repositories/order.repository';
import { productRepository } from '../repositories/product.repository';

export class OrderService {
  public createOrder(dto: CreateOrderDTO): Order {
    const { userId, items } = dto;

    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new AppError('El pedido debe contener al menos un producto', 400);
    }

    const orderItems: OrderItem[] = [];
    let totalOrder = 0;

    // 1. Validar stock disponible de todos los productos antes de descontar
    for (const item of items) {
      if (!item.productId || typeof item.quantity !== 'number' || item.quantity <= 0) {
        throw new AppError('Cada ítem debe tener un productId válido y cantidad > 0', 400);
      }

      const product = productRepository.findById(item.productId);
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

    // 2. Descontar inventario en el repositorio
    for (const item of items) {
      productRepository.updateStock(item.productId, item.quantity);
    }

    // 3. Guardar y devolver la orden confirmada
    return orderRepository.create({
      userId: userId || null,
      items: orderItems,
      total: totalOrder,
      status: 'CONFIRMADO'
    });
  }
}

export const orderService = new OrderService();
