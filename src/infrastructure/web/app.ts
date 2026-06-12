import express from 'express';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { BookController } from '../../adapter/controllers/bookController.js';
import { PrismaBookRepository } from '../../adapter/repositories/prismaBookRepository.js';
import { AddBookUseCase } from '../../application/usecases/book/addBookUseCase.js';
import { UuidGenerator } from '../../adapter/utils/uuidGenerator.js';
import { PrismaClient } from '../../generated/prisma/client.js';
import { bookRoutes } from './routers/bookRouter.js';
import { FindBookByIdUseCase } from '../../application/usecases/book/findBookByIdUseCase.js';

const app = express();

app.use(express.json());

const adapter = new PrismaLibSql({ url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });
const uuidGenerator = new UuidGenerator();
const bookRepository = new PrismaBookRepository(prisma);
const addBookUseCase = new AddBookUseCase(bookRepository, uuidGenerator);
const findBookByIdUseCase = new FindBookByIdUseCase(bookRepository);
const bookController = new BookController(addBookUseCase, findBookByIdUseCase);
app.use('/books', bookRoutes(bookController));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Sever is running'));
