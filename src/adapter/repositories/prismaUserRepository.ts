import type { PrismaClient } from '@/generated/prisma/client.js';
import { User } from '@/domain/entities/user.js';
import type { UserRepositoryInterface } from '@/domain/repositories/userRepositoryInterface.js';

export class PrismaUserRepository implements UserRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(user: User): Promise<User> {
    const createUser = await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
    return new User(createUser.id, createUser.email, createUser.createdAt, createUser.updatedAt);
  }

  // async findById(_id: string): Promise<User | null> {
  //   throw new Error('Not implemented');
  // }
}
