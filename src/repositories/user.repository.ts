import { User } from '../models/types';

export class UserRepository {
  private users: User[] = [];

  public findByEmail(email: string): User | undefined {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public create(userData: Omit<User, 'id' | 'createdAt'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...userData,
      createdAt: new Date()
    };

    this.users.push(newUser);
    return newUser;
  }
}

export const userRepository = new UserRepository();
