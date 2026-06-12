import type { PrismaClient } from '@/generated/prisma/client.js';
import { User } from '@/domain/entities/user.js';
import type { UserRepositoryInterface } from '@/domain/repositories/userRepositoryInterface.js';

export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(_user: User): Promise<User> {
    throw new Error('Not implemented');
  }

  async findById(_id: string): Promise<User | null> {
    throw new Error('Not implemented');
  }
}
