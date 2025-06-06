import { Follow } from 'src/database/entities/Follow.entity';
import { FindOptionsSelect } from 'typeorm';
import { USER_BASIC_SELECT } from '../user/user.select';

export const FOLLOW_REQUEST_LIST_SELECT: FindOptionsSelect<Follow> = {
  followed: USER_BASIC_SELECT,
};
