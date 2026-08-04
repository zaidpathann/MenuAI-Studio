export class AppError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, code, message, details = {}) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}
export const errorHandler = (error, _req, res, _next) => {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: { code: error.code, message: error.message, details: error.details }
        });
    }
    if (error?.name === "MulterError") {
        return res.status(400).json({
            error: { code: "UPLOAD_ERROR", message: error.message, details: {} }
        });
    }
    if (error?.message === "Only PDF uploads are allowed for this MVP") {
        return res.status(400).json({
            error: { code: "INVALID_UPLOAD", message: error.message, details: {} }
        });
    }
    console.error(error);
    return res.status(500).json({
        error: { code: "INTERNAL_SERVER_ERROR", message: "Something went wrong", details: {} }
    });
};
