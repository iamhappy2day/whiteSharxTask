import express from 'express';
import passport from 'passport';
import { AuthController } from './authController';
const authController = new AuthController();
export const authRouter = express.Router();

const faceBookPassport = passport.authenticate('facebookToken', {
  session: false
});


authRouter
  .route('/facebook')
  .post(faceBookPassport, authController.facebookOauth);

authRouter
    .route('/register')
     .post(authController.userRegister);

authRouter
    .route('/login')
    .post(authController.userLogin);
