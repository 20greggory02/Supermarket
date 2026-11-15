import { pool } from '../config/database';
import { User } from '../models/types';

export class UserRepository {
  public async findByEmail(email: string): Promise<User | undefined> {
    const query = `
      SELECT id, nombre AS name, email, contrasena AS password,
             telefono AS phone, direccion AS address, fecha_registro AS "createdAt"
      FROM usuarios
      WHERE LOWER(email) = LOWER($1)
    `;
    const result = await pool.query(query, [email]);
    return result.rows[0];
  }

  public async create(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const query = `
      INSERT INTO usuarios (nombre, email, contrasena, telefono, direccion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, nombre AS name, email, contrasena AS password,
                telefono AS phone, direccion AS address, fecha_registro AS "createdAt"
    `;
    const values = [
      userData.name,
      userData.email,
      userData.password,
      userData.phone,
      userData.address
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

export const userRepository = new UserRepository();
