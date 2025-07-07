"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_model_1 = require("../models/book.model");
const borrow_model_1 = require("../models/borrow.model");
const errorHandleler_1 = require("../utils/errorHandleler");
const borrowRoutes = express_1.default.Router();
exports.default = borrowRoutes;
// POST /api/borrow - Borrow a book
const borrowHandler = async (req, res) => {
    try {
        const { book: bookId, quantity, dueDate } = req.body;
        // Validate input
        if (!bookId || !quantity || !dueDate) {
            res.status(400).json({
                success: false,
                message: "Missing required fields: book, quantity, dueDate",
            });
            return;
        }
        if (quantity < 1) {
            res.status(400).json({
                success: false,
                message: "Quantity must be at least 1",
            });
            return;
        }
        // Check book availability
        const book = await book_model_1.Book.findById(bookId);
        if (!book) {
            res.status(404).json({
                success: false,
                message: "Book not found",
            });
            return;
        }
        if (book.copies < quantity) {
            res.status(400).json({
                success: false,
                message: "Not enough copies available",
            });
            return;
        }
        // Update book availability
        book.copies -= quantity;
        book.available = book.copies > 0;
        await book.save();
        // Create borrow record
        const borrow = await borrow_model_1.Borrow.create({
            book: bookId,
            quantity,
            dueDate: new Date(dueDate),
        });
        // Get complete borrow record
        const result = await borrow_model_1.Borrow.findById(borrow._id).lean().exec();
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data: result,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
};
borrowRoutes.post("/", borrowHandler);
// GET /api/borrow - Borrowed Books Summary
const borrowSummaryHandler = async (req, res) => {
    try {
        const summary = await borrow_model_1.Borrow.aggregate([
            {
                $group: {
                    _id: "$book",
                    totalQuantity: { $sum: "$quantity" },
                },
            },
            {
                $lookup: {
                    from: "books",
                    localField: "_id",
                    foreignField: "_id",
                    as: "bookInfo",
                },
            },
            { $unwind: "$bookInfo" },
            {
                $project: {
                    _id: 0,
                    book: {
                        title: "$bookInfo.title",
                        isbn: "$bookInfo.isbn",
                    },
                    totalQuantity: 1,
                },
            },
        ]);
        res.status(200).json({
            success: true,
            message: "Borrowed books summary retrieved successfully",
            data: summary,
        });
    }
    catch (error) {
        (0, errorHandleler_1.handleError)(res, error);
    }
};
borrowRoutes.get("/", borrowSummaryHandler);
