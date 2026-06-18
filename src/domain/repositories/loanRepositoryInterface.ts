import { Loan } from '../entities/loan.js';
export interface LoanRepositoryInterface {
  create(loan: Loan): Promise<Loan>;
  findById(id: string): Promise<Loan | null>;
  // Add other methods as needed.
}
