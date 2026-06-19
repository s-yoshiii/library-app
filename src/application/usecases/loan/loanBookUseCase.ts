import type { LoanRepositoryInterface } from '@/domain/repositories/loanRepositoryInterface.js';
import type { LoanBookRequestDto } from '@/application/dtos/loan/loanBookRequestDto.js';
import type { LoanBookResponseDto } from '@/application/dtos/loan/loanBookResponseDto.js';
import type { LoanBookUseCaseInterface } from './loanBookUseCaseInterface.js';
import type { BookRepositoryInterface } from '@/domain/repositories/BookRepositoryInterface.js';
import type { IdGeneratorInterface } from '@/domain/utils/idGeneratorInterface.js';

export class LoanBookUseCase implements LoanBookUseCaseInterface {
  constructor(
    private readonly loanRepository: LoanRepositoryInterface,
    private readonly bookRepository: BookRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
  ) {}

  async execute(_requestDto: LoanBookRequestDto): Promise<LoanBookResponseDto> {
    throw new Error('Not implemented');
  }
}
