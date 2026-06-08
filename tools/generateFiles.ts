import inquirer from 'inquirer';

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
    console.log('Entity');
  } else if (layer === 'UseCase') {
    console.log('UseCase');
  } else if (layer === 'Interface adapter') {
    console.log('Interface adapter');
  } else if (layer === 'Framework & driver') {
    console.log('Framework & driver');
  }
}

main();
