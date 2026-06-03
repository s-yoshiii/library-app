import { randomUUID } from 'crypto';
import type { BookRepositoryInterface } from '@/domain/repositories/BookRepositoryInterface.js';
import { Book } from '@/domain/entities/book.js';
import type { BookServiceInterface } from './BookServiceInterface.js';

export class BookService implements BookServiceInterface {
  constructor(private readonly bookRepository: BookRepositoryInterface) {}
  async add(title: string): Promise<Book> {
    const book = new Book(randomUUID(), title);
    return await this.bookRepository.create(book);
  }
  async findById(id: string): Promise<Book | null> {
    return await this.bookRepository.findById(id);
  }
}
