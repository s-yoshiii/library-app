import { Router } from 'express';
import { LoanController } from '@/adapter/controllers/loanController.js';

export function loanRoutes(loanController: LoanController): Router {
  const router = Router();

  router.post('/', loanController.loanBook.bind(loanController));
  router.post('/return', loanController.returnBook.bind(loanController));

  return router;
}
