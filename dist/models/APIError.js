"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIError extends Error {
    constructor(message, errorCode, statusCode) {
        super(message);
        this.name = "APIError";
        this.errorCode = errorCode || 500;
        this.statusCode = statusCode || 500;
    }
}
exports.APIError = APIError;
//# sourceMappingURL=APIError.js.map