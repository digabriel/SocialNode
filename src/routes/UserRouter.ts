import {BaseRouter} from './BaseRouter';
import {APIError, APIErrorCodes} from './../models/APIError';
import {APIResponse} from './../models/APIResponse';
import {User, UserInterface} from '../models/User';
import {Router, Request, Response, Application} from 'express';
import {Types, Schema} from 'mongoose';
import MyRequest from 'models/MyRequest';
import {Relationship} from 'models/Relationship';
import {ObjectID, ObjectId} from 'bson';

export class UserRouter extends BaseRouter<UserInterface> {
   private router: Router;

   constructor(app: Application) {
      super(User);
      this.router = Router();
      this.config();

      app.use('/users', this.router);
   }

   private config() {
      this.router.get('/', this.getUsers);
      this.router.post('/', this.createUser.bind(this));
      this.router.post('/:user_id/follow', this.validateUserIDParam.bind(this), this.followUser);
   }

   private async validateUserIDParam(req: Request, res: Response, next) {
      const userId = req.params.user_id;

      try {
         const exist = await this.exists(userId);
         if (!exist) {
            return next(APIError.resourceNotFound());
         }
      } catch (e) {
         return next(e);
      }

      next();
   }

   private getUsers(req: Request, res: Response) {
      res.send('Get Users!');
   }

   private createUser(req: Request, res: Response, next) {
      const newUser = new User(req.body);
      this.create(newUser, res, next);
   }

   private async followUser(req: MyRequest, res: Response, next) {
      // Check if we have a authenticated user
      if (!req.isAuthenticated) {
         return next(APIError.errorForCode(APIErrorCodes.INVALID_ACCESS_TOKEN, req));
      }

      const r = new Relationship();
      r.fromUser = new Schema.Types.ObjectId(req.userId);
      r.toUser = new Schema.Types.ObjectId(req.params.user_id);
      r.relation = 'follow';

      try {
         const d = await r.save();
         let response = new APIResponse(true, 201, d);
         res.status(201).send(response);
      } catch (err) {
         let apiError = new APIError(err.message, null, 422);
         next(apiError);
      }
   }
}
