import { APIError } from './../models/APIError';
import { APIResponse } from './../models/APIResponse';
import { User } from './../models/UserModel';
import {Router, Request, Response, Application} from "express";

export class UserRouter {
    private router: Router

    constructor(app: Application) {
        this.router = Router()
        this.config();
        
        app.use('/users', this.router);
    }

    private config() {
        this.router.get('/', this.getUsers);
        this.router.post('/', this.createUser);
    }

    private getUsers(req: Request, res: Response) {
        res.send("Get Users!");
    }

    private async createUser(req: Request, res: Response, next) {
        const newUser = new User(req.body);
        
        try {
            const u = await newUser.save();
            let response = new APIResponse(true, 201, u);
            res.status(201).send(response);
        }catch (err) {
            let apiError = new APIError(err.message, null, 422);
            next(apiError);
        }
    }
}