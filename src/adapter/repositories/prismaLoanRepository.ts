import type { PrismaClient } from '@/generated/prisma/client.js';
import { Loan } from '@/domain/entities/loan.js';
import type { LoanRepositoryInterface } from '@/domain/repositories/loanRepositoryInterface.js';
import type { TransactionContextInterface } from '@/domain/utils/transactionContextInterface.js';

export class PrismaLoanRepository implements LoanRepositoryInterface {
  constructor(private readonly prisma: PrismaClient) {}

  async create(loan: Loan, ctx?: TransactionContextInterface): Promise<Loan> {
    const prisma = ctx ? (ctx as PrismaClient) : this.prisma;
    const createdLoan = await prisma.loan.create({
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

  async findById(id: string, ctx?: TransactionContextInterface): Promise<Loan | null> {
    const prisma = ctx ? (ctx as PrismaClient) : this.prisma;
    const foundLoan = await prisma.loan.findUnique({
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
  async findByUserId(userId: string, ctx?: TransactionContextInterface): Promise<Loan[]> {
    const prisma = ctx ? (ctx as PrismaClient) : this.prisma;
    const foundLoans = await prisma.loan.findMany({
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
