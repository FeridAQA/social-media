import { OmitType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/app/user/dto/create-user.dto';

export class RegisterUserDto extends OmitType(CreateUserDto, ['roles']) {}
