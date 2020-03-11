import passport from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import { config } from '../../config';
import { User } from '../users/usersModel';
import { iUser } from '../../interfaces/iUser';
const JwtStrategy = require('passport-jwt').Strategy;
const { ExtractJwt } = require('passport-jwt');

//JWT strategy
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader(
        'authorization'
      ),
      secretOrKey: config.JWT_SECRET
    },
    async (payload: any, done: any) => {
      let user: iUser | null;
      try {
        if (payload._id) {
          user = await User.findById(payload._id);
          if (!user) {
            return done(null, false);
          }
          done(null, user);
        } else if (payload.userId) {
          user = await User.findById(payload.userId);
          if (!user) {
            return done(null, false);
          }
          done(null, user);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);

//facebook strategy
passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      // callbackURL: 'auth/facebook/redirect',
      clientID: config.FACEBOOK_CLIENT_ID,
      clientSecret: config.FACEBOOK_CLIENT_SECRET
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        //check if this current user exists in DB
        const existingUser = await User.findOne({
          'facebook.profile_id': profile.id
        });
        if (existingUser) {
          console.log('User already exists in our DB');

          return done(null, {
            existingUser: existingUser
          });
        }

        //if not create a new one
        console.log(
          'no such user! we are creating a new one'
        );
        const newUser = new User({
          authMethod: 'facebook',
          facebook: {
            profile_id: profile.id,
            email: profile.emails[0].value
          },
          name:
            profile.name.givenName +
            ' ' +
            profile.name.familyName
        });
        await newUser.save();
        return done(null, {
          existingUser: newUser
        });
      } catch (error) {
        console.log(error.message);
      }
    }
  )
);
