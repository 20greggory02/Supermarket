import { Order } from '../models/types';

export class OrderRepository {
  private orders: Order[] = [];

  public create(orderData: Omit<Order, 'id' | 'createdAt'>): Order {
    const newOrder: Order = {
      id: 100 + this.orders.length + 1,
      ...orderData,
      createdAt: new Date()
    };

    this.orders.push(newOrder);
    return newOrder;
  }
}

export const orderRepository = new OrderRepository();
