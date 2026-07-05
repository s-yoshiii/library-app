import type { LoanRepositoryInterface } from '@/domain/repositories/loanRepositoryInterface.js';
import type { ReturnBookRequestDto } from '@/application/dtos/loan/returnBookRequestDto.js';
import type { ReturnBookResponseDto } from '@/application/dtos/loan/returnBookResponseDto.js';
import type { ReturnBookUseCaseInterface } from './returnBookUseCaseInterface.js';
import type { BookRepositoryInterface } from '@/domain/repositories/bookRepositoryInterface.js';
import type { TransactionManagerInterface } from '@/application/utils/transactionManagerInterface.js';

export class ReturnBookUseCase implements ReturnBookUseCaseInterface {
  constructor(
    private readonly loanRepository: LoanRepositoryInterface,
    private readonly bookRepository: BookRepositoryInterface,
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  async execute(requestDto: ReturnBookRequestDto): Promise<ReturnBookResponseDto> {
    return await this.transactionManager.run(async (ctx) => {
      const loan = await this.loanRepository.findById(requestDto.id, ctx);
      if (!loan) {
        throw new Error('貸出記録が存在しません');
      }
      const book = await this.bookRepository.findById(loan.bookId, ctx);
      if (!book) {
        throw new Error('書籍が存在しません');
      }
      book.return();
      await this.bookRepository.update(book, ctx);
      loan.return();
      const updatedLoan = await this.loanRepository.update(loan, ctx);
      return {
        id: updatedLoan.id,
        returnDate: updatedLoan.returnDate,
        createdAt: updatedLoan.createdAt,
        updatedAt: updatedLoan.updatedAt,
      };
    });
  }
}
