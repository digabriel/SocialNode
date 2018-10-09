"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UserRouter_1 = require("./routes/UserRouter");
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");
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
        // support application/json type post data
        this.app.use(bodyParser.json());
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }
    setupRouters() {
        this.userRouter = new UserRouter_1.UserRouter(this.app);
    }
}
exports.default = new App().app;
//# sourceMappingURL=app.js.map