import type { Book } from '@/domain/entities/book.js';

export interface BookServiceInterface {
  add(title: string): Promise<Book>;
  findById(id: string): Promise<Book | null>;
}
