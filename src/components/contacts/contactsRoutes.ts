import express from 'express';
import { ContactsController } from './contactsController';
import passport from 'passport';
import { catchErrors } from '../../errors/errorHandler';
import { checkAuthorization } from '../auth/authController';

const contactsController = new ContactsController();
export const contactsRouter = express.Router();

contactsRouter
  .route('/:ownerId')
  .get(
    passport.authenticate('jwt', { session: false }),
    checkAuthorization,
    catchErrors(contactsController.getContactsByOwnerId)
  )
  .post(
    passport.authenticate('jwt', { session: false }),
    checkAuthorization,
    catchErrors(contactsController.createContact)
  );

contactsRouter
  .route('/target/:contactId')
  .get(
    passport.authenticate('jwt', { session: false }),
    catchErrors(contactsController.getContactById)
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    catchErrors(contactsController.updateContactById)
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    catchErrors(contactsController.deleteContactById)
  );
