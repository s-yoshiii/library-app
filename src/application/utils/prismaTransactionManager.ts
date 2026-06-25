import type { PrismaClient } from '@/generated/prisma/client.js';
import type { TransactionManagerInterface } from './transactionManagerInterface.js';
import type { TransactionContextInterface } from '@/domain/utils/transactionContextInterface.js';

export class PrismaTransactionManager implements TransactionManagerInterface {
  constructor(private readonly prisma: PrismaClient) {}
  async run<T>(operation: (ctx: TransactionContextInterface) => Promise<T>): Promise<T> {
    return await this.prisma.$transaction(
      async (ctx) => await operation(ctx as TransactionContextInterface),
    );
  }
}
