import { Request } from 'express';
import { User } from 'src/database/entities/User.entity';

export interface AuthorizedRequest extends Request {
  user: User;
}
