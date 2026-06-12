import { capitalize, lowercaseFirst } from '../utils';

export function generateController(entityName: string, useCaseName: string) {
  const content = `
import type { Request, Response } from 'express';
import type { ${capitalize(useCaseName)}UseCaseInterface } from '@/application/usecases/${lowercaseFirst(entityName)}/${lowercaseFirst(useCaseName)}UseCaseInterface.js';
import type { ${capitalize(useCaseName)}RequestDto } from '@/application/dtos/${lowercaseFirst(entityName)}/${lowercaseFirst(useCaseName)}RequestDto.js';

export class ${capitalize(entityName)}Controller {
  constructor(
    private readonly ${lowercaseFirst(useCaseName)}UseCase: ${capitalize(
      useCaseName,
    )}UseCaseInterface
    // Add other useCase propaties as needed
  ) {}

  async ${lowercaseFirst(useCaseName)}(req: Request, res: Response): Promise<void> {
    try {
      const requestDto: ${capitalize(useCaseName)}RequestDto = {}
      const ${entityName} = await this.${lowercaseFirst(useCaseName)}UseCase.execute(requestDto);
  
      res.status(200).json(${entityName});
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '' });
    }
  }
}
`;
  return content.trim() + '\n';
}

export function generatePrismaRepository(entityName: string) {
  const capitalEntityName = capitalize(entityName);
  const lowercaseEntityName = lowercaseFirst(entityName);

  const repositoryInterfaceClassName = `${capitalEntityName}RepositoryInterface`;
  const repositoryInterfaceFileName = `${lowercaseEntityName}RepositoryInterface`;

  const repositoryClassName = `Prisma${capitalEntityName}Repository`;

  const content = `
import type { PrismaClient } from '@/generated/prisma/client.js';
import { ${capitalEntityName} } from '@/domain/entities/${lowercaseEntityName}.js';
import type { ${repositoryInterfaceClassName} } from '@/domain/repositories/${repositoryInterfaceFileName}.js';

export class ${repositoryClassName} implements ${repositoryInterfaceClassName} {
  constructor(private readonly prisma: PrismaClient) {}

  async create(_${lowercaseEntityName}: ${capitalEntityName}): Promise<${capitalEntityName}> {
    throw new Error('Not implemented');
  }

  async findById(_id: string): Promise<${capitalEntityName} | null> {
    throw new Error('Not implemented');
  }
}
`;
  return content.trim() + '\n';
}
