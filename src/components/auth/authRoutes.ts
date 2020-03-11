import express from 'express';
import passport from 'passport';
import { AuthController } from './authController';
import { catchErrors } from '../../errors/errorHandler';
const authController = new AuthController();
export const authRouter = express.Router();

const faceBookPassport = passport.authenticate(
  'facebookToken',
  {
    session: false
  }
);

authRouter
  .route('/facebook')
  .post(faceBookPassport, authController.facebookOauth);

authRouter
  .route('/register')
  .post(catchErrors(authController.userRegister));

authRouter
  .route('/login')
  .post(catchErrors(authController.userLogin));
