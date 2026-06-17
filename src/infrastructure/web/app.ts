import express from 'express';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { BookController } from '../../adapter/controllers/bookController.js';
import { PrismaBookRepository } from '../../adapter/repositories/prismaBookRepository.js';
import { AddBookUseCase } from '../../application/usecases/book/addBookUseCase.js';
import { UuidGenerator } from '../../adapter/utils/uuidGenerator.js';
import { PrismaClient } from '../../generated/prisma/client.js';
import { bookRoutes } from './routers/bookRouter.js';
import { FindBookByIdUseCase } from '../../application/usecases/book/findBookByIdUseCase.js';
import { PrismaUserRepository } from '@/adapter/repositories/prismaUserRepository.js';
import { CreateUserUseCase } from '@/application/usecases/user/createUserUseCase.js';
import { UserController } from '@/adapter/controllers/userController.js';
import { userRoutes } from './routers/userRouter.js';

const app = express();

app.use(express.json());

const adapter = new PrismaLibSql({ url: process.env['DATABASE_URL'] ?? 'file:./prisma/dev.db' });
const prisma = new PrismaClient({ adapter });
const uuidGenerator = new UuidGenerator();
const bookRepository = new PrismaBookRepository(prisma);
const addBookUseCase = new AddBookUseCase(bookRepository, uuidGenerator);
const findBookByIdUseCase = new FindBookByIdUseCase(bookRepository);
const bookController = new BookController(addBookUseCase, findBookByIdUseCase);
const userRepository = new PrismaUserRepository(prisma);
const createUserUseCase = new CreateUserUseCase(userRepository, uuidGenerator);
const userController = new UserController(createUserUseCase);
app.use('/books', bookRoutes(bookController));
app.use('/users', userRoutes(userController));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log('Sever is running'));
