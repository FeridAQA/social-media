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

import * as crypto from 'crypto';

import * as dateFns from 'date-fns';

import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import config from 'src/config/config';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
  ) { }

  async logIn(param: LoginUserDto) {
    let user = await this.userService.findOne([{ userName: param.userName }, { email: param.userName }]);

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
    let user = await this.userService.create({ ...param, roles: [UserRole.USER] });
    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to My Social Media App',
        template: 'welcome',
        context: {
          fullName: user.fullName,
        },

      });

      console.log(user.fullName);
    } catch (err) {
      console.log('Email send error', err);
    }
    return user;
  }

  async forgetPassword(params: ForgetPasswordDto) {
    let user = await this.userService.findOne({ email: params.email });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    let activationToken = crypto.randomBytes(12).toString('hex')
    let activationExpire = dateFns.addMinutes(new Date(), 30);

    this.userService.update(user.id, { activationToken, activationExpire });

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Forget Password',
        template: 'forget_password',
        context: {
          fullName: user.fullName,
          url: `${config.appUrl}/auth/forget_password?token=${activationToken}&email=${user.email}`,
        },
      });
    } catch (err) {
      console.log('Email send error', err);
      throw new HttpException('Error sending email', 500);
    }

    return {
      status: 'success',
      message: 'Please check your email for the reset password link',
    }

  }

  async resetPassword(params: ResetPasswordDto) {
    let user = await this.userService.findOne(
      { email: params.email },
    );
    if (!user) throw new NotFoundException();
    if (user.activationToken != params.token)
      throw new HttpException('token is wrong', 400);
    if (user.activationExpire < new Date())
      throw new HttpException('activation token is expired', 400);

    if (params.password != params.repeatPassword)
      throw new HttpException('password is not same as repeatPassword', 400);

    let password = await bcrypt.hash(params.password, 10);

    await this.userService.update(user.id, {
      password,
      activationToken: null,
      activationExpire: null,
    });

    return {
      status: true,
      message: 'Your password is successfully updated',
    };
  }
}
