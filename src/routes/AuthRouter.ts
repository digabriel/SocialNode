import { APIResponse } from './../models/APIResponse';
import { APIError, APIErrorCodes } from './../models/APIError';
import {User} from './../models/UserModel';
import {Router, Request, Response, Application} from "express";
import { check, validationResult } from 'express-validator/check';
import * as randomstring from 'randomstring';
import * as jwt from 'jsonwebtoken';

export class AuthRouter {
    private router: Router

    private authValidations = [
        check('email').isEmail(),
        check('password').not().isEmpty()
    ]

    constructor(app: Application) {
        this.router = Router()
        this.config();
        
        app.use('/auth', this.router);
    }

    private config() {
        this.router.post('/', this.authValidations, this.authenticate);
    }

    private async authenticate(req: Request, res: Response, next) {
        if (!validationResult(req).isEmpty()) {
            const apiError = new APIError(res.__('auth_wrong_request_message'), 400, 400)
            return next(apiError);
        }

        // Grant that an user with this email exists
        const count = await User.count({"email" : req.body.email});
        if (count == 0) {
            const apiError = new APIError(res.__('auth_failed_message'), APIErrorCodes.AUTH_FAILED, 401)
            return next(apiError);
        }

        //Fetch the user
        try { 
            const user = await User.findOne({"email" : req.body.email});
            const pass = await user.comparePassword(req.body.password);

            // Invalid password
            if (!pass) {
                const apiError = new APIError(res.__('auth_failed_message'), APIErrorCodes.AUTH_FAILED, 401)
                return next(apiError);
            }

            const refreshToken = randomstring.generate({length: 100, charset: 'alphabetic'});
            jwt.sign({'user_id' : user._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION_TIME}, function(err, token) {
                if (err) {
                    return next(APIError.unknown());
                }

                const data = {
                    access_token: token,
                    refresh_token: refreshToken,
                    user: user
                };
                
                res.status(200).json(new APIResponse(true, 200, data));
            })

        }catch (e) {
            return next(APIError.unknown());
        }
        

    }
}