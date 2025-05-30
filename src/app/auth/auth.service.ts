import {
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserRole } from 'src/shared/enum/user.enum';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/login-user.dto';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) { }

  async logIn(param: LoginUserDto) {
    let user = await this.userService.findone([{ userName: param.userName }, { email: param.userName }]);

    if (!user) {
      throw new HttpException('Invalid username or password', 400);
    }

    let checkPassword = bcrypt.compareSync(param.password, user.password);
    if (!checkPassword) {
      throw new HttpException('Invalid username or password', 400);
    }

    let payload = {
      userId: user.id,

    };

    let token = this.jwtService.sign(payload);

    return {
      token,
      user
    }
  }


  async register(param: RegisterUserDto) {
    return this.userService.create({ ...param, roles: [UserRole.USER] });
  }

}
