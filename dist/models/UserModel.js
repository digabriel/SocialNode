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
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const SALT_WORK_FACTOR = 10;
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Enter your name'
    },
    email: {
        type: String,
        required: 'Enter your email',
        unique: true
    },
    gender: {
        type: String,
        required: false,
        enum: ["male", "female"]
    },
    password: {
        type: String,
        default: null,
        minlength: [6, 'Your password must have at least 6 characters']
    }
});
// Password comparsion method
UserSchema.methods.comparePassword = function (candidatePassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt.compare(candidatePassword, this.password);
    });
};
// Pre Save Hook to hash the password
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // only hash the password if it has been modified (or is new)
        if (!user.isModified('password'))
            return next();
        // hash the new password and update
        const password = user.get('password');
        const hash = yield bcrypt.hash(password, SALT_WORK_FACTOR);
        user.set('password', hash);
        next();
    });
});
UserSchema.plugin(uniqueValidator, { message: "We found an user with the same {PATH}" });
exports.User = mongoose.model('User', UserSchema);
//# sourceMappingURL=UserModel.js.map