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
        min: 6
    },
    method: {
        type: String,
        enum: ["google", "facebook", "email"],
        required: true
    },
    google: {
        profile_id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    },
    facebook: {
        profile_id: {
            type: String
        },
        email: {
            type: String,
            lowercase: true
        }
    }
});

export const User = mongoose.model<iUser>('User', UserSchema);
