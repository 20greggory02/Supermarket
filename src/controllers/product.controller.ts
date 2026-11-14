import { Request, Response } from 'express';
import { AppError, CreateProductDTO } from '../models/types';
import { productService } from '../services/product.service';

export class ProductController {
  public getAll(req: Request, res: Response): void {
    try {
      const category = typeof req.query.category === 'string' ? req.query.category : undefined;
      const search = typeof req.query.search === 'string' ? req.query.search : undefined;

      const products = productService.getProducts(category, search);
      res.status(200).json({ total: products.length, products });
    } catch (error) {
      res.status(500).json({ error: 'Error interno al obtener los productos' });
    }
  }

  public getById(req: Request, res: Response): void {
    try {
      const id = Number(req.params.id);
      const product = productService.getProductById(id);
      res.status(200).json(product);
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  public create(req: Request, res: Response): void {
    try {
      const dto = req.body as CreateProductDTO;
      const newProduct = productService.createProduct(dto);
      res.status(201).json({
        message: 'Producto creado exitosamente',
        product: newProduct
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error interno al crear el producto' });
    }
  }
}

export const productController = new ProductController();
