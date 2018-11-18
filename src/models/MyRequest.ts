import {Request} from 'express';

export default interface MyRequest extends Request {
   isAuthenticated: boolean;
   userId: string;
}
