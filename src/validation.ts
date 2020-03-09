import * as Joi from '@hapi/joi';
import {iContact} from "./interfaces/iContact";

export const addAndUpdateContactValidation: any = (contact: iContact) => {
    const schema = Joi.object({
        _id: Joi.string(),
        name: Joi.string().min(2),
        company: Joi.string().min(2),
        position: Joi.string().min(2),
        phone: Joi.string()
            .min(6)
            .max(20),
        email: Joi.string().email(),
    });
    return schema.validate(contact);
};
