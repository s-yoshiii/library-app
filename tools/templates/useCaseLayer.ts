import { capitalize, lowercaseFirst } from '../utils';

export function generateUseCaseInterface(entityName: string, useCaseName: string) {
  const content = `
import type { ${capitalize(useCaseName)}RequestDto } from '@/application/dtos/${lowercaseFirst(entityName)}/${lowercaseFirst(useCaseName)}RequestDto.js';
import type { ${capitalize(useCaseName)}ResponseDto } from '@/application/dtos/${lowercaseFirst(entityName)}/${lowercaseFirst(useCaseName)}ResponseDto.js';

export interface ${capitalize(useCaseName)}UseCaseInterface {
  execute(requestDto: ${capitalize(useCaseName)}RequestDto): Promise<${capitalize(useCaseName)}ResponseDto>;
}
`;
  return content.trim() + '\n';
}

export function generateUseCase(entityName: string, useCaseName: string) {
  const content = `
import type { ${capitalize(entityName)}RepositoryInterface } from '@/domain/repositories/${lowercaseFirst(entityName)}RepositoryInterface.js';
import type { ${capitalize(useCaseName)}RequestDto } from '@/application/dtos/${lowercaseFirst(entityName)}/${lowercaseFirst(useCaseName)}RequestDto.js';
import type { ${capitalize(useCaseName)}ResponseDto } from '@/application/dtos/${lowercaseFirst(entityName)}/${lowercaseFirst(useCaseName)}ResponseDto.js';
import type { ${capitalize(useCaseName)}UseCaseInterface } from './${lowercaseFirst(useCaseName)}UseCaseInterface.js';

export class ${capitalize(useCaseName)}UseCase implements ${capitalize(useCaseName)}UseCaseInterface {
  constructor(private readonly ${lowercaseFirst(entityName)}Repository: ${capitalize(entityName)}RepositoryInterface) {}

  async execute(_requestDto: ${capitalize(useCaseName)}RequestDto): Promise<${capitalize(useCaseName)}ResponseDto> {
    throw new Error('Not implemented');
  }
}
`;
  return content.trim() + '\n';
}

export function generateRequestDto(useCaseName: string) {
  const content = `
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ${capitalize(useCaseName)}RequestDto {
  // Add properties for ${lowercaseFirst(useCaseName)} request
}
`;
  return content.trim() + '\n';
}

export function generateResponseDto(useCaseName: string) {
  const content = `
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ${capitalize(useCaseName)}ResponseDto {
  // Add properties for ${lowercaseFirst(useCaseName)} response
}
`;
  return content.trim() + '\n';
}
