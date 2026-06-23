import { Router } from 'express';
import { LoanController } from '@/adapter/controllers/loanController.js';

export function loanRoutes(_loanController: LoanController): Router {
  const router = Router();

  router.post('/', _loanController.loanBook.bind(_loanController));

  return router;
}
