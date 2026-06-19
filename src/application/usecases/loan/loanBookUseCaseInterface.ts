import type { LoanBookRequestDto } from '@/application/dtos/loan/loanBookRequestDto.js';
import type { LoanBookResponseDto } from '@/application/dtos/loan/loanBookResponseDto.js';

export interface LoanBookUseCaseInterface {
  execute(requestDto: LoanBookRequestDto): Promise<LoanBookResponseDto>;
}
