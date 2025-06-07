import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @Type()
  @IsNumber({}, { each: true })
  @IsArray()
  @ApiProperty({ default: [] })
  images: number[];

  @Type()
  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;
}
