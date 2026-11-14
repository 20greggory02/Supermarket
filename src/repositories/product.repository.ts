import { Product } from '../models/types';

export class ProductRepository {
  private products: Product[] = [
    {
      id: 1,
      name: 'Galletas Spider-Man Halloween x4',
      category: 'Combos',
      price: 15000,
      stock: 20,
      img: 'img/galletas-spiderman.jpg'
    },
    {
      id: 2,
      name: 'Arroz Roa x 500g',
      category: 'Abarrotes',
      price: 2400,
      stock: 150,
      img: 'img/arroz-roa.jpg'
    },
    {
      id: 3,
      name: 'Aceite Premier 1L',
      category: 'Abarrotes',
      price: 9800,
      stock: 85,
      img: 'img/aceite-premier.jpg'
    },
    {
      id: 4,
      name: 'Leche Alquería x 1L',
      category: 'Lácteos',
      price: 4100,
      stock: 300,
      img: 'img/leche-alqueria.jpg'
    },
    {
      id: 5,
      name: 'Café Sello Rojo 500g',
      category: 'Abarrotes',
      price: 14500,
      stock: 12,
      img: 'img/cafe-sello-rojo.jpg'
    },
    {
      id: 6,
      name: 'Gaseosa Coca-Cola 1.5L',
      category: 'Bebidas',
      price: 5200,
      stock: 90,
      img: 'img/coca-cola.jpg'
    }
  ];

  public findAll(): Product[] {
    return [...this.products];
  }

  public findById(id: number): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public create(productData: Omit<Product, 'id'>): Product {
    const nextId =
      this.products.length > 0 ? Math.max(...this.products.map((p) => p.id)) + 1 : 1;

    const newProduct: Product = {
      id: nextId,
      ...productData
    };

    this.products.push(newProduct);
    return newProduct;
  }

  public updateStock(id: number, quantityToSubtract: number): void {
    const product = this.findById(id);
    if (product) {
      product.stock -= quantityToSubtract;
    }
  }
}

export const productRepository = new ProductRepository();
