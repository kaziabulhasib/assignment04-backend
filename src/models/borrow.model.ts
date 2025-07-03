import { Schema, model, Document, Types } from "mongoose";
import { IBorrow } from "../interfaces/borrow.interface";

interface BorrowDocument extends IBorrow, Document {}

const borrowSchema = new Schema<BorrowDocument>(
  {
    book: { type: Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Borrow = model<BorrowDocument>("Borrow", borrowSchema);
