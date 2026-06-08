import type { FindBookByIdRequestDto } from '@/application/dtos/book/findBookByIdRequestDto.js';
import type { FindBookByIdResponseDto } from '@/application/dtos/book/findBookByIdResponseDto.js';

export interface FindBookByIdUseCaseInterface {
  execute(requestDto: FindBookByIdRequestDto): Promise<FindBookByIdResponseDto | null>;
}
