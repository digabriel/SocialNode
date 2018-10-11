"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthRouter_1 = require("./routes/AuthRouter");
const UserRouter_1 = require("./routes/UserRouter");
const ErrorMiddleware_1 = require("./helpers/ErrorMiddleware");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
const i18n = require("i18n");
class App {
    constructor() {
        this.app = express();
        this.config();
        this.setupRouters();
    }
    config() {
        // start dotenv
        if (process.env.NODE_ENV === 'development') {
            dotenv.config({ path: path.resolve(process.cwd(), '.dev.env') });
        }
        else if (process.env.NODE_ENV === 'test') {
            dotenv.config({ path: path.resolve(process.cwd(), '.test.env') });
        }
        else {
            dotenv.config();
        }
        // setup i18n localization
        i18n.configure({
            locales: ['en', 'pt'],
            defaultLocale: 'en',
            directory: '../locales'
        });
        this.app.use(i18n.init);
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    setupRouters() {
        this.userRouter = new UserRouter_1.UserRouter(this.app);
        this.authRouter = new AuthRouter_1.AuthRouter(this.app);
        // Main error handler middleware. All router errors are treated
        // and delivered in this middleware
        this.app.use(ErrorMiddleware_1.errorHandler);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map