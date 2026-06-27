import type { LoanRepositoryInterface } from '@/domain/repositories/loanRepositoryInterface.js';
import type { LoanBookRequestDto } from '@/application/dtos/loan/loanBookRequestDto.js';
import type { LoanBookResponseDto } from '@/application/dtos/loan/loanBookResponseDto.js';
import type { LoanBookUseCaseInterface } from './loanBookUseCaseInterface.js';
import type { BookRepositoryInterface } from '@/domain/repositories/BookRepositoryInterface.js';
import type { IdGeneratorInterface } from '@/domain/utils/idGeneratorInterface.js';
import { Loan } from '@/domain/entities/loan.js';
import type { TransactionManagerInterface } from '@/application/utils/transactionManagerInterface.js';

export class LoanBookUseCase implements LoanBookUseCaseInterface {
  constructor(
    private readonly loanRepository: LoanRepositoryInterface,
    private readonly bookRepository: BookRepositoryInterface,
    private readonly idGenerator: IdGeneratorInterface,
    private readonly transactionManager: TransactionManagerInterface,
  ) {}

  async execute(requestDto: LoanBookRequestDto): Promise<LoanBookResponseDto> {
    return await this.transactionManager.run(async (ctx) => {
      const book = await this.bookRepository.findById(requestDto.bookId, ctx);
      if (!book) {
        throw new Error('書籍が存在しません');
      }
      const loans = await this.loanRepository.findByUserId(requestDto.userId, ctx);
      if (loans.filter((loan) => loan.returnDate === null).length >= 5) {
        throw new Error('既に上限まで貸し出されています。');
      }
      book.loan();
      await this.bookRepository.update(book, ctx);
      const newLoan = new Loan(
        this.idGenerator.generate(),
        requestDto.bookId,
        requestDto.userId,
        new Date(),
      );
      const createLoan = await this.loanRepository.create(newLoan, ctx);

      return {
        id: createLoan.id,
        bookId: createLoan.bookId,
        userId: createLoan.userId,
        loanDate: createLoan.loanDate,
        dueDate: createLoan.dueDate,
        createdAt: createLoan.createdAt,
        updatedAt: createLoan.updatedAt,
      };
    });
  }
}
