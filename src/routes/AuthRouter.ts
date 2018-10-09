import { User } from './../models/UserModel';
import {Router, Request, Response, Application} from "express";

export class UserRouter {
    private router: Router

    constructor(app: Application) {
        this.router = Router()
        this.config();
        
        app.use('/auth', this.router);
    }

    private config() {
        //this.router.post('/', this.authenticate);
    }

    private async authenticate(req: Request, res: Response) {
        
    }
}