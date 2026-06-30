import { BookCommand } from '@/adapter/commands/bookCommand.js';
import { PrismaBookRepository } from '@/adapter/repositories/prismaBookRepository.js';
import { UuidGenerator } from '@/adapter/utils/uuidGenerator.js';
import { AddBookUseCase } from '@/application/usecases/book/addBookUseCase.js';
import { PrismaClient } from '@/generated/prisma/client.js';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import inquirer from 'inquirer';

async function main() {
  const adapter = new PrismaLibSql({ url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db' });
  const prisma = new PrismaClient({ adapter });
  const uuidGenerator = new UuidGenerator();
  const bookRepository = new PrismaBookRepository(prisma);
  const addBookUseCase = new AddBookUseCase(bookRepository, uuidGenerator);
  const bookCommand = new BookCommand(addBookUseCase);

  const { command } = await inquirer.prompt([
    {
      type: 'select',
      name: 'command',
      message: 'どのコマンドを実行しますか？',
      choices: ['書籍の登録'],
    },
  ]);
  if (command === '書籍の登録') {
    const { title } = await inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: '書籍のタイトルを入力してください',
      },
    ]);
    await bookCommand.addBook(title);
  }
}

main();
