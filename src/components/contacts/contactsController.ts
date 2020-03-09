import { Request, Response } from 'express';
import { ContactsService } from './contactsService';
import { userErrors } from '../../errors/userErrors';
import { addAndUpdateContactValidation } from '../../validation';
const contactService = new ContactsService();

export class ContactsController {
  async getContactsByOwnerId(req: Request, res: Response) {
    const contatcList = await contactService.getContactsByOwnerId(
      req.params.ownerId
    );
    res.status(200).send(contatcList);
  }

  async createContact(req: Request, res: Response) {
    const { error } = addAndUpdateContactValidation(req.body);
    if (error) {
      res.status(userErrors.VALIDATION_ERROR.statusCode).send({
        Code: userErrors.VALIDATION_ERROR.statusCode,
        Type: userErrors.VALIDATION_ERROR.type,
        Description:
          userErrors.VALIDATION_ERROR.message + ': ' + error.details[0].message
      });
      return;
    }

    const newContact = await contactService.createContact(
      req.params.ownerId,
      req.body
    );
    if (!newContact) {
      res.status(400).send({
        Code: userErrors.ITEM_NOT_FOUND_ERROR.statusCode,
        Type: userErrors.ITEM_NOT_FOUND_ERROR.type,
        Description: userErrors.ITEM_NOT_FOUND_ERROR.message
      });
      return;
    }
    res.status(201).send(newContact);
  }

  async getContactById(req: Request, res: Response) {
    const targetContact = await contactService.getContactById(
      req.params.contactId
    );
    if (!targetContact) {
      res.status(400).send({
        Code: userErrors.ITEM_NOT_FOUND_ERROR.statusCode,
        Type: userErrors.ITEM_NOT_FOUND_ERROR.type,
        Description: userErrors.ITEM_NOT_FOUND_ERROR.message
      });
      return;
    }
    res.status(200).send(targetContact);
  }

  async updateContactById(req: Request, res: Response) {
    const { error } = addAndUpdateContactValidation(req.body);
    if (error) {
      res.status(userErrors.VALIDATION_ERROR.statusCode).send({
        Code: userErrors.VALIDATION_ERROR.statusCode,
        Type: userErrors.VALIDATION_ERROR.type,
        Description:
          userErrors.VALIDATION_ERROR.message + ': ' + error.details[0].message
      });
      return;
    }
    const updatedContact = await contactService.updateContactById(
      req.params.contactId,
      req.body
    );
    res.status(201).send(updatedContact);
  }

  async deleteContactById(req: Request, res: Response) {
    const deletedContact = await contactService.deleteContactById(
      req.params.contactId
    );
    res.status(200).send(deletedContact);
  }
}
