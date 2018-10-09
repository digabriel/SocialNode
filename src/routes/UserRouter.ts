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

    private async createUser(req: Request, res: Response) {
        const newUser = new User(req.body);
        
        try {
            const u = await newUser.save();
            res.status(201).send(u);
        }catch (err) {
            if (err.$isValidatorError) {
                console.log("Validation Error:" + err);
            }
            
            res.status(422).send(err);
        }
    }
}