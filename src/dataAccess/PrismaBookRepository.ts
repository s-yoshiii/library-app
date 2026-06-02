import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '@/generated/prisma/client.js';
import { Book } from '../domain/entities/book.js';
import type { BookRepositoryInterface } from '../domain/repositories/BookRepositoryInterface.js';

export class PrismaBookRepository implements BookRepositoryInterface {
  private prisma: PrismaClient;

  constructor() {
    const adapter = new PrismaLibSql({
      url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db',
    });
    this.prisma = new PrismaClient({ adapter });
  }

  async create(title: string): Promise<Book> {
    const row = await this.prisma.book.create({
      data: { title, isAvailable: true },
    });
    return new Book(row.id, row.title, row.isAvailable, row.createdAt, row.upDatedAt);
  }

  async findById(id: string): Promise<Book | null> {
    const row = await this.prisma.book.findUnique({ where: { id } });
    if (!row) return null;
    return new Book(row.id, row.title, row.isAvailable, row.createdAt, row.upDatedAt);
  }
}
