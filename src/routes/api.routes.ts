import {iRoutes} from "../interfaces/iRoutes";
import {userRouter} from "../components/users/usersRoutes";

export const apiRoutes: iRoutes[] = [
    // { url: '/auth', router: authRouter },
    { url: '/users', router: userRouter}
    // { url: '/contacts', router: contactsRouter}
];
