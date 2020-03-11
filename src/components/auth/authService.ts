import { iUser } from '../../interfaces/iUser';
import * as bcrypt from 'bcrypt';
import { User } from '../users/usersModel';

export class AuthService {
  async registerUser(newUser: iUser) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(
      newUser.password,
      salt
    );

    const user = await new User({
      name: newUser.name,
      company: newUser.company,
      position: newUser.position,
      phone: newUser.phone,
      email: newUser.email,
      authMethod: 'emailAndPassword',
      password: hashedPassword
    });

    return user;
  }
}
