import { UserRouter } from './routes/UserRouter';
import { errorHandler } from './helpers/ErrorMiddleware';
import * as express from "express";
import * as bodyParser from "body-parser";
import * as dotenv from "dotenv";
import * as path from "path";

class App {
    public app: express.Application;

    private userRouter: UserRouter

    constructor() {
        this.app = express();
        this.config(); 
        this.setupRouters();       
    }

    private config(): void {
        // start dotenv
        if (process.env.NODE_ENV === 'development') {
            dotenv.config({path: path.resolve(process.cwd(), '.dev.env')});
        }else if (process.env.NODE_ENV === 'test') {
            dotenv.config({path: path.resolve(process.cwd(), '.test.env')});
        }else {
            dotenv.config();
        }

        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private setupRouters(): void {
        this.userRouter = new UserRouter(this.app);


        this.app.use(errorHandler);
    }
}

export default new App().app;