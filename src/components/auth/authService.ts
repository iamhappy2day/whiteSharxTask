import { iUser } from '../../interfaces/iUser';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/usersModel';
import crypto from 'crypto';

export class AuthService {
  async registerUser(newUser: iUser) {

    const hashedPassword = await bcrypt.genSalt(10,  {
          bcrypt.hash(newUser.password, salt)
        }
    );

    console.log(hashedPassword)

    const user = await new User({
      name: newUser.name,
      company: newUser.company,
      position: newUser.position,
      phone: newUser.phone,
      email: newUser.email,
      authMethod: 'emailAndPassword',
      password: hashedPassword,
      passwordConfirm: hashedPassword
    });

    return user;
  }

  async forgetPassword(email: string) {
    const targetUser = await User.findOne({ email: email });
    if (!targetUser) {
      throw Error('There is no user with this email');
    }
    //generate the random reset token

    const resetToken = targetUser.createPasswordResetToken();
    await targetUser.save();
    return resetToken;
    //send it to user's email
    // const resetUrl = `${req.protocol}://$`
  }

  async resetPassword(token: string, password: string, passwordConfirm: string) {
    // Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const targetUser = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {$gt: Date.now()}
    });

    // If token has no expired, and there is user, set the new password
    if(!targetUser) {
      throw Error('Token is invalid or has expired')
    }

    targetUser.password = password;
    targetUser.passwordConfirm = passwordConfirm;

    targetUser.passwordResetToken = undefined;
    targetUser.passwordResetExpires = undefined;

    await targetUser.save();
    return  targetUser

  }

  async updatePassword (id: string, oldPassword: string, newPassword: string, newPasswordConfirm: string, ) {
    const user = await User.findById(id).select('+password');
    if (!user) {
      throw Error('there is no such user')
    }
    console.log(user)
    if (!( await user.correctPassword(oldPassword, user.password))) {
      throw Error('Wrong current password')
    }
    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save();

  }
}
