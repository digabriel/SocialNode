"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const APIError_1 = require("./../models/APIError");
const express_1 = require("express");
const check_1 = require("express-validator/check");
class AuthRouter {
    constructor(app) {
        this.authValidations = [
            check_1.check('email').isEmail(),
            check_1.check('password').not().isEmpty()
        ];
        this.router = express_1.Router();
        this.config();
        app.use('/auth', this.router);
    }
    config() {
        this.router.post('/', this.authValidations, this.authenticate);
    }
    authenticate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!check_1.validationResult(req).isEmpty()) {
                const apiError = new APIError_1.APIError(res.__('auth_wrong_request_message'), 422, 422);
                return next(apiError);
            }
        });
    }
}
exports.AuthRouter = AuthRouter;
//# sourceMappingURL=AuthRouter.js.map