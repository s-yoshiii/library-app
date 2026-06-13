import { capitalize, lowercaseFirst } from '../utils';

export function generateRouter(entityName: string) {
  const content = `
import { Router } from 'express';
import type { ${capitalize(entityName)}Controller } from '@/adapter/controllers/${lowercaseFirst(entityName)}Controller.js';

export function ${lowercaseFirst(entityName)}Routes(_${lowercaseFirst(entityName)}Controller: ${capitalize(entityName)}Controller): Router {
  const router = Router();

  // Implement routes

  return router;
}
`;
  return content.trim() + '\n';
};
