import type { BookRepositoryInterface } from '@/domain/repositories/BookRepositoryInterface.js';
import type { Book } from '@/domain/entities/book.js';
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
