export class APIResponse {
    readonly success: Boolean
    readonly code: number
    readonly data: any
    readonly message: string

    constructor(success: Boolean, code?: number, data?: any, message?: string) {
        this.success = success;
        this.code = code;
        this.data = data;
        this.message = message;
    }
}