import { Pool } from 'pg';

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'stockflow_user',
  password: process.env.DB_PASSWORD || 'stockflow_pass',
  database: process.env.DB_NAME || 'stockflow_db'
});

export async function testDatabaseConnection(): Promise<void> {
  try {
    const client = await pool.connect();
    console.log('Conectado exitosamente a PostgreSQL (Docker)');
    client.release();
  } catch (error) {
    console.error('Error al conectar con PostgreSQL:', error);
    process.exit(1);
  }
}
