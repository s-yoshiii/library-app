import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@/generated/prisma/client.js';
import type { Book } from '@/generated/prisma/client.js';

export class PrismaBookRepository {
  private prisma: PrismaClient;

  constructor() {
    const adapter = new PrismaLibSql({
      url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db',
    });
    this.prisma = new PrismaClient({ adapter });
  }

  async create(title: string): Promise<Book> {
    return await this.prisma.book.create({
      data: {
        title,
        isAvailable: true,
      },
    });
  }
  async findById(id: string): Promise<Book | null> {
    return await this.prisma.book.findUnique({
      where: {
        id,
      },
    });
  }
}
