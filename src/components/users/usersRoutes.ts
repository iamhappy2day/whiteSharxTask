import express from 'express';
import { UserController } from './usersController';
import { checkAuthentication } from '../../middlewares/checkAuthentication';
import { checkAuthorization } from '../../middlewares/checkAuthorization';
export const userRouter = express.Router();
const userController = new UserController();

userRouter.route('/').get(userController.getUsers);

userRouter
  .route('/:id')
  .get(
    checkAuthentication,
    checkAuthorization,
    userController.getUserById
  )
  .put(
    checkAuthentication,
    checkAuthorization,
    userController.updateUser
  )
  .delete(
    checkAuthentication,
    checkAuthorization,
    userController.deleteUser
  );
