import passport from "passport";

export const checkAuthentication = passport.authenticate('jwt', {
    session: false
});
