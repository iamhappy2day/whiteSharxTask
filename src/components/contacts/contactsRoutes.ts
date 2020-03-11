import express from 'express';
import { ContactsController } from './contactsController';
import { catchErrors } from '../../errors/errorHandler';
import { checkAuthentication } from '../../middlewares/checkAuthentication';
import { checkAuthorization } from '../../middlewares/checkAuthorization';
export const contactsRouter = express.Router();
const contactsController = new ContactsController();
import multer from 'multer';
const upload = multer({ dest: 'csv/' });

contactsRouter
  .route('/:ownerId')
  .get(
    checkAuthentication,
    checkAuthorization,
    catchErrors(contactsController.getContactsByOwnerId)
  )
  .post(
    checkAuthentication,
    checkAuthorization,
    catchErrors(contactsController.createContact)
  );

contactsRouter
  .route('/target/:contactId')
  .get(
    checkAuthentication,
    checkAuthorization,
    catchErrors(contactsController.getContactById)
  )
  .put(
    checkAuthentication,
    checkAuthorization,
    catchErrors(contactsController.updateContactById)
  )
  .delete(
    checkAuthentication,
    checkAuthorization,
    catchErrors(contactsController.deleteContactById)
  );

//csv routes
contactsRouter
  .route('/importCsv/:ownerId')
  .post(
    upload.single('file'),
    catchErrors(contactsController.importCsv)
  );

contactsRouter
  .route('/exportToCsv/:ownerId')
  .get(catchErrors(contactsController.exportToCsv));
