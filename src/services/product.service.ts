import { AppError, Category, CreateProductDTO, Product } from '../models/types';
import { productRepository } from '../repositories/product.repository';

export class ProductService {
  public async getProducts(category?: string, search?: string): Promise<Product[]> {
    return await productRepository.findAll(category, search);
  }

  public async getProductById(id: number): Promise<Product> {
    if (isNaN(id)) {
      throw new AppError('El ID del producto debe ser un número válido', 400);
    }

    const product = await productRepository.findById(id);
    if (!product) {
      throw new AppError(`Producto con ID ${id} no encontrado`, 404);
    }

    return product;
  }

  public async createProduct(dto: CreateProductDTO): Promise<Product> {
    const validCategories: Category[] = ['Abarrotes', 'Lácteos', 'Bebidas', 'Combos'];

    if (!dto.name || typeof dto.name !== 'string' || dto.name.trim().length < 2) {
      throw new AppError('El nombre del producto es obligatorio (mínimo 2 caracteres)', 400);
    }

    if (!validCategories.includes(dto.category)) {
      throw new AppError(
        `Categoría inválida. Debe ser una de: ${validCategories.join(', ')}`,
        400
      );
    }

    if (typeof dto.price !== 'number' || dto.price <= 0) {
      throw new AppError('El precio debe ser un número mayor a 0', 400);
    }

    if (typeof dto.stock !== 'number' || dto.stock < 0) {
      throw new AppError('El stock debe ser un número mayor o igual a 0', 400);
    }

    return await productRepository.create({
      name: dto.name.trim(),
      description: dto.description || '',
      category: dto.category,
      price: dto.price,
      stock: dto.stock,
      img: dto.img || 'img/default-product.jpg'
    });
  }
}

export const productService = new ProductService();
