import { Document } from "mongoose";

export interface iUser extends Document {
    name: string;
    company: string;
    position: string;
    phone: string;
    links: string;
    email: string;
}
