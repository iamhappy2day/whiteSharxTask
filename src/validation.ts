import * as Joi from '@hapi/joi';
import {iContact} from "./interfaces/iContact";
import {iUser} from "./interfaces/iUser";

export const addAndUpdateContactValidation = (contact: iContact) => {
    const schema = Joi.object({
        _id: Joi.string(),
        name: Joi.string().min(2),
        company: Joi.string().min(2),
        position: Joi.string().min(2),
        phone: Joi.string()
            .min(6)
            .max(20),
        email: Joi.string().email(),
        ownerId: Joi.string()
    });
    return schema.validate(contact);
};


export const addAndUpdateUserValidation = (user: iUser) => {
    const schema = Joi.object({
        name: Joi.string().min(2),
        company: Joi.string().min(2),
        position: Joi.string().min(2),
        phone: Joi.string()
            .min(6)
            .max(20),
        email: Joi.string().email().min(6),
        password: Joi.string().min(3)
    });
    return schema.validate(user);
};
