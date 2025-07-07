"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, status = 500) {
        super(message);
        this.status = status;
    }
}
exports.AppError = AppError;
const handleError = (res, error) => {
    if (error instanceof AppError) {
        res.status(error.status).json({ success: false, message: error.message });
    }
    else {
        res
            .status(500)
            .json({
            success: false,
            message: error.message || "Internal Server Error",
        });
    }
};
exports.handleError = handleError;
