import { iContact } from '../../interfaces/iContact';
import { User } from '../users/usersModel';
import { Contact } from './contactsModel';

export class ContactsService {
  async createContact(
    ownerId: string,
    contactInfo: iContact
  ) {
    const existingUser = await User.findOne({
      _id: ownerId
    });

    if (!existingUser) {
      return;
    } else {
      const newContact = await Contact.create({
        _id: contactInfo._id,
        name: contactInfo.name,
        company: contactInfo.company,
        position: contactInfo.position,
        email: contactInfo.email,
        phone: contactInfo.phone,
        ownerId: ownerId
      });

      await newContact.save();
      return newContact;
    }
  }

  getContactsByOwnerId(ownerId: string) {
    return Contact.find({
      ownerId: ownerId
    });
  }

  getContactById(contactId: string) {
    return Contact.findById(contactId);
  }

  async updateContactById(
    contactId: string,
    updates: iContact,
    contactImage?: any
  ) {
    const updatedContact = await Contact.findOneAndUpdate(
      { _id: contactId },
      updates,
      { new: true }
    );
    if (updatedContact) await updatedContact.save();
    return updatedContact;
  }

  async deleteContactById(contactId: string) {
    return Contact.findOneAndDelete({ _id: contactId });
  }
}
