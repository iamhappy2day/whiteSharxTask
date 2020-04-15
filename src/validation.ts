import * as Joi from '@hapi/joi';
import { iContact } from './interfaces/iContact';
import { iUser } from './interfaces/iUser';

export const addAndUpdateContactValidation = (
  contact: iContact
) => {
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
    email: Joi.string()
      .email()
      .min(6),
    password: Joi.string()
      .min(3)
      .required(),
    passwordConfirm: Joi.string()
      .min(3)
      .required()
      .valid(Joi.ref('password'))
      .error(new Error('Password and passwordConfirm are not equal'))
  });
  return schema.validate(user);
};

interface iReset {
  token: string;
  password: string;
  passwordConfirm: string;
}

export const resetPasswordValidation = (
  resetPasswordData: iReset
) => {
  const schema = Joi.object({
    token: Joi.string(),
    password: Joi.string()
      .min(3)
      .required(),
    passwordConfirm: Joi.string()
      .min(3)
      .required()
      .valid(Joi.ref('password'))
      .error(
        new Error(
          'Password and confirmPassword are not equal'
        )
      )
  });
  return schema.validate(resetPasswordData);
};
