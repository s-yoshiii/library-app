import { User } from '../entities/user.js';
export interface UserRepositoryInterface {
  create(user: User): Promise<User>;
  findById(id: string): Promise<User | null>;
  // Add other methods as needed.
}
