import type { BookRepositoryInterface } from '@/dataAccess/BookRepositoryInterface.js';
import type { Book } from '@/generated/prisma/client.js';
import type { BookServiceInterface } from './BookServiceInterface.js';

export class BookService implements BookServiceInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}
  async add(title: string): Promise<Book> {
    return await this.bookRepository.create(title);
  }
  async findById(id: string): Promise<Book | null> {
    return await this.bookRepository.findById(id);
  }
}
