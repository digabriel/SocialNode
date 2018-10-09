export class APIError extends Error {
    readonly errorCode: number
    readonly statusCode: number

    constructor(message?: string, errorCode?: number, statusCode?: number) {
        super(message);
        
        this.name = "APIError";
        this.errorCode = errorCode || 500;
        this.statusCode = statusCode || 500;
    }
}