import {AuthRouter} from './routes/AuthRouter';
import {UserRouter} from './routes/UserRouter';
import {errorHandler} from './helpers/ErrorMiddleware';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as i18n from 'i18n';
import {authMiddleware} from './helpers/AuthHelpers';

class App {
   public app: express.Application;

   private userRouter: UserRouter;
   private authRouter: AuthRouter;

   constructor() {
      this.app = express();
      this.config();
      this.setupPreMiddlewares();
      this.setupRouters();
   }

   private config(): void {
      // start dotenv
      if (process.env.NODE_ENV === 'development') {
         dotenv.config({path: path.resolve(process.cwd(), '.dev.env')});
      } else if (process.env.NODE_ENV === 'test') {
         dotenv.config({path: path.resolve(process.cwd(), '.test.env')});
      } else {
         dotenv.config();
      }

      // setup i18n localization
      i18n.configure({
         locales: ['en', 'pt'],
         defaultLocale: 'en',
         directory: __dirname + '/../locales',
         // setting of log level DEBUG - default to require('debug')('i18n:debug')
         logDebugFn: function(msg) {
            console.log('debug', msg);
         },

         // setting of log level WARN - default to require('debug')('i18n:warn')
         logWarnFn: function(msg) {
            console.log('warn', msg);
         },

         // setting of log level ERROR - default to require('debug')('i18n:error')
         logErrorFn: function(msg) {
            console.log('error', msg);
         }
      });

      this.app.use(i18n.init);

      // support application/json type post data
      this.app.use(bodyParser.json());
      //support application/x-www-form-urlencoded post data
      this.app.use(bodyParser.urlencoded({extended: false}));
   }

   private setupPreMiddlewares() {
      // bind the auth middleware
      this.app.use(authMiddleware);
   }

   private setupRouters(): void {
      this.userRouter = new UserRouter(this.app);
      this.authRouter = new AuthRouter(this.app);

      // Main error handler middleware. All router errors are treated
      // and delivered in this middleware
      this.app.use(errorHandler);
   }
}

export default new App().app;
