import express from 'express';
import { UserController } from './usersController';
import { checkAuthorization } from '../auth/authController';
import passport from 'passport';
export const userRouter = express.Router();
const userController = new UserController();

userRouter.route('/').get(userController.getUsers);

userRouter
  .route('/:id')
  .get(
    passport.authenticate('jwt', { session: false }),
    checkAuthorization,
    userController.getUserById
  )
  .put(
    passport.authenticate('jwt', { session: false }),
    checkAuthorization,
    userController.updateUser
  )
  .delete(
    passport.authenticate('jwt', { session: false }),
    checkAuthorization,
    userController.deleteUser
  );
