import { capitalize, lowercaseFirst } from '../utils';

export function generateEntity(name: string) {
  const content = `
export class ${capitalize(name)}{
    constructor(
    private _id:string,
    // Add other properties as needed
    ) {}
    get id():string {
        return this._id;
    }
}
  `;
  return content.trim() + '\n';
}

export function generateRepositoryInterface(name: string) {
  const Cap = capitalize(name);
  const low = lowercaseFirst(name);
  const content = [
    `import { ${Cap} } from '../entities/${low}';`,
    `export interface ${Cap}RepositoryInterface {`,
    `    create(${low}: ${Cap}): Promise<${Cap}>;`,
    `    findById(id: string): Promise<${Cap} | null>;`,
    `    // Add other methods as needed.`,
    `}`,
  ].join('\n');
  return content + '\n';
}
