export class APIError extends Error {
    readonly errorCode: number
    readonly statusCode: number

    constructor(message?: string, errorCode?: number, statusCode?: number) {
        super(message);
        
        this.name = "APIError";
        this.errorCode = errorCode || 500;
        this.statusCode = statusCode || 500;
    }

    static unknown() : APIError {
        return new APIError('An unknown error occured', APIErrorCodes.UNKNOWN, 500)
    }
}

export const APIErrorCodes = {
    UNKNOWN: 1001,
    AUTH_FAILED: 1002
}