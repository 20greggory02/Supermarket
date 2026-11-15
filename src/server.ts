import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/index.routes';
import { testDatabaseConnection } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use('/api/v1', apiRoutes);

async function startServer() {
  await testDatabaseConnection();

  app.listen(PORT, () => {
    console.log(`Servidor corriendo en: http://localhost:${PORT}`);
    console.log(`API REST disponible en: http://localhost:${PORT}/api/v1/products`);
  });
}

startServer();
