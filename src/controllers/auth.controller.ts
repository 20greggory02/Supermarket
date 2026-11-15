import { Request, Response } from 'express';
import { AppError, LoginUserDTO, RegisterUserDTO } from '../models/types';
import { authService } from '../services/auth.service';

export class AuthController {
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as RegisterUserDTO;
      const user = await authService.register(dto);
      res.status(201).json({
        message: 'Usuario registrado exitosamente',
        user
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error interno al registrar usuario' });
    }
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const dto = req.body as LoginUserDTO;
      const result = await authService.login(dto);
      res.status(200).json({
        message: 'Inicio de sesión exitoso',
        ...result
      });
    } catch (error) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Error interno al iniciar sesión' });
    }
  }
}

export const authController = new AuthController();
