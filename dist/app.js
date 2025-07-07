"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const book_controllers_1 = require("./controllers/book.controllers");
const borrow_controllers_1 = __importDefault(require("./controllers/borrow.controllers"));
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/books", book_controllers_1.booksRoutes);
app.use("/api/borrow", borrow_controllers_1.default);
app.get("/", (req, res) => {
    res.send("Library Management API is running");
});
// Error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message || "Internal Server Error" });
});
exports.default = app;
