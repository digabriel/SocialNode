"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const APIResponse_1 = require("../models/APIResponse");
function errorHandler(err, req, res, next) {
    if (err.name == "APIError") {
        /*
         * Remove Error's `stack` property. We don't want
         * users to see this at the production env
         */
        if (req.app.get('env') !== 'development') {
            delete err.stack;
        }
        var j = new APIResponse_1.APIResponse(false, err.errorCode, null, err.message);
        return res.status(err.statusCode).json(j);
    }
    if (err.status == 400 && err.name == 'SyntaxError') {
        var j = new APIResponse_1.APIResponse(false, 400, null, "Malformed JSON");
        return res.status(err.statusCode).json(j);
    }
    next(err);
}
exports.errorHandler = errorHandler;
;
//# sourceMappingURL=ErrorMiddleware.js.map