import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/app/user/dto/create-user.dto';

export class LoginUserDto extends PickType(CreateUserDto, [
  'userName',
  'password',
]) {}
