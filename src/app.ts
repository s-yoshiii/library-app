import express from 'express';
import { BookController } from './presentation/bookController.js';

const app = express();

app.use(express.json());

const bookController = new BookController();

const PORT = process.env.PORT || 3000;
app.post('/books', bookController.add.bind(bookController));
app.get('/books/:id', bookController.findById.bind(bookController));

app.listen(PORT, () => console.log('Sever is running'));
