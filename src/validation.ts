import * as Joi from '@hapi/joi';

export const addAndUpdateContactValidation: any = (data: any) => {
    const schema = Joi.object({
        _id: Joi.string(),
        name: Joi.string().min(2),
        company: Joi.string().min(2),
        position: Joi.string().min(2),
        phone: Joi.string()
            .min(6)
            .max(20),
        links: Joi.string(),
        email: Joi.string().email(),
        contactImg: Joi.string()
    });
    return schema.validate(data);
};
