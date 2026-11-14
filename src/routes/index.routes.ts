import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authController } from '../controllers/auth.controller';
import { orderController } from '../controllers/order.controller';

const router = Router();

// Rutas de Productos
router.get('/products', (req, res) => productController.getAll(req, res));
router.get('/products/:id', (req, res) => productController.getById(req, res));
router.post('/products', (req, res) => productController.create(req, res));

// Rutas de Autenticación
router.post('/auth/register', (req, res) => authController.register(req, res));
router.post('/auth/login', (req, res) => authController.login(req, res));

// Rutas de Pedidos
router.post('/orders', (req, res) => orderController.create(req, res));

export default router;
