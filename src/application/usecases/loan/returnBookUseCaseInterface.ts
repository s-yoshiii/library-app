import type { ReturnBookRequestDto } from '@/application/dtos/loan/returnBookRequestDto.js';
import type { ReturnBookResponseDto } from '@/application/dtos/loan/returnBookResponseDto.js';

export interface ReturnBookUseCaseInterface {
  execute(requestDto: ReturnBookRequestDto): Promise<ReturnBookResponseDto>;
}
