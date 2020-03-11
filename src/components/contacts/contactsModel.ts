import mongoose from 'mongoose';
import { iContact } from '../../interfaces/iContact';
const Schema = mongoose.Schema;

export const ContactSchema = new Schema({
  name: {
    type: String,
    min: 2
  },
  company: {
    type: String,
    max: 255,
    min: 2
  },
  position: {
    type: String,
    max: 255,
    min: 2
  },
  phone: {
    type: String,
    max: 50,
    min: 6
  },
  email: {
    type: String,
    max: 255,
    min: 6
  },
  ownerId: {
    type: String,
    required: true
  }
});

export const Contact = mongoose.model<iContact>(
  'Contact',
  ContactSchema
);
