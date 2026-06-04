import type { AddBookRequestDto } from '@/application/dtos/book/addBookRequestDto.js';
import type { AddBookResponseDto } from '@/application/dtos/book/addBookResponse.js';

export interface AddBookUseCaseInterface {
  execute(requestDto: AddBookRequestDto): Promise<AddBookResponseDto>;
}
