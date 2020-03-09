import { User } from './usersModel';
import { iUser } from '../../interfaces/iUser';
import mongoose from 'mongoose';
mongoose.set('useFindAndModify', false);

export class UserService {
  getUsers() {
    return User.find();
  }

  getUserById(userId: string) {
    return User.findById(userId);
  }

  async updateUser(updatedUser: iUser, userId: string) {
    return User.findOneAndUpdate(
        { _id: userId },
        updatedUser,
        { new: true }
        );
  }

  async deleteUser(userId: string) {
    return User.deleteOne({
      _id: userId
    });
  }
}
