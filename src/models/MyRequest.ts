import {Request} from 'express';

export default interface MyRequest extends Request {
   isAuthenticated: Boolean;
   userId: String;
}
