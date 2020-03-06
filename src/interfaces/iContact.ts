import { Document } from "mongoose";

export interface iContact extends Document {
    name: string;
    company: string;
    position: string;
    phone: string;
    email: string;
    ownerId: string;
}
