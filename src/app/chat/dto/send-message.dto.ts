import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class SendMessageDto {
  @Type()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  userId: number;

  @Type()
  @IsNumber()
  @IsOptional()
  @ApiProperty({ required: false })
  chatId: number;

  @Type()
  @IsString()
  @Length(1, 800)
  @ApiProperty()
  messsage: string;
}
