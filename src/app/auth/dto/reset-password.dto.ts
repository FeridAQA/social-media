import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEmail, IsString, Length, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @Type()
  @IsString()
  @ApiProperty()
  @MinLength(10)
  token: string;

  @Type()
  @IsEmail()
  @ApiProperty()
  email: string;

  @Type()
  @IsString()
  @ApiProperty()
  @Length(3, 150)
  password: string;

  @Type()
  @IsString()
  @ApiProperty()
  @Length(3, 150)
  repeatPassword: string;
}
