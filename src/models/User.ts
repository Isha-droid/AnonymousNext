import mongoose, { Schema, Document, Model } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: [true, 'Content is required'],
        minlength: [1, 'Content cannot be empty']
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isAcceptingMessage: boolean;
    message: Message[];
    isVerified: boolean;
}

const UserSchema = new Schema<User>({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long'],
        maxlength: [30, 'Username cannot exceed 30 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Email is invalid']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    verifyCode: {
        type: String,
        required: [true, 'Verification code is required']
    },
    verifyCodeExpiry: {
        type: Date,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    message: {
        type: [MessageSchema],
        default: []
    },
    isVerified: {
        type: Boolean,
        default: false
    }
});

const UserModel: Model<User> = mongoose.models.UserSchema || mongoose.model<User>('UserSchema', UserSchema);
export default UserModel;
