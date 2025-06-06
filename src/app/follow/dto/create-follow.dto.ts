import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreateFollowDto {
  @Type()
  @IsNumber()
  @ApiProperty()
  userId: number;
}
