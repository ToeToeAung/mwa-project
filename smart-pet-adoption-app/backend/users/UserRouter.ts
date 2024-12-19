import { Router } from 'express';
import { signin, signup, upload_picture ,listUsers} from './UserController';
import { checkToken } from './UserMiddleware';
import multer from 'multer';

const UserRouter = Router();
// Middleware
const uploadHelper = multer({ dest: 'pictures/',
    filename: 'mifile.jpg' });

UserRouter.post('/signup', signup);
UserRouter.post('/login', signin);
UserRouter.get('/', listUsers);
UserRouter.get('/:role', listUsers);
UserRouter.post('/pictures', checkToken, uploadHelper.single('profile_picture'), upload_picture);

export default UserRouter;