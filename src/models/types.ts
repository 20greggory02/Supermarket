export class AppError extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode: number = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// ENTIDADES / MODELOS
export type Category = 'Abarrotes' | 'Lácteos' | 'Bebidas' | 'Combos';

export interface Product {
  id: number;
  name: string;
  category: Category;
  price: number;
  stock: number;
  img: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: number;
  userId: number | null;
  items: OrderItem[];
  total: number;
  status: 'CONFIRMADO' | 'CANCELADO';
  createdAt: Date;
}

// Data Transfer Objects
export interface CreateProductDTO {
  name: string;
  category: Category;
  price: number;
  stock: number;
  img?: string;
}

export interface RegisterUserDTO {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}

export interface CreateOrderDTO {
  userId?: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
