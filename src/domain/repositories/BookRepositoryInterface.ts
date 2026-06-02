import type { Book } from '../entities/book.js';

export interface BookRepositoryInterface {
  create(title: string): Promise<Book>;
  findById(id: string): Promise<Book | null>;
}
