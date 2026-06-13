import { Router } from 'express';
import type { UserController } from '@/adapter/controllers/userController.js';

export function userRoutes(_userController: UserController): Router {
  const router = Router();

  // Implement routes

  return router;
}
