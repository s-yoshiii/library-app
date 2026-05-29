import type { Book } from '@/generated/prisma/client.js';

export interface BookRepositoryInterface {
  create(title: string): Promise<Book>;
  findById(id: string): Promise<Book | null>;
}
