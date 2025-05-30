import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { Response } from 'express';
import { join } from 'path';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { CreateUserDto } from '../user/dto/create-user.dto';

@Controller('auth')
@ApiTags('Auth')

export class AuthController {
  constructor(private  authService: AuthService) { }

  @Post('login')
  login(@Body() body: LoginUserDto) {
    return this.authService.logIn(body);
  }

  @Post('register')
  register(@Body() body : RegisterUserDto){
    return this.authService.register(body);
  }
}
