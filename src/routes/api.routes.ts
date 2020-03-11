import { iRoutes } from '../interfaces/iRoutes';
import { userRouter } from '../components/users/usersRoutes';
import { authRouter } from '../components/auth/authRoutes';
import { contactsRouter } from '../components/contacts/contactsRoutes';

export const apiRoutes: iRoutes[] = [
  { url: '/auth', router: authRouter },
  { url: '/users', router: userRouter },
  { url: '/contacts', router: contactsRouter }
];
