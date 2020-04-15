import { Document } from 'mongoose';

export interface iUser extends Document {
  createPasswordResetToken(): string;
  correctPassword(candidatePassword: string, userPassword: string): boolean;
  name: string;
  company: string;
  position: string;
  phone: string;
  links: string;
  email: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: string;
  passwordResetToken: string | undefined;
  passwordResetExpires: string | undefined;
}
