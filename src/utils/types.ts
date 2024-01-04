import { User } from 'src/users/entities/user.entity';

export interface UserRequest extends Request {
  user: User;
}
