"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const errorHandleler_1 = require("../utils/errorHandleler");
exports.booksRoutes = express_1.default.Router();
// Validate book ID
const validateBookId = (bookId) => {
    if (!bookId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new errorHandleler_1.AppError("Invalid book ID format", 400);
    }
};
// Create a new book
exports.booksRoutes.post("/", async (req, res) => {
    try {
        const body = req.body;
        const book = await book_model_1.Book.create(body);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data: book,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
});
// Get all books (with filtering, sorting, and pagination)
exports.booksRoutes.get("/", async (req, res) => {
    try {
        const { filter, sortBy = "createdAt", sort = "desc", page = "1", limit = "10", } = req.query;
        const query = {};
        if (filter) {
            query.genre = filter;
        }
        const sortObj = {};
        sortObj[sortBy] = sort === "asc" ? 1 : -1;
        const pageNum = parseInt(page, 10) || 1;
        const limitNum = parseInt(limit, 10) || 10;
        const skip = (pageNum - 1) * limitNum;
        const [books, total] = await Promise.all([
            book_model_1.Book.find(query).sort(sortObj).skip(skip).limit(limitNum),
            book_model_1.Book.countDocuments(query),
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
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
});
// Get single book
exports.booksRoutes.get("/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        validateBookId(bookId);
        const book = await book_model_1.Book.findById(bookId);
        if (!book) {
            throw new errorHandleler_1.AppError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book retrieved successfully",
            data: book,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
});
// Update a book
exports.booksRoutes.put("/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        validateBookId(bookId);
        const updatedBody = req.body;
        const book = await book_model_1.Book.findByIdAndUpdate(bookId, updatedBody, {
            new: true,
            runValidators: true,
        });
        if (!book) {
            throw new errorHandleler_1.AppError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book updated successfully",
            data: book,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
});
// Delete a book
exports.booksRoutes.delete("/:bookId", async (req, res) => {
    try {
        const bookId = req.params.bookId;
        validateBookId(bookId);
        const book = await book_model_1.Book.findByIdAndDelete(bookId);
        if (!book) {
            throw new errorHandleler_1.AppError("Book not found", 404);
        }
        res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: null,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
});
