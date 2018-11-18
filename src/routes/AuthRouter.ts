import {APIResponse} from './../models/APIResponse';
import {APIError, APIErrorCodes} from './../models/APIError';
import {User} from '../models/User';
import {Router, Request, Response, Application} from 'express';
import {check, validationResult} from 'express-validator/check';
import * as jwt from 'jsonwebtoken';
import {newAuthToken, newRefreshToken} from './../helpers/AuthHelpers';

export class AuthRouter {
   private router: Router;

   constructor(app: Application) {
      this.router = Router();
      this.config();

      app.use('/auth', this.router);
   }

   private config() {
      this.router.post('/', this.authValidators, this.validateAuth, this.authenticate.bind(this));
      this.router.post('/refresh', this.refreshValidators, this.refreshToken.bind(this));
   }

   // Auth validation
   private authValidators = [
      check('email').isEmail(),
      check('password')
         .not()
         .isEmpty()
   ];

   private refreshValidators = [
      check('access_token').isString(),
      check('refresh_token').isString()
   ];

   private async validateAuth(req: Request, res: Response, next) {
      // Check if the request is empty
      if (!validationResult(req).isEmpty()) {
         const apiError = new APIError(res.__('auth_wrong_request_message'), 400, 400);
         return next(apiError);
      }

      // Grant that an user with this email exists
      const count = await User.count({email: req.body.email});
      if (count == 0) {
         return next(APIError.errorForCode(APIErrorCodes.AUTH_FAILED, req));
      }

      next();
   }

   // Auth authentication
   private async authenticate(req: Request, res: Response, next) {
      //Fetch the user
      try {
         const user = await User.findOne({email: req.body.email});
         const pass = await user.comparePassword(req.body.password);

         // Invalid password
         if (!pass) {
            return next(APIError.errorForCode(APIErrorCodes.AUTH_FAILED, req));
         }

         const refreshToken = newRefreshToken();
         const token = await newAuthToken(user._id, refreshToken);

         const data = {
            access_token: token,
            refresh_token: refreshToken,
            user: user
         };

         res.status(200).json(new APIResponse(true, 200, data));
      } catch (e) {
         return next(APIError.unknown());
      }
   }

   // Auth Refresh
   private refreshToken(req: Request, res: Response, next) {
      const self = this;
      // Check if the request is empty
      if (!validationResult(req).isEmpty()) {
         const apiError = new APIError(res.__('auth_refresh_wrong_request_message'), 400, 400);
         return next(apiError);
      }

      // Check if the access_token is valid
      jwt.verify(req.body.access_token, process.env.JWT_SECRET, async (err, decoded) => {
         if (err || !decoded) {
            return next(APIError.errorForCode(APIErrorCodes.INVALID_ACCESS_TOKEN, req));
         }

         // Check if the refresh_token is valid
         if (decoded.refresh_token != req.body.refresh_token) {
            return next(APIError.errorForCode(APIErrorCodes.INVALID_REFRESH_TOKEN, req));
         }

         // Generate a new combination of access_token and refresh_token
         const refreshToken = newRefreshToken();
         try {
            const newToken = await newAuthToken(decoded.user_id, refreshToken);

            const data = {
               access_token: newToken,
               refresh_token: refreshToken
            };

            res.status(200).json(new APIResponse(true, 200, data));
         } catch (err) {
            return next(err);
         }
      });
   }
}
