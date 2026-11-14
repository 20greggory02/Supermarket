import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/index.routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (public/)
app.use(express.static(path.join(__dirname, '../public')));

// Montar todas las rutas de la API REST bajo /api/v1
app.use('/api/v1', apiRoutes);

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor StockFlow (Arquitectura en Capas) en: http://localhost:${PORT}`);
  console.log(`API REST disponible en: http://localhost:${PORT}/api/v1/products`);
});
