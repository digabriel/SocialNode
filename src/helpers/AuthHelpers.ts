import MyRequest from './../models/MyRequest';
import {APIResponse} from '../models/APIResponse';
import * as jwt from 'jsonwebtoken';
import {APIError} from './../models/APIError';
import * as randomstring from 'randomstring';
import {Response} from 'express';

export function newAuthToken(userId: String, refreshToken: String): Promise<String> {
   return new Promise<String>((resolve, reject) => {
      jwt.sign(
         {user_id: userId, refresh_token: refreshToken},
         process.env.JWT_SECRET,
         {expiresIn: process.env.JWT_EXPIRATION_TIME},
         function(err, token) {
            if (err) {
               return reject(APIError.unknown());
            }

            resolve(token);
         }
      );
   });
}

export function newRefreshToken(): String {
   const str = randomstring.generate({length: 100, charset: 'alphabetic'});
   return str;
}

export function authMiddleware(req: MyRequest, res: Response, next) {
   console.log(`URL: ${req.originalUrl}`);
   const accessToken = req.headers['access-token'] as string;

   if (accessToken) {
      jwt.verify(accessToken, process.env.JWT_SECRET, async (err, decoded) => {
         if (decoded) {
            if (decoded['user_id']) {
               req.userId = decoded['user_id'];
               req.isAuthenticated = true;
            }
         }

         next();
      });
   } else {
      next();
   }
}
