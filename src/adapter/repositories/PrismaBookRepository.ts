import type { PrismaClient } from '@/generated/prisma/client.js';
import { Book } from '../../domain/entities/book.js';
import type { BookRepositoryInterface } from '../../domain/repositories/BookRepositoryInterface.js';

export class PrismaBookRepository implements BookRepositoryInterface {
  private readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(book: Book): Promise<Book> {
    const createdBook = await this.prisma.book.create({
      data: { id: book.id, title: book.title, isAvailable: book.isAvailable },
    });
    return new Book(
      createdBook.id,
      createdBook.title,
      createdBook.isAvailable,
      createdBook.createdAt,
      createdBook.upDatedAt,
    );
  }

  // async findById(id: string): Promise<Book | null> {
  //   const row = await this.prisma.book.findUnique({ where: { id } });
  //   if (!row) return null;
  //   return new Book(row.id, row.title, row.isAvailable, row.createdAt, row.upDatedAt);
  // }

  async findById(_id: string): Promise<Book | null> {
    throw new Error('Not yet implemented');
  }
}
