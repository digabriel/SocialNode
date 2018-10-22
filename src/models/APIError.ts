import {Request} from 'express';

export const APIErrorCodes = {
   UNKNOWN: 1001,
   AUTH_FAILED: 1002,
   INVALID_ACCESS_TOKEN: 1003,
   INVALID_REFRESH_TOKEN: 1004,
   RESOURCE_ID_NOT_FOUND: 1005
};

export class APIError extends Error {
   readonly errorCode: number;
   readonly statusCode: number;

   constructor(message?: string, errorCode?: number, statusCode?: number) {
      super(message);

      this.name = 'APIError';
      this.errorCode = errorCode || 500;
      this.statusCode = statusCode || 500;
   }

   static unknown(): APIError {
      return new APIError('An unknown error occured', APIErrorCodes.UNKNOWN, 500);
   }

   static errorForCode(code: number, req: Request): APIError {
      switch (code) {
         case APIErrorCodes.UNKNOWN:
            return APIError.unknown();

         case APIErrorCodes.AUTH_FAILED:
            return new APIError(req.__('auth_failed_message'), code, 401);

         case APIErrorCodes.INVALID_ACCESS_TOKEN:
            return new APIError(req.__('auth_invalid_access_token_message'), code, 401);

         case APIErrorCodes.INVALID_REFRESH_TOKEN:
            return new APIError(req.__('auth_invalid_refresh_token_messgae'), code, 401);

         case APIErrorCodes.RESOURCE_ID_NOT_FOUND:
            return new APIError(req.__('resource_id_not_found_message'), code, 404);

         default:
            return APIError.unknown();
      }
   }
}
