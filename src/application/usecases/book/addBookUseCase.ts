import type { BookRepositoryInterface } from '@/domain/repositories/BookRepositoryInterface.js';
import type { AddBookUseCaseInterface } from './addBookUseCaseInterface.js';
import type { IdGeneratorInterface } from '@/domain/utils/idGeneratorInterface.js';
import { Book } from '@/domain/entities/book.js';
import type { AddBookRequestDto } from '@/application/dtos/book/addBookRequestDto.js';
import type { AddBookResponseDto } from '@/application/dtos/book/addBookResponse.js';

export class AddBookUseCase implements AddBookUseCaseInterface {
  constructor(
    private readonly bookRepository: BookRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}
  async execute(requestDto: AddBookRequestDto): Promise<AddBookResponseDto> {
    const id = this.idGenerator.generate();
    const newBook = new Book(id, requestDto.title);
    const createdBook = await this.bookRepository.create(newBook);
    return {
      id: createdBook.id,
      title: createdBook.title,
      isAvailable: createdBook.isAvailable,
      createdAt: createdBook.createdAt,
      upDatedAt: createdBook.upDatedAt,
    };
  }
}
