import * as mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import * as uniqueValidator from "mongoose-unique-validator";

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
})

// Password comparsion method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
}

// Pre Save Hook to hash the password
UserSchema.pre('save', async function(next) {
    const user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // hash the new password and update
    const password: string = user.get('password');
    const hash = await bcrypt.hash(password, SALT_WORK_FACTOR);
    user.set('password', hash);

    next();
});

UserSchema.plugin(uniqueValidator, {message : "We found an user with the same {PATH}"});

export const User = mongoose.model('User', UserSchema);