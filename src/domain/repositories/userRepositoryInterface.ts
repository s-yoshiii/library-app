import { User } from '../entities/user.js';
export interface UserRepositoryInterface {
  create(user: User): Promise<User>;
}
