import type { Request, Response } from 'express';
import type { BookServiceInterface } from '@/businessLogic/BookServiceInterface.js';

export class BookController {
  constructor(private readonly bookService: BookServiceInterface) {}
  async add(req: Request, res: Response): Promise<void> {
    try {
      const title = req.body.title as string;
      const book = await this.bookService.add(title);
      res.status(201).json(book);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '書籍の登録に失敗しました。' });
    }
  }
  async findById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const book = await this.bookService.findById(id);
      if (book) {
        res.status(200).json(book);
      } else {
        res.status(404).json({ error: '書籍が見つかりませんでした。' });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: '書籍の検索に失敗しました。' });
    }
  }
}
