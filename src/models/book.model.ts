import { Schema, model, Document } from "mongoose";
import { IBook } from "../interfaces/book.interface";

interface BookDocument extends IBook, Document {}

const bookSchema = new Schema<BookDocument>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String },
    copies: { type: Number, required: true },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Book = model<BookDocument>("Book", bookSchema);
