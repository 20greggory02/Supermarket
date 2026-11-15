import { AppError, LoginUserDTO, RegisterUserDTO } from '../models/types';
import { userRepository } from '../repositories/user.repository';

export class AuthService {
  public async register(dto: RegisterUserDTO) {
    const { name, email, password, confirmPassword, phone, address } = dto;

    if (!name || !email || !password || !confirmPassword || !phone || !address) {
      throw new AppError(
        'Todos los campos son obligatorios (nombre, correo, contraseña, teléfono y dirección)',
        400
      );
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

    const existingUser = await userRepository.findByEmail(email.trim());
    if (existingUser) {
      throw new AppError('Este correo ya se encuentra registrado', 400);
    }

    const createdUser = await userRepository.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone: phone.trim(),
      address: address.trim()
    });

    return {
      id: createdUser.id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone,
      address: createdUser.address,
      createdAt: createdUser.createdAt
    };
  }

  public async login(dto: LoginUserDTO) {
    const { email, password } = dto;

    if (!email || !password) {
      throw new AppError('Debes ingresar correo y contraseña', 400);
    }

    const user = await userRepository.findByEmail(email.trim());
    if (!user || user.password !== password) {
      throw new AppError('Correo o contraseña incorrectos', 401);
    }

    const token = `stockflow-token-${user.id}-${Date.now()}`;

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address
      }
    };
  }
}

export const authService = new AuthService();
