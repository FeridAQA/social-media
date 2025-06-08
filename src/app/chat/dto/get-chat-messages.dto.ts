import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class GetChatMessagesDto {
  @Type()
  @ApiProperty({ default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  page: number;

  @Type()
  @ApiProperty({ default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(20)
  limit: number;
}
