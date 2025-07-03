import express, { Request, Response } from "express";
import { Book } from "../models/book.model";
import { handleError, AppError } from "../utils/errorHandleler";

export const booksRoutes = express.Router();

// Validate book ID
const validateBookId = (bookId: string): void => {
  if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new AppError("Invalid book ID format", 400);
  }
};

// Create a new book
booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const book = await Book.create(body);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Get all books (with filtering, sorting, and pagination)
booksRoutes.get("/", async (req: Request, res: Response) => {
  try {
    const {
      filter,
      sortBy = "createdAt",
      sort = "desc",
      page = "1",
      limit = "10",
    } = req.query;

    const query: any = {};
    if (filter) {
      query.genre = filter;
    }

    const sortObj: any = {};
    sortObj[sortBy as string] = sort === "asc" ? 1 : -1;

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const [books, total] = await Promise.all([
      Book.find(query).sort(sortObj).skip(skip).limit(limitNum),
      Book.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data: books,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Get single book
booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    validateBookId(bookId);

    const book = await Book.findById(bookId);
    if (!book) {
      throw new AppError("Book not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data: book,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Update a book
booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    validateBookId(bookId);

    const updatedBody = req.body;
    const book = await Book.findByIdAndUpdate(bookId, updatedBody, {
      new: true,
      runValidators: true,
    });

    if (!book) {
      throw new AppError("Book not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    handleError(res, error);
  }
});

// Delete a book
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  try {
    const bookId = req.params.bookId;
    validateBookId(bookId);

    const book = await Book.findByIdAndDelete(bookId);
    if (!book) {
      throw new AppError("Book not found", 404);
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    handleError(res, error);
  }
});
