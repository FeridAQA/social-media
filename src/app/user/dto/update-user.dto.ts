import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PickType(PartialType(CreateUserDto), [
  'firstName',
  'lastName',
  'userName',
  'birthDate',
]) {
  @Type()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  profilePictureId: number;

  @Type()
  @IsString()
  @IsOptional()
  @ApiProperty()
  @Length(0, 500)
  bio: string;

  @Type()
  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false, default: false })
  isPrivate: boolean;
}
