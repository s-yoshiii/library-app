import express from 'express';
import { BookController } from './presentation/bookController.js';
import { PrismaBookRepository } from './dataAccess/PrismaBookRepository.js';
import { BookService } from './businessLogic/BookService.js';

const app = express();

app.use(express.json());

const bookRepository = new PrismaBookRepository();
const bookService = new BookService(bookRepository);
const bookController = new BookController(bookService);

const PORT = process.env.PORT || 3000;
app.post('/books', bookController.add.bind(bookController));
app.get('/books/:id', bookController.findById.bind(bookController));

app.listen(PORT, () => console.log('Sever is running'));
