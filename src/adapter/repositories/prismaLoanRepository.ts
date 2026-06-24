import type { PrismaClient } from '@/generated/prisma/client.js';
import { Loan } from '@/domain/entities/loan.js';
import type { LoanRepositoryInterface } from '@/domain/repositories/loanRepositoryInterface.js';

export class PrismaLoanRepository implements LoanRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(loan: Loan): Promise<Loan> {
    throw new Error('エラー');
    const createdLoan = await this.prisma.loan.create({
      data: {
        id: loan.id,
        bookId: loan.bookId,
        userId: loan.userId,
        loanDate: loan.loanDate,
        dueDate: loan.dueDate,
        returnDate: loan.returnDate,
        createdAt: loan.createdAt,
        updatedAt: loan.updatedAt,
      },
    });
    return new Loan(
      createdLoan.id,
      createdLoan.bookId,
      createdLoan.userId,
      createdLoan.loanDate,
      createdLoan.returnDate,
      createdLoan.createdAt,
      createdLoan.updatedAt,
    );
  }

  async findById(id: string): Promise<Loan | null> {
    const foundLoan = await this.prisma.loan.findUnique({
      where: { id },
    });
    if (!foundLoan) return null;
    return new Loan(
      foundLoan.id,
      foundLoan.bookId,
      foundLoan.userId,
      foundLoan.loanDate,
      foundLoan.returnDate,
      foundLoan.createdAt,
      foundLoan.updatedAt,
    );
  }
  async findByUserId(userId: string): Promise<Loan[]> {
    const foundLoans = await this.prisma.loan.findMany({
      where: { userId },
    });
    return foundLoans.map(
      (foundLoan) =>
        new Loan(
          foundLoan.id,
          foundLoan.bookId,
          foundLoan.userId,
          foundLoan.loanDate,
          foundLoan.returnDate,
          foundLoan.createdAt,
          foundLoan.updatedAt,
        ),
    );
  }
}
