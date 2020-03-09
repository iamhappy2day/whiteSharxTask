import mongoose from 'mongoose';
import {iUser} from "../../interfaces/iUser";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    name: {
        type: String,
        min: 2
    },
    company: {
        type: String,
        max: 50,
        min: 2
    },
    position: {
        type: String,
        max: 50,
        min: 2
    },
    phone: {
        type: String,
        max: 25,
        min: 6
    },
    email: {
        type: String,
        max: 255,
        min: 6,
        unique: true
    },
    authMethod: {
        type: String,
        enum: ["facebook", "emailAndPassword"],

    },
    facebook: {
        profile_id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    password: {
        type: String,
        max: 30,
        min: 3
    }

});

export const User = mongoose.model<iUser>('User', UserSchema);
