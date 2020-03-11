import { Request, Response } from 'express';
import { ContactsService } from './contactsService';
import { userErrors } from '../../errors/userErrors';
import { addAndUpdateContactValidation } from '../../validation';
import * as csv from 'fast-csv';
import * as fs from 'fs';
import { Contact } from './contactsModel';
const contactService = new ContactsService();
const json2csv = require('json2csv').parse;



export class ContactsController {
  async getContactsByOwnerId(req: Request, res: Response) {
    //Pagination and sorting
    const pagination = req.query.pagination
      ? parseInt(req.query.pagination)
      : 100;
    const page = req.query.page
      ? parseInt(req.query.page)
      : 1;

    const contatcList = await contactService
      .getContactsByOwnerId(req.params.ownerId)
      .skip((page - 1) * pagination)
      .limit(pagination)
      .sort({ name: 1, company: 1 });

    res.status(200).send(contatcList);
  }

  async createContact(req: Request, res: Response) {
    const { error } = addAndUpdateContactValidation(
      req.body
    );
    if (error) {
      res
        .status(userErrors.VALIDATION_ERROR.statusCode)
        .send({
          Code: userErrors.VALIDATION_ERROR.statusCode,
          Type: userErrors.VALIDATION_ERROR.type,
          Description:
            userErrors.VALIDATION_ERROR.message +
            ': ' +
            error.details[0].message
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
    //Validation of input params
    const { error } = addAndUpdateContactValidation(
      req.body
    );
    if (error) {
      res
        .status(userErrors.VALIDATION_ERROR.statusCode)
        .send({
          Code: userErrors.VALIDATION_ERROR.statusCode,
          Type: userErrors.VALIDATION_ERROR.type,
          Description:
            userErrors.VALIDATION_ERROR.message +
            ': ' +
            error.details[0].message
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

  //csv
  async importCsv(req: Request, res: Response) {
    const fileRows: any[] = [];
    csv
      .parseFile(req.file.path)
      .on('data', function(data: any) {
        fileRows.push(data); // push each row
      })
      .on('end', function() {
        //contains array of arrays. Each inner array represents row of the csv file, with each element of it a column
        fs.unlinkSync(req.file.path); // remove temp file
        res.status(200).send({
          status:
            '.csv contacts were succcesfully imported',
          contacts: fileRows
        });
      });
  }

  async exportToCsv(req: Request, res: Response) {
    const contactList = await Contact.find({
      ownerId: req.params.ownerId
    });
    const fields = ['name', 'company'];
    const csv = json2csv(contactList, {fields: fields});
    fs.writeFile('csv/importedContacts.csv', csv, (err) => {
      if(err) throw err;
    });
    res.status(200).send({
      status: 'contacts where successfully converted to .csv',
      contacts: csv
    })
  }
}

