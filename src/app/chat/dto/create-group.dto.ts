import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsString, Length } from 'class-validator';

export class CreateGroupDto {
  @Type()
  @ApiProperty()
  @IsNumber({}, { each: true })
  userIds: number[];

  @Type()
  @ApiProperty()
  @IsString()
  @Length(3, 50)
  name: string;
}
