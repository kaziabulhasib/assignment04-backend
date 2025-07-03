import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import { booksRoutes } from "./controllers/book.controllers";
import borrowRoutes from "./controllers/borrow.controllers";

const app: Application = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Library Management API is running");
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

export default app;
