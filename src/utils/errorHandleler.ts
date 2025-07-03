import { Response } from "express";

export class AppError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.status = status;
  }
}

export const handleError = (res: Response, error: any) => {
  if (error instanceof AppError) {
    res.status(error.status).json({ success: false, message: error.message });
  } else {
    res
      .status(500)
      .json({
        success: false,
        message: error.message || "Internal Server Error",
      });
  }
};
