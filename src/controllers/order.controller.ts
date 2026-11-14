import { Request, Response } from 'express';
import { AppError, CreateOrderDTO } from '../models/types';
import { orderService } from '../services/order.service';

export class OrderController {
  public create(req: Request, res: Response): void {
    try {
      const dto = req.body as CreateOrderDTO;
      const order = orderService.createOrder(dto);
      res.status(201).json({
        message: '¡Pedido confirmado! Enviado a bodega para su preparación.',
        order
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error interno al procesar el pedido' });
    }
  }
}

export const orderController = new OrderController();
