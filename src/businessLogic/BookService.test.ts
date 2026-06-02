/// <reference types="jest" />
import { Book } from '../domain/entities/book.js';
import type { BookRepositoryInterface } from '../domain/repositories/BookRepositoryInterface.js';
import { BookService } from './BookService.js';

const mockBookRepository: jest.Mocked<BookRepositoryInterface> = {
  create: jest.fn(),
  findById: jest.fn(),
};

describe('BookService', () => {
  let bookService: BookService;
  beforeEach(() => {
    bookService = new BookService(mockBookRepository);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('書籍の登録が成功する', async () => {
    const newBook = new Book('1', 'Test Book', true, new Date(), new Date());
    mockBookRepository.create.mockResolvedValue(newBook);
    const result = await bookService.add('Test Book');
    expect(result).toEqual(newBook);
    expect(mockBookRepository.create).toHaveBeenCalledWith('Test Book');
  });
  it('書籍の検索が成功する', async () => {
    const book = new Book('1', 'Test Book', true, new Date(), new Date());
    mockBookRepository.findById.mockResolvedValue(book);
    const result = await bookService.findById('1');
    expect(result).toEqual(book);
    expect(mockBookRepository.findById).toHaveBeenCalledWith('1');
  });
  it('存在しないIDの場合はnullを返す', async () => {
    mockBookRepository.findById.mockResolvedValue(null);
    const result = await bookService.findById('999');
    expect(result).toBeNull();
    expect(mockBookRepository.findById).toHaveBeenCalledWith('999');
  });
});
