import inquirer from 'inquirer';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateEntity, generateRepositoryInterface } from './templates/entityLayer';
import { lowercaseFirst, writeFile } from './utils';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateEntityLayer() {
  const { entityName } = await inquirer.prompt([
    {
      type: 'input',
      name: 'entityName',
      message: 'エンティティ名を入力してください。',
    },
  ]);
  const basePath = path.join(__dirname, '..', 'src', 'domain');
  const entityContent = generateEntity(entityName);
  writeFile(path.join(basePath, 'entities', `${lowercaseFirst(entityName)}.ts`), entityContent);
  const repositoryInterfaceContent = generateRepositoryInterface(entityName);
  writeFile(
    path.join(basePath, 'repositories', `${lowercaseFirst(entityName)}RepositoryInterface.ts`),
    repositoryInterfaceContent,
  );
}

async function main() {
  const layers = ['Entity', 'UseCase', 'Interface adapter', 'Framework & driver'] as const;
  type Layer = (typeof layers)[number];
  const { layer }: { layer: Layer } = await inquirer.prompt([
    {
      type: 'select',
      name: 'layer',
      message: 'どの層のファイルを生成しますか',
      choices: layers,
    },
  ]);
  if (layer === 'Entity') {
    await generateEntityLayer();
  } else if (layer === 'UseCase') {
    console.log('UseCase');
  } else if (layer === 'Interface adapter') {
    console.log('Interface adapter');
  } else if (layer === 'Framework & driver') {
    console.log('Framework & driver');
  }
}

main();
