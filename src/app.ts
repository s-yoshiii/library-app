import express from 'express';
import { BookController } from './adapter/controllers/bookController.js';
import { PrismaBookRepository } from './adapter/repositories/PrismaBookRepository.js';
import { AddBookUseCase } from './application/usecases/book/addBookUseCase.js';
import { UuidGenerator } from './adapter/utils/uuidGenerator.js';

const app = express();

app.use(express.json());

const bookRepository = new PrismaBookRepository();
const uuidGenerator = new UuidGenerator();
const addBookUseCase = new AddBookUseCase(bookRepository, uuidGenerator);
const bookController = new BookController(addBookUseCase);

const PORT = process.env.PORT || 3000;
app.post('/books', bookController.add.bind(bookController));

app.listen(PORT, () => console.log('Sever is running'));
