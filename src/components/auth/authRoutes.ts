import express from 'express';
import passport from 'passport';
import { AuthController } from './authController';
const authController = new AuthController();
export const authRouter = express.Router();

const googlePassport = passport.authenticate('googleToken', {
  session: false
});

const faceBookPassport = passport.authenticate('facebookToken', {
  session: false
});

// authRouter.route('/google').post(googlePassport, authController.googleOAuth);

authRouter
  .route('/facebook')
  .post(faceBookPassport, authController.facebookOauth);
