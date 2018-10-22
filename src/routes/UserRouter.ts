import {APIError, APIErrorCodes} from './../models/APIError';
import {APIResponse} from './../models/APIResponse';
import {User} from './../models/UserModel';
import {Router, Request, Response, Application} from 'express';
import {Types} from 'mongoose';

export class UserRouter {
   private router: Router;

   constructor(app: Application) {
      this.router = Router();
      this.config();

      app.use('/users', this.router);
   }

   private config() {
      this.router.get('/', this.getUsers);
      this.router.post('/', this.createUser);
      this.router.post('/:user_id/follow', this.validateUserIDParam, this.followUser);
   }

   private async validateUserIDParam(req: Request, res: Response, next) {
      const userId = req.params.user_id;

      if (!Types.ObjectId.isValid(userId)) {
         return next(APIError.errorForCode(APIErrorCodes.RESOURCE_ID_NOT_FOUND, req));
      }

      const count = await User.count({_id: userId});
      if (count == 0) {
         return next(APIError.errorForCode(APIErrorCodes.RESOURCE_ID_NOT_FOUND, req));
      }

      next();
   }

   private getUsers(req: Request, res: Response) {
      res.send('Get Users!');
   }

   private async createUser(req: Request, res: Response, next) {
      const newUser = new User(req.body);

      try {
         const u = await newUser.save();
         let response = new APIResponse(true, 201, u);
         res.status(201).send(response);
      } catch (err) {
         let apiError = new APIError(err.message, null, 422);
         next(apiError);
      }
   }

   private async followUser(req: Request, res: Response, next) {
      res.status(200).send();
   }
}
