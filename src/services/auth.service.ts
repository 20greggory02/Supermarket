import { AppError, LoginUserDTO, RegisterUserDTO } from '../models/types';
import { userRepository } from '../repositories/user.repository';

export class AuthService {
  public register(dto: RegisterUserDTO) {
    const { name, email, password, confirmPassword } = dto;

    if (!name || !email || !password || !confirmPassword) {
      throw new AppError('Todos los campos son obligatorios', 400);
    }

    if (!email.includes('@')) {
      throw new AppError('El formato del correo electrónico no es válido', 400);
    }

    if (password.length < 4) {
      throw new AppError('La contraseña debe tener al menos 4 caracteres', 400);
    }

    if (password !== confirmPassword) {
      throw new AppError('Las contraseñas no coinciden', 400);
    }

    const existingUser = userRepository.findByEmail(email.trim());
    if (existingUser) {
      throw new AppError('Este correo ya se encuentra registrado', 400);
    }

    const createdUser = userRepository.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password
    });

    // Retornamos sin la contraseña por seguridad
    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      createdAt: createdUser.createdAt
    };
  }

  public login(dto: LoginUserDTO) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new AppError('Debes ingresar correo y contraseña', 400);
    }

    const user = userRepository.findByEmail(email.trim());
    if (!user || user.password !== password) {
      throw new AppError('Correo o contraseña incorrectos', 401);
    }

    const token = `stockflow-token-${user.id}-${Date.now()}`;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }
}

export const authService = new AuthService();
